export type RootStackParamList = {
  login: undefined;
  main: undefined;
  settings: undefined;
  search: undefined;
  details: { comicId: string };
  reader: { comicId: string; order: number; title: string };
  collect: undefined;
};
