import {
  CategoriesResponse,
  PunchInResponse,
  SignInPayload,
  SignInResponse,
  UserProfileResponse,
} from "./types";
import HttpClient, { type HttpClientConfig } from "./httpClient";

class HttpRequest {
  private httpClient: HttpClient;
  constructor(config: HttpClientConfig) {
    this.httpClient = new HttpClient(config);
  }

  // 登录
  async signIn(payload: SignInPayload) {
    const result = await this.httpClient.post<SignInResponse, SignInPayload>("auth/sign-in", payload);
    if(result.code !== 200){
      throw new Error(result.message);
    }
    this.httpClient.setHeaders({ authorization: result.data.token });
    return result;
  }

  // 打卡
  async punchIn() {
    const result = await this.httpClient.post<PunchInResponse>("users/punch-in");
    if(result.code !== 200){
      throw new Error(result.message);
    }
    return result;
  }

  // 获取个人信息
  async fetchUserProfile() {
    const result = await this.httpClient.get<UserProfileResponse>("users/profile");
    if(result.code !== 200){
      throw new Error(result.message);
    }
    return result;
  }

}

export default HttpRequest;
