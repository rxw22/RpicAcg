import React, { useMemo } from "react";
import { Appbar } from "react-native-paper";

interface Props {
  flag: boolean;
}

function UserAppBar(props: Props) {
  const transparentAppBar = useMemo(
    () => (
      <Appbar.Header style={{ backgroundColor: "rgba(0, 0, 0, 0)" }}>
        <Appbar.Content title="我的" color="#fff" />
        <Appbar.Action icon="lead-pencil" onPress={() => {}} color="#fff" />
      </Appbar.Header>
    ),
    []
  );
  const commonAppBar = useMemo(
    () => (
      <Appbar.Header>
        <Appbar.Content title="我的" />
        <Appbar.Action icon="lead-pencil" onPress={() => {}} />
      </Appbar.Header>
    ),
    []
  );
  return props.flag ? transparentAppBar : commonAppBar;
}

export default React.memo(UserAppBar);
