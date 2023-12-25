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