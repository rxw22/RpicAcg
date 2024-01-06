import { ScrollView, StyleSheet, View } from "react-native";
import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  Text,
  Card,
  Button,
  Surface,
  useTheme,
  Chip,
  Divider,
  Icon,
} from "react-native-paper";
import { useRequest } from "ahooks";
import dayjs from "dayjs";

import { RootStackParamList } from "@/navigations/mainStacks/types";
import BgBox from "@/components/bgBox";
import { useNetworkProvider } from "@/network/networkProvider";
import Image from "@/components/image";
import PressableButton from "@/components/button";
import HorizontalList from "./horizontalList";
import { useReadStore } from "@/store/readStore";

type Props = NativeStackScreenProps<RootStackParamList, "details">;

const ComicDetails: React.FC<Props> = ({ route, navigation }) => {
  const { httpRequest } = useNetworkProvider();
  const { comicId } = route.params;
  const theme = useTheme();
  // 保存浏览记录
  const { addRecord } = useReadStore();
  // 继续阅读
  const { comicRecord } = useReadStore();
  const record = comicRecord[comicId];

  const { loading, data, error, refresh } = useRequest(
    httpRequest.fetchComicDetail.bind(httpRequest),
    {
      defaultParams: [comicId],
      onError(e) {
        console.log(e.message);
      },
    }
  );

  const {
    loading: comicEpisodesLoading,
    data: comicEpisodes,
    error: comicEpisodesError,
    refresh: comicEpisodesRefresh,
  } = useRequest(httpRequest.fetchComicEpisodes.bind(httpRequest), {
    defaultParams: [comicId],
    onError(e) {
      console.log(e.message);
    },
  });

  const {
    loading: comicRecommendLoading,
    data: comicRecommend,
    error: comicRecommendError,
    refresh: comicRecommendRefresh,
  } = useRequest(httpRequest.fetchComicRecommend.bind(httpRequest), {
    defaultParams: [comicId],
    onError(e) {
      console.log(e.message);
    },
  });

  const startReader = (order: number, y: number) => {
    navigation.navigate("reader", {
      comicId,
      order,
      title: response?.comic.title || "",
      y,
    });
  };

  const { data: response } = data || {};
  const { comics } = comicRecommend?.data || {};
  return (
    <BgBox
      style={styles.container}
      error={error?.message || comicEpisodesError?.message}
      loading={loading || comicEpisodesLoading}
      refresh={() => {
        refresh();
        comicEpisodesRefresh();
        comicRecommendRefresh();
      }}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ padding: 8 }}>
          <View style={styles.titleView}>
            {response && (
              <Text variant="headlineMedium" style={{ textAlign: "center" }}>
                {response?.comic.title}({response?.comic.pagesCount}P)
              </Text>
            )}
          </View>
          <View style={styles.imageView}>
            <Card mode="contained" style={styles.coverView}>
              <Image
                style={styles.cover}
                pageLoading={loading}
                source={{
                  uri: `${response?.comic.thumb.fileServer}/static/${response?.comic.thumb.path}`,
                }}
              />
            </Card>
          </View>
          <Surface style={styles.comicInfo}>
            {/* cards-heart-outline */}
            <PressableButton
              onPress={() => console.log("Pressed")}
              rippleColor="rgba(0, 0, 0, .1)"
              style={styles.infoItem}
              title={response?.comic.likesCount}
              icon="cards-heart"
              iconSize={26}
              iconColor={theme.colors.primary}
              textProps={{ variant: "bodyLarge" }}
            />
            <PressableButton
              onPress={() => console.log("Pressed")}
              rippleColor="rgba(0, 0, 0, .12)"
              style={styles.infoItem}
              title={response?.comic.isFavourite ? "已收藏" : "未收藏"}
              icon={
                response?.comic.isFavourite ? "tag-heart" : "tag-heart-outline"
              }
              iconSize={26}
              iconColor={theme.colors.primary}
              textProps={{ variant: "bodyLarge" }}
            />
            <PressableButton
              onPress={() => console.log("Pressed")}
              rippleColor="rgba(0, 0, 0, .12)"
              style={styles.infoItem}
              title={response?.comic.totalComments}
              icon="comment-processing"
              iconSize={26}
              iconColor={theme.colors.primary}
              textProps={{ variant: "bodyLarge" }}
            />
          </Surface>
          {record && (
            <View
              style={[
                styles.operates,
                {
                  backgroundColor: theme.colors.secondaryContainer,
                  width: "100%",
                  borderRadius: 12,
                  alignItems: "center",
                  paddingHorizontal: 16,
                  justifyContent: "space-between",
                },
              ]}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Icon source="clipboard-clock-outline" size={20} />
                <View style={{ width: 12 }} />
                <Text variant="bodyMedium">上次阅读到第 {record.order} 章</Text>
              </View>
              <Button
                onPress={() => {
                  startReader(record.order, record.y);
                }}
              >
                继续阅读
              </Button>
            </View>
          )}
          <View style={styles.operates}>
            <Button mode="contained" style={styles.operatesItem}>
              下载
            </Button>
            <Button
              mode="contained"
              style={styles.operatesItem}
              onPress={() => {
                addRecord(response?.comic, "browses");
                startReader(comicEpisodes?.at(-1)?.order || 1, 0);
              }}
            >
              从头开始
            </Button>
          </View>
          {/* 标签 */}
          <View style={styles.tags}>
            <View style={{ flexDirection: "row" }}>
              <Chip style={{ backgroundColor: theme.colors.primaryContainer }}>
                作者
              </Chip>
              <Chip
                onPress={() => console.log("Pressed")}
                style={{
                  marginLeft: 8,
                  backgroundColor: theme.colors.surfaceVariant,
                }}
              >
                {response?.comic.author || "未知"}
              </Chip>
            </View>
            <View style={{ flexDirection: "row", marginTop: 8 }}>
              <Chip style={{ backgroundColor: theme.colors.primaryContainer }}>
                汉化
              </Chip>
              <Chip
                onPress={() => console.log("Pressed")}
                style={{
                  marginLeft: 8,
                  backgroundColor: theme.colors.surfaceVariant,
                }}
              >
                {response?.comic.chineseTeam || "未知"}
              </Chip>
            </View>
            <View style={{ flexDirection: "row", marginTop: 8 }}>
              <View>
                <Chip
                  style={{ backgroundColor: theme.colors.primaryContainer }}
                >
                  分类
                </Chip>
              </View>
              <View style={{ flexDirection: "row", flexWrap: "wrap", flex: 1 }}>
                {response?.comic.categories.map((item) => (
                  <Chip
                    onPress={() => console.log("Pressed")}
                    style={{
                      marginLeft: 8,
                      backgroundColor: theme.colors.surfaceVariant,
                      marginBottom: 8,
                    }}
                    key={item}
                  >
                    {item}
                  </Chip>
                ))}
              </View>
            </View>
            <View style={{ flexDirection: "row", marginTop: response ? 0 : 8 }}>
              <View>
                <Chip
                  style={{ backgroundColor: theme.colors.primaryContainer }}
                >
                  标签
                </Chip>
              </View>
              <View style={{ flexDirection: "row", flexWrap: "wrap", flex: 1 }}>
                {response?.comic.tags.map((item) => (
                  <Chip
                    onPress={() => console.log("Pressed")}
                    style={{
                      marginLeft: 8,
                      backgroundColor: theme.colors.surfaceVariant,
                      marginBottom: 8,
                    }}
                    key={item}
                  >
                    {item}
                  </Chip>
                ))}
              </View>
            </View>
            {response && (
              <View
                style={[
                  styles.author,
                  { backgroundColor: theme.colors.primaryContainer },
                ]}
              >
                <Card style={styles.authorAvatar} mode="contained">
                  <Image
                    style={{ width: "100%", height: "100%" }}
                    pageLoading={loading}
                    showLoading={false}
                    source={{
                      uri: `${response?.comic._creator.avatar?.fileServer}/static/${response?.comic._creator.avatar?.path}`,
                    }}
                    size={14}
                  />
                </Card>
                <View>
                  <Text variant="headlineSmall" numberOfLines={1}>
                    {response?.comic._creator.name}
                  </Text>
                  <Text variant="bodyMedium" numberOfLines={1}>
                    {dayjs(response?.comic.updated_at).format("YYYY-MM-DD")}
                  </Text>
                </View>
              </View>
            )}
          </View>
          <Divider />
          {/* 章节 */}
          <View style={styles.epsView}>
            <View style={{ marginBottom: 8 }}>
              <Text variant="headlineSmall">章节</Text>
            </View>
            <View>
              {Array.from({
                length: Math.ceil((comicEpisodes?.length || 0) / 2),
              }).map((_, index) => {
                return (
                  <View
                    style={{ flexDirection: "row", flex: 1 }}
                    key={comicEpisodes?.[index * 2]._id}
                  >
                    {comicEpisodes?.[index * 2] ? (
                      <Button
                        style={styles.epsBtn}
                        contentStyle={styles.epsCard}
                        mode="contained-tonal"
                        onPress={() => {
                          startReader(comicEpisodes?.[index * 2].order, 0);
                        }}
                      >
                        {comicEpisodes?.[index * 2].title}
                      </Button>
                    ) : (
                      <Button
                        style={styles.epsBtn}
                        contentStyle={styles.epsCard}
                        mode="text"
                      >
                        {null}
                      </Button>
                    )}
                    {comicEpisodes?.[index * 2 + 1] ? (
                      <Button
                        style={styles.epsBtn}
                        contentStyle={styles.epsCard}
                        mode="contained-tonal"
                        onPress={() => {
                          startReader(comicEpisodes?.[index * 2 + 1].order, 0);
                        }}
                      >
                        {comicEpisodes?.[index * 2 + 1].title}
                      </Button>
                    ) : (
                      <Button
                        style={styles.epsBtn}
                        contentStyle={styles.epsCard}
                        mode="text"
                      >
                        {null}
                      </Button>
                    )}
                  </View>
                );
              })}
            </View>
          </View>
          <Divider />
          {/* 简介 */}
          <View style={styles.description}>
            <View style={{ marginBottom: 8 }}>
              <Text variant="headlineSmall">简介</Text>
            </View>
            <View>
              <Text variant="bodyLarge">{response?.comic.description}</Text>
            </View>
          </View>
          <Divider />
          {/* 相关推荐 */}
          <View style={styles.recommend}>
            <View style={{ marginBottom: 8 }}>
              <Text variant="headlineSmall">相关推荐</Text>
            </View>
            <HorizontalList dataSource={comics || []} navigation={navigation} />
          </View>
        </View>
      </ScrollView>
    </BgBox>
  );
};

