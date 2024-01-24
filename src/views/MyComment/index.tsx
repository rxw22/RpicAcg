import { StyleSheet, View } from "react-native";
import React, { useState, useRef, useCallback } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigations/mainStacks/types";
import BgBox from "@/components/bgBox";
import {
  ActivityIndicator,
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
import { MyCommentDoc } from "@/network/types";
import { Toast } from "toastify-react-native";

type Props = NativeStackScreenProps<RootStackParamList, "my-comments">;

const MyComment: React.FC<Props> = ({ navigation }) => {
  const { httpRequest } = useUtilsProvider();
  const { user } = useGlobalStore();
  const theme = useTheme();
  const [dataSource, setDataSource] = useState<MyCommentDoc[]>([]);
  const pageRef = useRef({
    page: 1,
    pages: 0,
  });

  const { loading, error, refresh, run } = useRequest(
    httpRequest.fetchMyComments.bind(httpRequest),
    {
      defaultParams: [pageRef.current.page],
      onError(e) {
        console.log(e);
      },
      onSuccess(result) {
        const { pages, docs } = result;
        pageRef.current.pages = pages;
        setDataSource([...dataSource, ...docs]);
      },
    }
  );

  const { run: likeRun, loading: likeLoading } = useRequest(
    httpRequest.likeOrUnLikeComment.bind(httpRequest),
    {
      manual: true,
      onSuccess(_, [id]) {
        updateDataSource(id);
      },
      onError(e) {
        console.log(e);
        Toast.error("点赞失败", "bottom");
      },
    }
  );

  const loadMore = () => {
    if (pageRef.current.page < pageRef.current.pages) {
      pageRef.current.page++;
      run(pageRef.current.page);
    }
  };

  const updateDataSource = useCallback(
    (id: string) => {
      const current = dataSource.find((item) => item._id === id);
      const info = !current?.isLiked
        ? { likesCount: current!.likesCount + 1, isLiked: !current?.isLiked }
        : { likesCount: current!.likesCount - 1, isLiked: !current?.isLiked };
      const newDataSource = dataSource.map((item) => {
        if (item._id === id) {
          return { ...item, ...info };
        }
        return item;
      });
      setDataSource(newDataSource);
    },
    [dataSource]
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
          data={dataSource}
          estimatedItemSize={160}
          ItemSeparatorComponent={() => <Divider />}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMore}
          onEndReachedThreshold={0.7}
          renderItem={({ item }) => {
            const {
              content,
              _id,
              _comic,
              _game,
              created_at,
              likesCount,
              commentsCount,
              isLiked,
            } = item;
            return (
              <TouchableRipple
                rippleColor="rgba(0, 0, 0, .2)"
                onPress={() => {
                  if (_comic) {
                    navigation.navigate("details", {
                      comicId: _comic?._id,
                    });
                  } else if (_game) {
                    navigation.navigate("game-details", {
                      gameId: _game._id,
                      title: _game.title,
                    });
                  }
                }}
              >
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
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
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
                            onPress={(e) => {
                              e.stopPropagation();
                              likeRun(_id);
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
                              {likeLoading ? (
                                <ActivityIndicator size={15} animating />
                              ) : (
                                <Icon
                                  source={
                                    isLiked
                                      ? "cards-heart"
                                      : "cards-heart-outline"
                                  }
                                  size={15}
                                />
                              )}
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
                            onPress={(e) => {
                              e.stopPropagation();
                              navigation.navigate("comchildren", {
                                commentId: _id,
                              });
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
              </TouchableRipple>
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
