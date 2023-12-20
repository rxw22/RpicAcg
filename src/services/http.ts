import { getSign, picacg } from "./utils";

class Http {
  private headers = {
    accept: "application/vnd.picacomic.com.v1+json",
    "User-Agent": "okhttp/3.8.1",
    "Content-Type": "application/json; charset=UTF-8",
    "api-key": "C69BAF41DA5ABD1FFEDC6D2FEA56B",
    "app-build-version": "45",
    "app-channel": "3",
    "app-platform": "android",
    "app-uuid": "defaultUuid",
    "app-version": "2.2.1.3.3.4",
    "image-quality": "original",
    nonce: "4ce7a7aa759b40f794d189a88b84aba8",
    signature: "",
    time: "",
    authorization: "",
  };

  private handleHeaders(url: string, method: "GET" | "POST") {
    this.headers.time = (new Date().getTime() / 1000).toFixed(0);
    this.headers.signature = getSign(
      url,
      this.headers.time,
      this.headers.nonce,
      method
    );
  }

  post(url: string, params?: any) {
    const request_url = picacg.Url + url;
    this.handleHeaders(url, "POST");
    return fetch(request_url, {
      method: "POST",
      headers: this.headers,
      body: params ? JSON.stringify(params) : JSON.stringify({}),
    })
      .then((res) => res.text())
      .then((res) => {
        const result = JSON.parse(res);
        if (result.code !== 200) {
          throw new Error("请求失败");
        } else {
          return result;
        }
      })
      .catch((err) => err);
  }

  setAuthorization(token: string) {
    this.headers.authorization = token;
  }

  async signIn(payload: any){
    const result = this.post("auth/sign-in", payload);
    return result;
  }
}

const http = new Http();

export default http;
