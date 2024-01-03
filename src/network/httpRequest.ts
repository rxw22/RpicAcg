import {
  CategoriesResponse,
  ComicDetailResponse,
  ComicEpisode,
  ComicEpisodePage,
  ComicEpisodePagesResponse,
  ComicEpisodesResponse,
  ComicRecommendResponse,
  PunchInResponse,
  SignInPayload,
  SignInResponse,
  UserFavouritePayload,
  UserFavouriteResponse,
  UserProfileResponse,
} from "./types";
import HttpClient, { type HttpClientConfig } from "./httpClient";

type HttpRequestConfig = HttpClientConfig;

class HttpRequest {
  private httpClient: HttpClient;
  constructor(config: HttpRequestConfig) {
    this.httpClient = new HttpClient(config);
  }

  // 登录
  async signIn(payload: SignInPayload) {
    const result = await this.httpClient.post<SignInResponse, SignInPayload>(
      "auth/sign-in",
      payload
    );
    if (result.code !== 200) {
      throw new Error(result.message);
    }
    this.httpClient.setHeaders({ authorization: result.data.token });
    return result;
  }

  // 打卡
  async punchIn() {
    const result = await this.httpClient.post<PunchInResponse>(
      "users/punch-in"
    );
    if (result.code !== 200) {
      throw new Error(result.message);
    }
    return result;
  }

  // 获取个人信息
  async fetchUserProfile() {
    const result = await this.httpClient.get<UserProfileResponse>(
      "users/profile"
    );
    if (result.code !== 200) {
      throw new Error(result.message);
    }
    return result;
  }

  // 获取个人收藏
  async fetchUserFavourite(searchParams: UserFavouritePayload) {
    const result = await this.httpClient.get<UserFavouriteResponse>(
      "users/favourite",
      searchParams
    );
    if (result.code !== 200) {
      throw new Error(result.message);
    }
    return result;
  }

  // 获取本子详情
  async fetchComicDetail(comicId: string) {
    const result = await this.httpClient.get<ComicDetailResponse>(
      `comics/${comicId}`
    );
    if (result.code !== 200) {
      throw new Error(result.message);
    }
    return result;
  }

  // 获取本子章节
  async fetchComicEpisodes(comicId: string) {
    let page = 0;
    let pages = 1;
    let results: ComicEpisode[] = [];
    while (page < pages) {
      page++;
      const result = await this.httpClient.get<ComicEpisodesResponse>(
        `comics/${comicId}/eps`,
        { page }
      );
      if (result.code !== 200) {
        throw new Error(result.message);
      }
      const { pages: realPages, docs } = result.data.eps;
      pages = realPages;
      results.push(...docs);
    }
    return results;
  }

  // 相关推荐
  async fetchComicRecommend(comicId: string) {
    const result = await this.httpClient.get<ComicRecommendResponse>(
      `comics/${comicId}/recommendation`
    );
    if (result.code !== 200) {
      throw new Error(result.message);
    }
    return result;
  }

  // 获取章节图片
  async fetchComicEpisodePages(comicId: string, order: number) {
    let currentPage = 0;
    let totalPage = 1;
    let results: ComicEpisodePage[] = [];
    while (currentPage < totalPage) {
      currentPage++;
      const result = await this.httpClient.get<ComicEpisodePagesResponse>(
        `comics/${comicId}/order/${order}/pages`,
        { page: currentPage }
      );
      if (result.code !== 200) {
        throw new Error(result.message);
      }
      const { docs, pages, total, page, limit } = result.data.pages;
      totalPage = pages;
      results.push(...docs);
    }
    return results;
  }
}

export default HttpRequest;
