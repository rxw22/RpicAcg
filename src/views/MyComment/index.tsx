import { StyleSheet, View } from "react-native";
import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigations/mainStacks/types";
import BgBox from "@/components/bgBox";
import {
  Card,
  Divider,
  Icon,
  Text,
  TouchableRipple,
  useTheme,
} from "react-native-paper";
import { useUtilsProvider } from "@/network/utilsProvider";
import { useRequest } from "ahooks";
import { FlashList } from "@shopify/flash-list";
import dayjs from "dayjs";
import { useGlobalStore } from "@/store/globalStore";
import { Image } from "expo-image";

type Props = NativeStackScreenProps<RootStackParamList, "my-comments">;

const MyComment: React.FC<Props> = ({ navigation }) => {
  const { httpRequest } = useUtilsProvider();
  const { user } = useGlobalStore();
  const theme = useTheme();

  const { data, loading, error, refresh } = useRequest(
    httpRequest.fetchMyComments.bind(httpRequest),
    {
      onError(e) {
        console.log(e);
      },
    }
  );

  const avatarUri = user?.avatar
    ? `${user.avatar.fileServer}/static/${user.avatar.path}`
    : require("@/assets/imgs/user.png");

  return (
    <BgBox
      loading={loading}
      error={error?.message}
      refresh={refresh}
      style={styles.container}
    >
      <View style={styles.full}>
        <FlashList
          data={data?.docs}
          estimatedItemSize={160}
          ItemSeparatorComponent={() => <Divider />}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const {
              content,
              _id,
              _comic,
              _game,
              created_at,
              likesCount,
              commentsCount,
            } = item;
            return (
              <View style={styles.itemWarpper}>
                <View style={styles.avatar}>
                  <Card
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 25,
                      overflow: "hidden",
                    }}
                    mode="contained"
                  >
                    <Image source={avatarUri} style={styles.full} />
                  </Card>
                </View>
                <View style={styles.content}>
                  <View style={{ flex: 1 }}>
                    <Text variant="labelLarge">
                      {user?.name}{" "}
                      <Text variant="bodySmall">Lv.{user?.level}</Text>
                    </Text>
                    <View style={{ height: 8 }} />
                    <Text variant="bodyLarge">{content}</Text>
                  </View>
                  <View style={{ height: 20 }} />
                  <Text
                    variant="bodySmall"
                    style={{ color: theme.colors.primary }}
                  >
                    {_comic?.title || _game?.title}
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text variant="bodySmall">
                      {dayjs(created_at).format("YYYY-MM-DD HH:mm:ss")}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        flex: 1,
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginLeft: 20,
                      }}
                    >
                      <View
                        style={{
                          borderRadius: 5,
                          overflow: "hidden",
                          marginRight: 8,
                        }}
                      >
                        <TouchableRipple
                          onPress={() => {}}
                          rippleColor="rgba(0, 0, 0, .2)"
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              padding: 5,
                              alignItems: "center",
                            }}
                          >
                            <Icon source={"cards-heart-outline"} size={15} />
                            <View style={{ width: 5 }} />
                            <Text variant="bodySmall">{likesCount}</Text>
                          </View>
                        </TouchableRipple>
                      </View>
                      <View
                        style={{
                          borderRadius: 5,
                          overflow: "hidden",
                          marginRight: 12,
                        }}
                      >
                        <TouchableRipple
                          onPress={() => {
                            // navigation.navigate("comchildren", {
                            //   comment: item,
                            // });
                          }}
                          rippleColor="rgba(0, 0, 0, .2)"
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              padding: 5,
                              alignItems: "center",
                            }}
                          >
                            <Icon source="comment-outline" size={15} />
                            <View style={{ width: 5 }} />
                            <Text variant="bodySmall">{commentsCount}</Text>
                          </View>
                        </TouchableRipple>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            );
          }}
        />
      </View>
    </BgBox>
  );
};

export default React.memo(MyComment);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  full: {
    width: "100%",
    height: "100%",
    paddingHorizontal: 8,
  },
  itemWarpper: {
    width: "100%",
    borderRadius: 10,
    flexDirection: "row",
    padding: 5,
  },
  avatar: {
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
  },
});
