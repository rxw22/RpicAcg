import { getHeaders } from "./utils";

const api = "https://picaapi.picacomic.com";
export const signIn = (params: { email: string; password: string }) => {
  const url = "/auth/sign-in";
  const method = "POST";
  return fetch(api + url, {
    method,
    body: JSON.stringify(params),
    headers: getHeaders(url, method),
  }).then((res) => res.json());
};
