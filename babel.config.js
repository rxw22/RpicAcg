module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    // react-native-paper 按需导入插件
    env: {
      production: {
        plugins: ["react-native-paper/babel"],
      },
    },
    // 路径别名插件
    plugins: [
      [
        "module-resolver",
        {
          alias: {
            "@": "./src",
          },
        },
      ],
      "react-native-reanimated/plugin",
    ],
  };
};
