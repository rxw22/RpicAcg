import { StyleSheet, View } from "react-native";
import React, { memo, useCallback } from "react";
import BgBox from "@/components/bgBox";
import LoadingMask from "@/components/LoadingMask";
import List from "@/components/ComicsList";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigations/mainStacks/types";
import { useUtilsProvider } from "@/network/utilsProvider";
import { useRequest } from "ahooks";
import { FAB } from "react-native-paper";

type Props = NativeStackScreenProps<RootStackParamList, "random">;

const Random: React.FC<Props> = ({ navigation }) => {
  const { httpRequest } = useUtilsProvider();

  const { error, refresh, loading, data } = useRequest(
    httpRequest.fetchRandomComics.bind(httpRequest),
    {
      onError(e) {
        console.log(e);
      },
    }
  );

  const loadMore = useCallback(() => {}, []);

  const navigate = useCallback((name: string, params: any) => {
    // @ts-ignore
    navigation.push(name, params);
  }, []);

  return (
    <BgBox style={styles.container} error={error?.message} refresh={refresh}>
      <View
        style={[styles.full, { paddingHorizontal: 5, position: "relative" }]}
      >
        <LoadingMask loading={loading} />
        <List
          dataSource={data || []}
          loading={loading}
          loadMore={loadMore}
          navigate={navigate}
        />
      </View>
      <FAB
        icon="restore"
        style={styles.fab}
        onPress={() => {
          refresh();
        }}
        size="medium"
      />
    </BgBox>
  );
};

export default memo(Random);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  full: {
    height: "100%",
    width: "100%",
  },
  fab: {
    position: "absolute",
    bottom: 15,
    right: 15,
  },
});
