import { StyleSheet, View, Linking, ScrollView } from "react-native";
import React from "react";
import BgBox from "@/components/bgBox";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigations/mainStacks/types";
import { useUtilsProvider } from "@/network/utilsProvider";
import { useRequest } from "ahooks";
import {
  Card,
  Icon,
  Text,
  useTheme,
  Button,
  Divider,
  Portal,
  Dialog,
} from "react-native-paper";
import { Image } from "expo-image";
import HorizontalImages from "./HorizontalImages";

type Props = NativeStackScreenProps<RootStackParamList, "game-details">;

const details: React.FC<Props> = ({ route, navigation }) => {
  const { gameId } = route.params;
  const { httpRequest } = useUtilsProvider();
  const theme = useTheme();
  const [visible, setVisible] = React.useState(false);

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  const { loading, data, refresh, error } = useRequest(
    httpRequest.fetchGameDetails.bind(httpRequest),
    {
      defaultParams: [gameId],
      onError(e) {
        console.log(e);
      },
    }
  );
  const {
    icon,
    title = "",
    publisher,
    version,
    screenshots,
    description,
    likesCount,
    commentsCount,
    ios,
    android,
    androidLinks,
    iosLinks,
  } = data || {};
  const uri = icon?.fileServer + "/static/" + icon?.path;

  const openDownload = () => {
    const url = androidLinks?.[0] || iosLinks?.[0];
    Linking.openURL(url);
  };

  return (
    <BgBox
      style={styles.container}
      error={error?.message}
      refresh={refresh}
      loading={loading}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.iconBox}>
          <Card mode="contained" style={styles.card}>
            <Image style={styles.full} source={uri} contentFit="contain" />
          </Card>
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text variant="titleMedium" numberOfLines={1}>
              {title}
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.primary }}>
              {publisher}
            </Text>
            <Text variant="bodyMedium">{version}</Text>
          </View>
          <View style={{ marginLeft: 8 }}>
            {ios && (
              <Icon source="apple" size={32} color={theme.colors.primary} />
            )}
            <View style={{ height: 3 }} />
            {android && (
              <Icon source="android" size={32} color={theme.colors.primary} />
            )}
          </View>
        </View>
        <View
          style={{
            marginTop: 10,
            paddingHorizontal: 10,
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <Button
            mode="text"
            icon="cards-heart-outline"
            style={{ marginRight: 8 }}
            onPress={() => {}}
          >
            {likesCount}
          </Button>
          <Button
            mode="text"
            icon="comment-processing-outline"
            onPress={() => {
              navigation.navigate("game-comment", {
                gameId,
              });
            }}
          >
            {commentsCount}
          </Button>
        </View>
        <View style={{ marginTop: 8, paddingHorizontal: 10 }}>
          <Button
            mode="contained"
            onPress={() => {
              showDialog();
            }}
          >
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
        <Divider />
        <View style={{ padding: 8 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <Icon
              source="book-information-variant"
              size={22}
              color={theme.colors.primary}
            />
            <View style={{ width: 5 }} />
            <Text variant="titleMedium" style={{ color: theme.colors.primary }}>
              简介
            </Text>
          </View>
          <View>
            <Text variant="bodyMedium">{description}</Text>
          </View>
        </View>
      </ScrollView>
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>提示</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              将要跳转到哔咔指定的下载页面，是否继续？
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>取消</Button>
            <Button
              onPress={() => {
                hideDialog();
                openDownload();
              }}
            >
              确定
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
