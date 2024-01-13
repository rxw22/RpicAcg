export const fliterEmpty = <T extends Object>(params: T) => {
  const helper: T = Object();
  for (let key in params) {
    if (params[key]) {
      helper[key] = params[key];
    }
  }
  return helper;
};
