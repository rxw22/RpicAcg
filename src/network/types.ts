export interface BaseResponse<T = unknown> {
  code: number
  message: string
  data: T
}

export type SignInPayload = {
  email: string;
  password: string;
};

export interface ImageMedia {
  originalName: string
  path: string
  fileServer: string
}

export interface Category {
  _id?: string
  title: string
  thumb: ImageMedia
  isWeb?: boolean
  active?: boolean
  link?: string
  description?: string
}

export interface User {
  _id: string
  birthday: string
  email: string
  gender: 'm' | 'f' | 'bot'
  name: string
  slogan?: string
  title: string
  verified: boolean
  exp: number
  level: number
  characters: string[]
  character?: string
  role?: string
  created_at: string
  avatar?: ImageMedia
  isPunched: boolean
}

export interface Comic {
  _id: string
  title: string
  author?: string
  totalViews: number
  totalLikes: number
  pagesCount: number
  epsCount: number
  finished: boolean
  categories: string[]
  thumb: ImageMedia
  likesCount: number
  id?: string
}

export enum ComicSort {
  Default = 'ua', // 默认
  NewToOld = 'dd', // 新到旧
  OldToNew = 'da', // 旧到新
  Like = 'ld', // 爱心最多
  View = 'vd' // 绅士指数最多
}

export interface UserFavouritePayload {
  page?: number
  s?: ComicSort
}

export interface ComicEpisode {
  _id: string
  title: string
  order: number
  updated_at: string
  id: string
}

export interface Creator {
  _id: string
  gender: string
  name: string
  slogan?: string
  title?: string
  verified?: boolean
  exp: number
  level: number
  characters: string[]
  character?: string
  role?: string
  avatar?: ImageMedia
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
  _id: string
  media: ImageMedia
  id: string
}

export type SignInResponse = BaseResponse<{ token: string }>

export type PunchInResponse = BaseResponse<{ res: { status: 'ok' | 'fail', punchInLastDay?: string } }>

export type CategoriesResponse = BaseResponse<{ categories: Category[] }>

export type UserProfileResponse = BaseResponse<{ user: User }>

export type UserFavouriteResponse = BaseResponse<{
  comics: {
    docs: Comic[]
    total: number
    limit: number
    page: number
    pages: number
  }
}>

export type ComicEpisodesResponse = BaseResponse<{
  eps: {
    docs: ComicEpisode[]
    total: number
    limit: number
    page: number
    pages: number
  }
}>

export type ComicDetailResponse = BaseResponse<{ comic: ComicDetail }>

export type ComicEpisodePagesResponse = BaseResponse<{
  pages: {
    docs: ComicEpisodePage[]
    total: number
    limit: number
    page: number
    pages: number
  },
  ep: Pick<ComicEpisode, '_id' | 'title'>
}>

export type ComicRecommendResponse = BaseResponse<{
  comics: Comic[]
}>