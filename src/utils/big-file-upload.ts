import { encryptMd5 } from '@south/utils';
import axios from 'axios';
import type { AxiosResponse } from 'axios';
import pLimit from 'p-limit';

type UploadStatus = 'uploading' | 'success' | 'error';
interface UploadEvent {
  status: UploadStatus;
  progress: number;
  message?: string;
}
interface UploadProps {
  file: File;
  onChange: (event: UploadEvent) => void;
  replace?: boolean;
  chunkSize?: number;
  maxChunkNum?: number;
}
interface UploadItem {
  formData: FormData;
  cancel: () => void;
}
interface GlobalRes<T> {
  code: number;
  data: T;
  info: string;
}
type GetChunkRes = GlobalRes<{
  fileList: string[];
  filename: string;
}>;
type MergeRes = GlobalRes<{
  filename: string;
}>;
interface Chunk {
  file: Blob;
  hash: string;
  filename: string;
  loaded: number;
}
interface UploadParams {
  formData: FormData;
  index: number;
  onCancel?: (cancel: () => void) => void;
}
export class BigFileUpload {
  public maxChunkNum: number;
  public file: File;
  public chunkSize: number = 0;
  public hash: string;
  public onChange: (event: UploadEvent) => void;
  public chunks: Chunk[] = [];

  private readonly limit = pLimit(6);
  private readonly defaultChunkSize = 5;
  private readonly defaultMaxChunkNum = 200;

  private notUploadListMap: Map<number, UploadItem> = new Map(); // 待上传分片列表
  private count: number = 0; // 分片总数
  private fileSize: number = 0; // 已经上传的文件大小
  private replace: '0' | '1' = '0'; // 相同文件是否覆盖
  private paused: boolean = false;
  constructor(props: UploadProps) {
    const { file, chunkSize, replace, maxChunkNum, onChange } = props;
    this.file = file;
    this.fileSize = file.size;
    this.chunkSize = chunkSize
      ? BigFileUpload.getChunkSize(chunkSize)
      : BigFileUpload.getChunkSize(this.defaultChunkSize);
    this.maxChunkNum = maxChunkNum || this.defaultMaxChunkNum;
    this.replace = replace ? '1' : '0';
    this.onChange = onChange;
    this.hash = encryptMd5(`${file.name}-${file.size}-${file.lastModified}`);

    this.chunks = this.createFileChunk(file);
    this.getUploadList();
  }
  get suffix() {
    return /\.([a-zA-Z0-9]+)$/.exec(this.file.name)![1];
  }
  createFileChunk(file: File): Chunk[] {
    const { size } = file;
    const chunkCount = Math.ceil(size / this.chunkSize);
    this.count = chunkCount;
    if (chunkCount > this.maxChunkNum) {
      this.chunkSize = size / this.maxChunkNum;
      this.count = this.maxChunkNum;
    }

    let index = 0;
    const chunks = [];
    while (index < this.count) {
      const item = file.slice(index * this.chunkSize, (index + 1) * this.chunkSize);
      chunks.push({
        file: item,
        hash: this.hash,
        loaded: 0,
        filename: `${this.hash}_${index + 1}.${this.suffix}`,
      });
      index++;
    }
    return chunks;
  }
  async getUploadList() {
    try {
      const { hash, suffix } = this;
      const { data }: AxiosResponse<GetChunkRes> = await axios.get('/file_service/api/upload/get_chunks', {
        params: {
          hash,
          suffix,
          cover: this.replace, // 同名文件是否覆盖
        },
      });
      const {
        data: { fileList, filename },
        code,
        info,
      } = data;
      if (code !== 200) {
        this.onChange?.({
          status: 'error',
          progress: 1,
          message: `获取分片失败 ${info}`,
        });
        return;
      }
      let uploadList = this.chunks;
      if (fileList.length > 0) {
        this.fileSize = this.file.size - fileList.length * this.chunkSize;
        const set = new Set(fileList);
        uploadList = this.chunks.filter((chunk) => !set.has(chunk.filename));
        this.onChange?.({
          status: 'uploading',
          progress: (fileList.length * this.chunkSize) / this.fileSize,
        });
      }
      if (filename) {
        this.onChange({
          status: 'success',
          progress: 1,
          message: `上传成功`,
        });
        return;
      }
      if (uploadList.length > 0) {
        await Promise.all(this.createRequestList(uploadList));
      }
      this.mergeChunk();
    } catch (e) {
      if (!this.paused) {
        this.onChange?.({
          status: 'error',
          progress: 1,
          message: `获取分片失败 ${e}`,
        });
      }
    }
  }
  async mergeChunk() {
    try {
      const { data }: AxiosResponse<GlobalRes<MergeRes>> = await axios.get('/file_service/api/upload/merge', {
        params: {
          hash: this.hash,
          count: this.count,
        },
      });
      const { code, info } = data;
      if (code === 200) {
        this.onChange?.({
          status: 'success',
          message: '上传成功',
          progress: 1,
        });
      } else {
        this.onChange?.({
          status: 'error',
          progress: 1,
          message: `合并失败 ${info}`,
        });
      }
    } catch (e) {
      this.onChange?.({
        status: 'error',
        progress: 1,
        message: `合并失败 ${e}`,
      });
    }
  }
  uploadFile({ formData, index, onCancel }: UploadParams, retryTimes = 3) {
    return new Promise((resolve, reject) => {
      const controller = new AbortController();
      const signal = controller.signal;

      const attemptUpload = async (remainingRetries: number) => {
        try {
          await axios.post('/file_service/api/upload', formData, {
            signal,
            onUploadProgress: ({ loaded }) => {
              if (this.chunks[index].loaded < loaded) {
                this.chunks[index].loaded = loaded;
              }
              const currentProgress = this.chunks.reduce((acc, cur) => acc + cur.loaded, 0);
              const progress = currentProgress / this.fileSize;
              this.onChange?.({
                status: 'uploading',
                progress,
              });
            },
            headers: { 'content-type': 'multipart/form-data' },
          });
          this.notUploadListMap.delete(index);
          resolve('upload success');
        } catch {
          if (this.paused) {
            reject(new Error('Upload paused'));
            return;
          }
          if (remainingRetries > 0) {
            console.log(`重试上传序号 ${index} 分片，剩余重试次数: ${remainingRetries - 1}`);
            await new Promise((res) => setTimeout(res, 1000)); // **等待 1 秒再重试**
            attemptUpload(remainingRetries - 1);
          } else {
            this.onChange?.({
              status: 'error',
              progress: 1,
              message: `上传序号 ${index} 分片失败`,
            });
            reject(new Error(`上传序号 ${index} 分片失败`));
          }
        }
      };

      attemptUpload(retryTimes);

      // 提供取消上传的功能
      if (typeof onCancel === 'function') {
        onCancel(() => controller.abort());
      }
    });
  }

  createRequestList(chunkList: Chunk[]) {
    const requestList = chunkList
      .map(({ file, filename }) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('filename', filename);
        return formData;
      })
      .map((formData, index) =>
        this.limit(() =>
          this.uploadFile({
            formData,
            index,
            onCancel: (cancel) => {
              this.notUploadListMap.set(index, { formData, cancel });
            },
          })
        )
      );
    return requestList;
  }
  // 继续上传
  resumeUpload() {
    this.paused = false;
    this.getUploadList();
  }
  pauseUpload() {
    this.paused = true;
    this.notUploadListMap.forEach(({ cancel }) => cancel());
    this.limit.clearQueue();
    this.notUploadListMap.clear();
  }
  static getChunkSize = (size: number) => size * 1024 * 1024;
}
