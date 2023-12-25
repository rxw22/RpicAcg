import { getHeaders, fixedSearchParams } from "./utils";

export type HttpClientConfig = {
  baseUrl?: string;
  headers?: HeadersInit;
};

type HttpRequestParams<T> = {
  searchParams?: Record<string, string>;
  payload?: T;
};

class HttpClient {
  private baseUrl: string = "https://picaapi.picacomic.com/";
  private headers: HeadersInit = {};

  constructor(config: HttpClientConfig) {
    this.baseUrl = config.baseUrl ? config.baseUrl : this.baseUrl;
    this.headers = config.headers ? config.headers : this.headers;
  }

  public setHeaders(headers: HeadersInit) {
    this.headers = headers;
  }

  private async request<T>(
    url: string,
    method: "POST" | "GET",
    params: HttpRequestParams<T>
  ): Promise<Response> {
    const { payload, searchParams } = params;
    const urlParams = fixedSearchParams(searchParams);
    const headers = { ...getHeaders(url, method), ...this.headers };
    const options =
      method === "POST"
        ? {
            method,
            headers,
            body: payload ? JSON.stringify(payload) : JSON.stringify({}),
          }
        : { method, headers };
    const response = await fetch(this.baseUrl + url + urlParams, options);
    return response;
  }

  async post<T, U = unknown>(url: string, payload?: U): Promise<T> {
    const response = await this.request<U>(url, "POST", { payload });
    return response.json() as Promise<T>;
  }

  async get<T>(url: string, searchParams: Record<string, any> = {}): Promise<T> {
    const response = await this.request(url, "GET", { searchParams });
    return response.json() as Promise<T>;
  }
}

export default HttpClient;