export default ComicDetails;

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
  },
  titleView: {
    alignItems: "center",
    justifyContent: "center",
  },
  imageView: {
    alignItems: "center",
    marginVertical: 10,
  },
  coverView: {
    width: 230,
    height: 326,
    overflow: "hidden",
  },
  cover: {
    height: "100%",
    width: "100%",
  },
  comicInfo: {
    width: "100%",
    flexDirection: "row",
    height: 55,
    borderRadius: 20,
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  infoItem: {
    padding: 10,
    borderRadius: 10,
    flex: 1,
  },
  operates: {
    flexDirection: "row",
    marginTop: 12,
  },
  operatesItem: {
    flex: 1,
    marginHorizontal: 10,
  },
  tags: {
    marginTop: 12,
    padding: 8,
  },
  author: {
    width: "100%",
    height: 60,
    borderRadius: 10,
    backgroundColor: "pink",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  authorAvatar: {
    height: 46,
    width: 46,
    borderRadius: 23,
    overflow: "hidden",
    marginRight: 12,
  },
  epsView: {
    paddingVertical: 15,
  },
  epsBtn: {
    flex: 1,
    marginVertical: 4,
    marginHorizontal: 12,
  },
  epsCard: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  description: {
    paddingVertical: 15,
  },
  recommend: {
    paddingTop: 15,
  },
});
