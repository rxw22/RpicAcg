import { useUserStore } from "@/store/userStore";
import HttpRequest from "./httpRequest";
import React, { useContext, useMemo } from "react";
import { navigate } from "@/navigations/RootNavigation";
import { ToastRef } from "@/components/Toast";
import { useAppConfigStore } from "@/store/appConfigStore";

type ContextType = {
  httpRequest: HttpRequest;
  Toast: ToastRef;
};

const Context = React.createContext<ContextType>({
  httpRequest: new HttpRequest({}),
  Toast: { show: () => {}, hide: () => {} },
});

type Props = React.ComponentProps<typeof Context.Provider> & {
  Toast: ToastRef;
};

const NetworkProvider: React.FC<Omit<Props, "value">> = ({
  Toast,
  ...props
}) => {
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

  return <Context.Provider {...props} value={{ httpRequest, Toast }} />;
};

export default NetworkProvider;

export const useUtilsProvider = () => {
  const { httpRequest, Toast } = useContext(Context);
  return {
    httpRequest,
    Toast,
  };
};
