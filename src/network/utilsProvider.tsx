import { useUserStore } from "@/store/userStore";
import HttpRequest from "./httpRequest";
import React, { useContext, useMemo } from "react";
import { navigate } from "@/navigations/RootNavigation";
import { useAppConfigStore } from "@/store/appConfigStore";
import { Comic } from "./types";
import FileCache from "@/utils/FileCache";

type ContextType = {
  httpRequest: HttpRequest;
  historyFileCache?: FileCache<Comic>;
  localCollectCache?: FileCache<Comic>;
};

const Context = React.createContext<ContextType>({
  httpRequest: new HttpRequest({}),
});

type Props = React.ComponentProps<typeof Context.Provider>;

const NetworkProvider: React.FC<Omit<Props, "value">> = ({ ...props }) => {
  const { token } = useUserStore();
  const { appChannel, imageQuality } = useAppConfigStore();

  const httpRequest = useMemo(
    () =>
      new HttpRequest({
        headers: {
          authorization: token,
          "app-channel": appChannel,
          "image-quality": imageQuality,
        },
        async refreshToken() {
          navigate("login", undefined);
        },
      }),
    [token, appChannel, imageQuality]
  );

  // 提前初始化
  const historyFileCache = useMemo(
    () => new FileCache<Comic>(FileCache.historyFilePath),
    []
  );

  const localCollectCache = useMemo(
    () => new FileCache<Comic>(FileCache.collectFilePath),
    []
  );

  return (
    <Context.Provider
      {...props}
      value={{ httpRequest, historyFileCache, localCollectCache }}
    />
  );
};

export default NetworkProvider;

export const useUtilsProvider = () => {
  const { httpRequest, historyFileCache, localCollectCache } =
    useContext(Context);
  return {
    httpRequest,
    historyFileCache,
    localCollectCache,
  };
};
