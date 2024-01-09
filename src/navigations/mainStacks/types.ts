<<<<<<< HEAD
import { ComicRecord } from "@/store/readStore";
=======
import { Comment } from "@/network/types";
>>>>>>> 2126990c587c242cce3361a6ff6885c104195b89

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
  };
  collect: undefined;
  comics: { c: string };
  comment: { comicId: string };
  comchildren: { comment: Comment };
  searchcomics: {
    keyword: string;
  };
};
