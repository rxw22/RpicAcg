import { StyleSheet, Text } from "react-native";
import React from "react";
import BgBox from "@/components/bgBox";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigations/mainStacks/types";
import { useUtilsProvider } from "@/network/utilsProvider";
import { useRequest } from "ahooks";
import { Button } from "react-native-paper";

type Props = NativeStackScreenProps<RootStackParamList, "game-details">;

const details: React.FC<Props> = ({ route }) => {
  const { gameId } = route.params;
  const { httpRequest, Toast } = useUtilsProvider();

  const { loading, data, refresh, error } = useRequest(
    httpRequest.fetchGameDetails.bind(httpRequest),
    {
      defaultParams: [gameId],
      onError(e) {
        console.log(e);
      },
    }
  );

  return (
    <BgBox
      style={styles.container}
      error={error?.message}
      refresh={refresh}
      loading={loading}
    >
      <Text>details</Text>
      <Button
        onPress={() => {
          Toast.show("试一试", "success");
        }}
      >
        点击
      </Button>
    </BgBox>
  );
};

export default React.memo(details);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
});
