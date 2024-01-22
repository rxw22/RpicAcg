export interface BaseResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
}

export type SignInPayload = {
  email: string;
  password: string;
};

export interface ImageMedia {
  originalName: string;
  path: string;
  fileServer: string;
}

export interface Category {
  _id?: string;
  title: string;
  thumb: ImageMedia;
  isWeb?: boolean;
  active?: boolean;
  link?: string;
  description?: string;
}

export interface User {
  _id: string;
  birthday: string;
  email: string;
  gender: "m" | "f" | "bot";
  name: string;
  slogan?: string;
  title: string;
  verified: boolean;
  exp: number;
  level: number;
  characters: string[];
  character?: string;
  role?: string;
  created_at: string;
  avatar?: ImageMedia;
  isPunched: boolean;
}

export interface Comic {
  _id: string;
  title: string;
  author?: string;
  totalViews: number;
  totalLikes: number;
  pagesCount: number;
  epsCount: number;
  finished: boolean;
  categories: string[];
  thumb: ImageMedia;
  likesCount: number;
  id?: string;
}

export enum ComicSort {
  Default = "ua", // 默认
  NewToOld = "dd", // 新到旧
  OldToNew = "da", // 旧到新
  Like = "ld", // 爱心最多
  View = "vd", // 绅士指数最多
}

export enum LeaderQuery {
  Day = "H24",
  Week = "D7",
  Month = "D30",
}

export interface UserFavouritePayload {
  page?: number;
  s?: ComicSort;
}

export interface ComicEpisode {
  _id: string;
  title: string;
  order: number;
  updated_at: string;
  id: string;
}

export interface Creator {
  _id: string;
  gender: string;
  name: string;
  slogan?: string;
  title?: string;
  verified?: boolean;
  exp: number;
  level: number;
  characters: string[];
  character?: string;
  role?: string;
  avatar?: ImageMedia;
}

export interface ComicDetail extends Comic {
  _id: string;
  _creator: Creator;
  title: string;
  description: string;
  author: string;
  chineseTeam: string;
  categories: string[];
  tags: any[];
  pagesCount: number;
  epsCount: number;
  finished: boolean;
  updated_at: string;
  created_at: string;
  allowDownload: boolean;
  allowComment: boolean;
  totalLikes: number;
  totalViews: number;
  totalComments: number;
  viewsCount: number;
  likesCount: number;
  commentsCount: number;
  isFavourite: boolean;
  isLiked: boolean;
}

export interface ComicEpisodePage {
  _id: string;
  media: ImageMedia;
  id: string;
}

export type SignInResponse = BaseResponse<{ token: string }>;

export type PunchInResponse = BaseResponse<{
  res: { status: "ok" | "fail"; punchInLastDay?: string };
}>;

export type CategoriesResponse = BaseResponse<{ categories: Category[] }>;

export type UserProfileResponse = BaseResponse<{ user: User }>;

export type UserFavouriteResponse = BaseResponse<{
  comics: {
    docs: Comic[];
    total: number;
    limit: number;
    page: number;
    pages: number;
  };
}>;

export type ComicEpisodesResponse = BaseResponse<{
  eps: {
    docs: ComicEpisode[];
    total: number;
    limit: number;
    page: number;
    pages: number;
  };
}>;

export type ComicDetailResponse = BaseResponse<{ comic: ComicDetail }>;

export type ComicEpisodePagesResponse = BaseResponse<{
  pages: {
    docs: ComicEpisodePage[];
    total: number;
    limit: number;
    page: number;
    pages: number;
  };
  ep: Pick<ComicEpisode, "_id" | "title">;
}>;

export type ComicRecommendResponse = BaseResponse<{
  comics: Comic[];
}>;

export type ComicsResponse = BaseResponse<{
  comics: {
    docs: Comic[];
    total: number;
    limit: number;
    page: number;
    pages: number;
  };
}>;

export interface ComicsPayload {
  /** Category title */
  c?: string;
  page?: number;
  s?: ComicSort;
  ca?: string;
  a?: string;
  ct?: string;
  t?: string;
}

export interface RankingPayload {
  tt: LeaderQuery;
  ct: "VC"; // 暂不明确，固定
}

export type RankingResponse = BaseResponse<{
  comics: Comic[];
}>;

export interface CommentPayload {
  comicId: string;
  page: number;
}

