export interface FileData {
  id: string;
  filename: string;
  updateAt: string;
  size: string;
  type: 'file' | 'folder';
}
