import { useUserStore } from "@/store/userStore";
import { getHeaders, fixedSearchParams } from "./utils";
import {
  BaseResponse,
  CategoriesResponse,
  PunchInResponse,
  SignInPayload,
  SignInResponse,
} from "./types";
class Http {
  private api = "https://picaapi.picacomic.com/";
  private authorization: string;
  constructor(authorization: string = "") {
    this.authorization = authorization;
  }

  setAuthorization(token: string) {
    this.authorization = token;
  }

  post<T extends BaseResponse<unknown>, R = unknown>(
    url: string,
    payload?: R
  ): Promise<T> {
    const headers = getHeaders(url, "POST", {
      authorization: this.authorization,
    });
    return fetch(this.api + url, {
      method: "POST",
      body: payload ? JSON.stringify(payload) : JSON.stringify({}),
      headers,
    })
      .then((res) => res.text())
      .then((res) => {
        const result = JSON.parse(res);
        if (result.code !== 200) {
          throw new Error(result.message);
        }
        return result;
      })
      .catch((err) => {
        console.log(err);
        throw new Error(err.message);
      });
  }

  get<T extends BaseResponse<unknown>, R = unknown>(
    url: string,
    params?: R
  ): Promise<T> {
    const headers = getHeaders(url, "GET", {
      authorization: this.authorization,
    });
    const paramsString = params ? fixedSearchParams(params) : "";
    return fetch(this.api + url + paramsString, {
      method: "GET",
      headers,
    })
      .then((res) => res.text())
      .then((res) => {
        const result = JSON.parse(res);
        if (result.code !== 200) {
          throw new Error(result.message);
        }
        return result;
      })
      .catch((err) => {
        console.log(err);
        throw new Error(err.message);
      });
  }
}

const usePicaHttp = () => {
  const { token, email, password, saveUserInfo } = useUserStore();
  return {
    async signIn(payload: SignInPayload) {
      const http = new Http();
      const result = await http.post<SignInResponse>("auth/sign-in", payload);
      saveUserInfo({ ...payload, token: result.data.token });
      return result;
    },
    async punchIn() {
      const http = new Http(token);
      const result = await http.post<PunchInResponse>("users/punch-in");
      return result;
    },
    async fetchCategories() {
      const http = new Http(token);
      const result = await http.get<CategoriesResponse>("categories");
      return result;
    },
  };
};

export default usePicaHttp;
