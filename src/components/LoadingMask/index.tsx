import { StyleSheet } from "react-native";
import React, { useRef } from "react";
import BgBox from "../bgBox";

export type Props = {
  loading: boolean;
  once?: boolean;
};

const LoadingMask: React.FC<Props> = ({ loading, once = false }) => {
  const counter = useRef(once ? 1 : Infinity);

  return loading && counter.current-- > 0 ? (
    <BgBox style={styles.container} loading={true} />
  ) : null;
};

export default React.memo(LoadingMask);

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9,
  },
});