export interface SimpleUser {
  _id: string;
  gender: "m" | "f" | "bot";
  name: string;
  title: string;
  verified: false;
  exp: 550;
  level: 2;
  characters: string[];
  role: string;
  avatar: {
    originalName: string;
    path: string;
    fileServer: string;
  };
  slogan: string;
}

export interface Comment {
  _id: string;
  content: string;
  _user: SimpleUser;
  _comic: string;
  totalComments: 0;
  isTop: boolean;
  hide: boolean;
  created_at: string;
  id: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
}

export type CommentResponse = BaseResponse<{
  comments: {
    docs: Comment[];
    total: number;
    limit: number;
    page: number;
    pages: number;
  };
  topComments: Comment[];
}>;

export interface CommentChildrenPayload {
  page: number;
  commentId: string;
}

export type CommentChildrenResponse = BaseResponse<{
  comments: {
    docs: Comment[];
    total: number;
    limit: number;
    page: number;
    pages: number;
  };
}>;

export type LikeOrUnLikeComicResponse = BaseResponse<{
  action: "like" | "unlike";
}>;

export type CollectResponse = BaseResponse<{
  action: "un_favourite" | "favourite";
}>;

export type KeywordsResponse = BaseResponse<{
  keywords: string[];
}>;

export interface SearchComicsPayload {
  keyword: string;
  categories?: string[];
  page?: number;
  sort?: ComicSort;
}

export type SearchComicsResponse = BaseResponse<{
  comics: {
    docs: SearchedComic[];
    total: number;
    limit: number;
    page: number;
    pages: number;
  };
}>;

export interface SearchedComic {
  _id: string;
  title: string;
  author?: string;
  totalViews?: number;
  totalLikes?: number;
  likesCount: number;
  finished: boolean;
  categories: string[];
  thumb: ImageMedia;
  chineseTeam?: string;
  description?: string;
  tags: string[];
  updated_at: string;
  created_at: string;
}

export type KnightResponse = BaseResponse<{
  users: Knight[];
}>;

export interface Knight {
  _id: string;
  gender: string;
  name: string;
  slogan?: string;
  title: string;
  verified: boolean;
  exp: number;
  level: number;
  characters: string[];
  role: string;
  avatar?: ImageMedia;
  comicsUploaded: number;
  character?: string;
}

export interface SendCommentPayload {
  comicId: string;
  content: string;
}

export type SendCommentResponse = BaseResponse<{}>;

export interface SendReplyPayload {
  commentId: string;
  content: string;
}

export type SendReplyResponse = BaseResponse<{}>;

export type GamesResponse = BaseResponse<{
  games: Games;
}>;
export interface Games {
  docs: Doc[];
  total: number;
  limit: number;
  page: number;
  pages: number;
}

export interface Doc {
  _id: string;
  title: string;
  version: string;
  publisher: string;
  suggest: boolean;
  adult: boolean;
  android: boolean;
  ios: boolean;
  icon: Icon;
}

export interface Icon {
  originalName: string;
  path: string;
  fileServer: string;
}
export interface Game {
  _id: string;
  title: string;
  description: string;
  version: string;
  icon: Icon;
  publisher: string;
  ios: boolean;
  iosLinks: any[];
  android: boolean;
  androidLinks: string[];
  adult: boolean;
  suggest: boolean;
  downloadsCount: number;
  screenshots: Icon[];
  androidSize: number;
  iosSize: number;
  videoLink: string;
  updated_at: string;
  created_at: string;
  likesCount: number;
  isLiked: boolean;
  commentsCount: number;
}

export type GameDetailsResponse = BaseResponse<{
  game: Game;
}>;

export type CommentLikeResponse = BaseResponse<{
  action: "like" | "unlike";
}>;

export type GameCommentsResponse = BaseResponse<{
  comments: Comments;
  topComments: any[];
}>;

export interface Comments {
  docs: Comment[];
  total: number;
  limit: number;
  page: string;
  pages: number;
}

export interface _comic {
  _id: string;
  title: string;
}

export interface MyCommentDoc {
  _id: string;
  content: string;
  _comic?: _comic;
  _game?: _comic;
  totalComments: number;
  hide: boolean;
  created_at: string;
  id: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
}

export interface MyComment {
  docs: MyCommentDoc[];
  total: number;
  limit: number;
  page: string;
  pages: number;
}


export type MyCommentsResponse = BaseResponse<{
  comments: MyComment;
}>;
