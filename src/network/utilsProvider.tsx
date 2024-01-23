import { useUserStore } from "@/store/userStore";
import HttpRequest from "./httpRequest";
import React, { useContext, useMemo } from "react";
import { navigate } from "@/navigations/RootNavigation";
import { useAppConfigStore } from "@/store/appConfigStore";

type ContextType = {
  httpRequest: HttpRequest;
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

  return <Context.Provider {...props} value={{ httpRequest }} />;
};

export default NetworkProvider;

export const useUtilsProvider = () => {
  const { httpRequest } = useContext(Context);
  return {
    httpRequest,
  };
};
