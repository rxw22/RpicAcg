export const fliterEmpty = <T extends Object>(params: T) => {
  const helper: T = Object();
  for (let key in params) {
    if (params[key]) {
      helper[key] = params[key];
    }
  }
  return helper;
};

export const average = (arr: number[]) => {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum / arr.length;
};
