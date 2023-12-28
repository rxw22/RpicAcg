import { StyleSheet, View } from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { useRequest } from "ahooks";
import { ActivityIndicator } from "react-native-paper";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigations/mainStacks/types";
import { useNetworkProvider } from "@/network/networkProvider";
// import HorizontalView from "./horizontalView";
import VerticalView from "./verticalView";

type Props = NativeStackScreenProps<RootStackParamList, "reader">;

const Reader: React.FC<Props> = ({ route, navigation }) => {
  const { page, comicId, order } = route.params;
  const { httpRequest } = useNetworkProvider();

  const { data, loading, refresh } = useRequest(
    httpRequest.fetchComicEpisodePages.bind(httpRequest),
    {
      defaultParams: [comicId, order, page],
      onError(e) {
        console.log(e);
      },
    }
  );

  const { pages, ep } = data?.data || {};

  return !loading ? (
    <View style={styles.container}>
      <StatusBar style="light" animated />
      <View style={{ height: "100%", width: "100%" }}>
        {/* <HorizontalView dataSource={pages?.docs || []}/> */}
        <VerticalView dataSource={pages?.docs || []}/>
      </View>
    </View>
  ) : (
    <View style={styles.loadingContainer}>
      <ActivityIndicator animating={true} size="large" />
    </View>
  );
};

export default React.memo(Reader);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000",
    flex: 1,
  },
  loadingContainer: {
    backgroundColor: "#000",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
