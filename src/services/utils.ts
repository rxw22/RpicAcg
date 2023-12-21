import { HmacSHA256 } from "crypto-js";

const picacg = {
  api: "https://picaapi.picacomic.com/",
  imageApi: "https://s3.picacomic.com/static/",
  apiKey: "C69BAF41DA5ABD1FFEDC6D2FEA56B",
  secretKey: "~d}$Q7$eIni=V)9\\RK/P.RM4;9[7|@/CA}b~OW!3?EV`:<>M7pddUBL5n|0/*Cn",
};

const defaultHeaders = {
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

function getSign(
  url: string,
  timestamp: string,
  nonce: string,
  method: "GET" | "POST"
): string {
  const key = url + timestamp + nonce + method + picacg.apiKey;
  return HmacSHA256(key.toLowerCase(), picacg.secretKey).toString();
}

const randomString = (e: number = 32) => {
  let t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
  let a = t.length;
  let n = "";
  for (let i = 0; i < e; i++) {
    n += t.charAt(Math.floor(Math.random() * a));
  }
  return n;
};

export const getHeaders = (
  url: string,
  method: "GET" | "POST",
  options: any = {}
) => {
  const headers = { ...defaultHeaders, ...options };
  headers.time = (new Date().getTime() / 1000).toFixed(0);
  headers.signature = getSign(url, headers.time, headers.nonce, method);
  return headers;
};

export function fixedSearchParams (searchParams?: any): string {
  if (typeof searchParams === 'string') {
    return searchParams[0] === '?' ? searchParams : '?' + searchParams
  } else if (searchParams instanceof URLSearchParams) {
    return `?${searchParams.toString()}`
  } else if (typeof searchParams === 'object') {
    const params = Object.entries(searchParams).map(([key, value]) => `${key}=${value}`)
    return `?${params.join('&')}`
  } else {
    return ''
  }
}
