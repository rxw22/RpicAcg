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
    chapterLength: number // 总共有几章
  };
  collect: undefined;
  comics: {
    c?: string;
    ca?: string;
    knight?: string;
    a?: string;
    ct?: string;
    t?: string;
  };
  comment: { comicId: string };
  comchildren: { comment?: Comment, commentId?: string };
  searchcomics: {
    keyword: string;
  };
  webview: {
    uri: string;
    source?: string;
    userAgent?: string;
    injectedJavaScript?: string;
  };
  "game-details": {
    gameId: string;
    title: string;
  };
  "game-comment": {
    gameId: string;
  };
  "my-comments": undefined,
  "net-collect": undefined,
  "local-collect": undefined,
  history: undefined,
  ranking: undefined
};
