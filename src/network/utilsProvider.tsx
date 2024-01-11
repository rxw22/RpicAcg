import { useUserStore } from "@/store/userStore";
import HttpRequest from "./httpRequest";
import React, { useContext, useMemo } from "react";
import { navigate } from "@/navigations/RootNavigation";
import { ToastRef } from "@/components/Toast";

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

// 问题很大，需要重新构思一下
const NetworkProvider: React.FC<Omit<Props, "value">> = ({
  Toast,
  ...props
}) => {
  const { token } = useUserStore();
  const httpRequest = useMemo(
    () =>
      new HttpRequest({
        headers: { authorization: token },
        async refreshToken() {
          navigate("login", undefined);
        },
      }),
    [token]
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
