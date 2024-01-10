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
    record: ComicRecord | undefined;
    isScratch: boolean;
  };
  collect: undefined;
  comics: { c: string };
  comment: { comicId: string };
  comchildren: { comment: Comment };
  searchcomics: {
    keyword: string;
  };
  webview: { uri: string; source?: string; userAgent?: string; injectedJavaScript?: string };
};
