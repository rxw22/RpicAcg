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

export type SignInResponse = BaseResponse<{ token: string }>

export type PunchInResponse = BaseResponse<{ res: { status: 'ok' | 'fail', punchInLastDay?: string } }>

export type CategoriesResponse = BaseResponse<{ categories: Category[] }>

export type UserProfileResponse = BaseResponse<{ user: User }>