import { StyleSheet, View } from "react-native";
import React from "react";
import BgBox from "@/components/bgBox";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigations/mainStacks/types";
import { useUtilsProvider } from "@/network/utilsProvider";
import { useRequest } from "ahooks";
import { Card, Icon, Text, useTheme, Button } from "react-native-paper";
import { Image } from "expo-image";
import HorizontalImages from "./HorizontalImages";

type Props = NativeStackScreenProps<RootStackParamList, "game-details">;

const details: React.FC<Props> = ({ route }) => {
  const { gameId } = route.params;
  const { httpRequest } = useUtilsProvider();
  const theme = useTheme();

  const { loading, data, refresh, error } = useRequest(
    httpRequest.fetchGameDetails.bind(httpRequest),
    {
      defaultParams: [gameId],
      onError(e) {
        console.log(e);
      },
    }
  );
  const { icon, title = "", publisher, version, screenshots } = data || {};
  const uri = icon?.fileServer + "/static/" + icon?.path;

  return (
    <BgBox
      style={styles.container}
      error={error?.message}
      refresh={refresh}
      loading={loading}
    >
      <View style={styles.iconBox}>
        <Card mode="contained" style={styles.card}>
          <Image style={styles.full} source={uri} contentFit="contain" />
        </Card>
        <View style={{ marginLeft: 12, flex: 1 }}>
          <Text variant="titleMedium" numberOfLines={2}>
            {title}
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.primary }}>
            {publisher}
          </Text>
          <Text variant="bodyMedium">{version}</Text>
        </View>
        <View style={{ marginLeft: 8 }}>
          <Icon source="apple" size={32} color={theme.colors.primary} />
          <View style={{ height: 3 }} />
          <Icon source="android" size={32} color={theme.colors.primary} />
        </View>
      </View>
      <View style={{ marginTop: 15, paddingHorizontal: 10 }}>
        <Button mode="contained" onPress={() => {}}>
          下载
        </Button>
      </View>
      <View
        style={{
          height: 240,
          width: "100%",
          marginVertical: 15,
          paddingHorizontal: 8,
        }}
      >
        <HorizontalImages dataSource={screenshots || []} />
      </View>
    </BgBox>
  );
};

export default React.memo(details);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  iconBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  card: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: "hidden",
  },
  full: {
    width: "100%",
    height: "100%",
  },
});
