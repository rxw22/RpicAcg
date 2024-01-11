import {
  CategoriesResponse,
  CollectResponse,
  ComicDetailResponse,
  ComicEpisode,
  ComicEpisodePage,
  ComicEpisodePagesResponse,
  ComicEpisodesResponse,
  ComicRecommendResponse,
  ComicsPayload,
  ComicsResponse,
  CommentChildrenPayload,
  CommentChildrenResponse,
  CommentPayload,
  CommentResponse,
  KeywordsResponse,
  LikeOrUnLikeComicResponse,
  PunchInResponse,
  RankingPayload,
  RankingResponse,
  SearchComicsPayload,
  SearchComicsResponse,
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

  // 获取分类
  async fetchCategories() {
    const result = await this.httpClient.get<CategoriesResponse>(`categories`);
    if (result.code !== 200) {
      throw new Error(result.message);
    }
    const { categories } = result.data;
    return categories;
  }

  // 获取分区漫画
  async fetchComics(payload: ComicsPayload) {
    const result = await this.httpClient.get<ComicsResponse>("comics", payload);
    if (result.code !== 200) {
      throw new Error(result.message);
    }
    const { comics } = result.data;
    return comics;
  }

  // 获取漫画排行
  async fetchComicsRanking(payload: RankingPayload) {
    const result = await this.httpClient.get<RankingResponse>(
      "comics/leaderboard",
      payload
    );
    if (result.code !== 200) {
      throw new Error(result.message);
    }
    const { comics } = result.data;
    return comics;
  }

  // 获取漫画评论
  async fetchComicComment(payload: CommentPayload) {
    const { page, comicId } = payload;
    const result = await this.httpClient.get<CommentResponse>(
      `comics/${comicId}/comments`,
      { page }
    );
    if (result.code !== 200) {
      throw new Error(result.message);
    }
    return result.data;
  }

  // 获取漫画评论的子评论
  async fetchCommentChildren(payload: CommentChildrenPayload) {
    const { page, commentId } = payload;
    const result = await this.httpClient.get<CommentChildrenResponse>(
      `comments/${commentId}/childrens`,
      { page }
    );
    if (result.code !== 200) {
      throw new Error(result.message);
    }
    return result.data;
  }

  // 点赞或取消点赞本子
  async likeOrUnlikeComic(comicId: string) {
    const result = await this.httpClient.post<LikeOrUnLikeComicResponse>(
      `comics/${comicId}/like`
    );
    if (result.code !== 200) {
      throw new Error(result.message);
    }
    const { action } = result.data;
    return action;
  }

  // 收藏或取消收藏本子
  async collectOrUncollectComic(comicId: string) {
    const result = await this.httpClient.post<CollectResponse>(
      `comics/${comicId}/favourite`
    );
    if (result.code !== 200) {
      throw new Error(result.message);
    }
    const { action } = result.data;
    return action;
  }

  // 大家都在搜
  async fetchKeywords() {
    const result = await this.httpClient.get<KeywordsResponse>(`keywords`);
    if (result.code !== 200) {
      throw new Error(result.message);
    }
    const { keywords } = result.data;
    return keywords;
  }

  // 漫画搜索
  async searchComics(payload: SearchComicsPayload) {
    const { page, keyword, sort } = payload;
    const result = await this.httpClient.post<SearchComicsResponse>(
      `comics/advanced-search?page=${page}`,
      { keyword, sort }
    );
    if (result.code !== 200) {
      throw new Error(result.message);
    }
    const { comics } = result.data;
    return comics;
  }
}

export default HttpRequest;
