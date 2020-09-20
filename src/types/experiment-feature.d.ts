interface FileSystemDirectoryHandle {
  getDirectory(): void;
  getEntries(): AsyncIterable<FileSystemFileHandle>;
  getFile(): void;
  isDirectory: boolean;
  isFile: boolean;
  name: string;
  removeEntry(): void;
  resolve(): void;
}

interface FileSystemFileHandle {
  isFile: boolean;
  isDirectory: boolean;
  name: string;
  createWritable(): FileSystemWritableFileStream;
  getFile(): Promise<File>;
}

interface FileSystemWritableFileStream extends WritableStream {
  close(): void;
  seek(): void;
  truncate(): void;
  write(): void;
}
