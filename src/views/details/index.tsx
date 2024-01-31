import { ScrollView, StyleSheet, View } from "react-native";
import React, { useCallback, useLayoutEffect } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  Text,
  Card,
  Button,
  useTheme,
  Divider,
  Icon,
  FAB,
} from "react-native-paper";
import { useRequest } from "ahooks";

import { RootStackParamList } from "@/navigations/mainStacks/types";
import BgBox from "@/components/bgBox";
import { useUtilsProvider } from "@/network/utilsProvider";
import Image from "@/components/image";
import HorizontalList from "./horizontalList";
import { useReadStore } from "@/store/readStore";
import Author from "./Author";
import Chapter from "./Chapter";
import CollectOrLike from "./CollectOrLike";
import Tags from "./Tags";
import AppBar from "./AppBar";
import { Toast } from "toastify-react-native";

type Props = NativeStackScreenProps<RootStackParamList, "details">;

const ComicDetails: React.FC<Props> = ({ route, navigation }) => {
  const { httpRequest, historyFileCache, localCollectCache } =
    useUtilsProvider();
  const { comicId } = route.params;
  const theme = useTheme();
  // 继续阅读
  const { comicRecord } = useReadStore();
  const record = comicRecord[comicId];

  // 获取comic详情
  const { loading, data, error, refresh } = useRequest(
    httpRequest.fetchComicDetail.bind(httpRequest),
    {
      defaultParams: [comicId],
      onError(e) {
        console.log(e.message);
      },
    }
  );

  // 获取章节
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

  const { data: response } = data || {};
  const { comics } = comicRecommend?.data || {};

  useLayoutEffect(() => {
    navigation.setOptions({
      header: (props) => (
        <AppBar
          {...props}
          collect={() => {
            localCollectCache?.setData(response?.comic, () => {
              Toast.success("已添加本地搜藏", "bottom");
            });
          }}
        />
      ),
    });
  }, [response]);

  /**
   * @order 章节
   * @isScratch 从头开始？
   * @isScratch 有下一页？
   */
  const startReader = useCallback(
    (order: number, isScratch: boolean = true, hasNext: boolean) => {
      navigation.navigate("reader", {
        comicId,
        order,
        title: response?.comic.title || "",
        record,
        isScratch,
        hasNext,
        chapterLength: comicEpisodes?.length || 1,
      });
    },
    [response, comicEpisodes]
  );

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
                contentPosition="left center"
                contentFit="cover"
              />
            </Card>
          </View>
          <CollectOrLike
            navigation={navigation}
            comicId={comicId}
            response={response?.comic}
          />
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
                <Text variant="bodyMedium">
                  上次阅读到第 {record.order} 章第 {record.page + 1} 页
                </Text>
              </View>
              <Button
                onPress={() => {
                  startReader(
                    record.order,
                    false,
                    (comicEpisodes?.length || 1) > record.order
                  );
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
                historyFileCache?.setData(response?.comic);
                startReader(
                  comicEpisodes?.at(-1)?.order || 1,
                  true,
                  (comicEpisodes?.length || 1) > 1
                );
              }}
            >
              从头开始
            </Button>
          </View>
          {/* 标签 */}
          <View style={styles.tags}>
            <Tags response={response?.comic} navigation={navigation} />
            <Author
              response={response?.comic}
              loading={loading}
              navigation={navigation}
            />
          </View>
          <Divider />
          {/* 章节 */}
          <Chapter comicEpisodes={comicEpisodes} startReader={startReader} />
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

export default React.memo(ComicDetails);

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
  operates: {
    flexDirection: "row",
    marginTop: 12,
  },
  operatesItem: {
    flex: 1,
    marginHorizontal: 10,
  },
  description: {
    paddingVertical: 15,
  },
  recommend: {
    paddingTop: 15,
  },
  fab: {
    position: "absolute",
    bottom: 15,
    right: 15,
  },
  tags: {
    marginTop: 12,
    padding: 8,
  },
});
