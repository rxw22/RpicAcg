import * as FileSystem from "expo-file-system";

class FileCache<T extends { _id: string }> {
  private data: T[];
  private path: string;
  static historyFilePath = "history.json";
  static collectFilePath = "collect.json";
  static cacheFileMime = "application/json";

  constructor(path: string) {
    this.path = `${FileSystem.documentDirectory}cache/${path}`;
    this.data = [];
    this.init();
  }

  async init() {
    const cacheFolder = `${FileSystem.documentDirectory}cache`;
    try {
      const folderInfo = await FileSystem.getInfoAsync(cacheFolder);
      if (!folderInfo.exists) {
        await FileSystem.makeDirectoryAsync(cacheFolder);
      }
    } catch (error) {
      console.log("Error while creating cache folder:", error);
    } finally {
      this.createCacheFile();
    }
  }

  async createCacheFile() {
    try {
      const fileInfo = await FileSystem.getInfoAsync(this.path);
      if (!fileInfo.exists) {
        await FileSystem.writeAsStringAsync(this.path, JSON.stringify([]));
      }
    } catch (error) {
      console.log("Error creating cache file:", error);
    }
  }

  async getData() {
    try {
      const result = await FileSystem.readAsStringAsync(this.path);
      this.data = JSON.parse(result);
      return this.data;
    } catch (error) {
      console.log("Get data error:", error);
      throw new Error("Get data error");
    }
  }

  async setData(data: T | undefined, callback?: () => void) {
    if (data) {
      try {
        const result = await this.getData();
        const rest = result.filter((item) => item._id !== data._id);
        await FileSystem.writeAsStringAsync(
          this.path,
          JSON.stringify([data, ...rest])
        );
        if (callback) {
          callback();
        }
      } catch (error) {
        console.log("Set data error:", error);
      }
    }
  }

  async remove(id: string) {
    try {
      const result = await this.getData();
      const rest = result.filter((item) => item._id !== id);
      await FileSystem.writeAsStringAsync(this.path, JSON.stringify(rest));
    } catch (error) {
      console.log("Remove data error:", error);
    }
  }

  async removeAll(callback?: () => void) {
    try {
      await FileSystem.writeAsStringAsync(this.path, JSON.stringify([]));
      if (callback) {
        callback();
      }
    } catch (error) {
      console.log("Remove all data error:", error);
    }
  }
}

export default FileCache;
