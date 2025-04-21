import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface FileState {
  fileList: File[];
  successCount: number; // 上传成功的文件数量
  open: boolean; // 是否打开文件列表
  setSuccessCount: () => void; // 设置上传成功的文件数量
  setOpen: (open: boolean) => void;
  setFileList: (fileList: File[]) => void;
  deleteFile: (index: number) => void; // 删除文件
}

export const useFileStore = create<FileState>()(
  devtools(
    (set) => ({
      fileList: [],
      open: false,
      successCount: 0,
      setOpen: (open: boolean) => set({ open }),
      setSuccessCount: () => set((state) => ({ successCount: state.successCount + 1 })),
      setFileList: (fileList) => set({ fileList }),
      deleteFile: (index: number) =>
        set((state) => {
          const newFileList = [...state.fileList];
          newFileList.splice(index, 1);
          return { fileList: newFileList };
        }),
    }),
    {
      enabled: process.env.NODE_ENV === 'development',
      name: 'fileStore',
    }
  )
);
