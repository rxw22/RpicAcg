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

export type SignInResponse = BaseResponse<{ token: string }>

export type PunchInResponse = BaseResponse<{ res: { status: 'ok' | 'fail', punchInLastDay?: string } }>

export type CategoriesResponse = BaseResponse<{ categories: Category[] }>