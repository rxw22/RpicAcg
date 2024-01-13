import { ComicRecord } from "@/store/readStore";
import { Comment } from "@/network/types";

export type RootStackParamList = {
  login: undefined;
  main: undefined;
  settings: undefined;
  search: undefined;
  details: { comicId: string };
  reader: {
    comicId: string;
    order: number;
    title: string;
    record: ComicRecord | undefined; // 阅读记录
    isScratch: boolean; // 从一章的头开始
    hasNext: boolean; // 是否还有下一章
  };
  collect: undefined;
  comics: { c?: string; ca?: string; knight?: string };
  comment: { comicId: string };
  comchildren: { comment: Comment };
  searchcomics: {
    keyword: string;
  };
  webview: {
    uri: string;
    source?: string;
    userAgent?: string;
    injectedJavaScript?: string;
  };
};
