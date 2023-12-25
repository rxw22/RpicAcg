import { useUserStore } from "@/store/userStore";
import HttpRequest from "./httpRequest";
import React, { useContext, useMemo } from "react";
import { StyleSheet } from 'react-native';

const Context = React.createContext<HttpRequest>(new HttpRequest({}));

type Props = React.ComponentProps<typeof Context.Provider>;

const NetworkProvider: React.FC<Omit<Props, "value">> = (props) => {
  const { token } = useUserStore();
  const httpRequest = useMemo(
    () => new HttpRequest({ headers: { authorization: token } }),
    [token]
  );
  return (
    <Context.Provider {...props} value={httpRequest}>
      {props.children}
    </Context.Provider>
  );
};

const styles = StyleSheet.create({
  surface: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    opacity: 0,
    pointerEvents: 'none'
  }
})

export default NetworkProvider;

export const useNetworkProvider = () => {
  const httpRequest = useContext(Context);
  return {
    httpRequest,
  };
};
