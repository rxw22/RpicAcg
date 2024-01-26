import { StyleSheet, View } from "react-native";
import React, { useCallback, useRef, useState } from "react";
import { ActivityIndicator } from "react-native-paper";
import { useRequest } from "ahooks";
import { FlashList, ListRenderItem } from "@shopify/flash-list";

import BgBox from "@/components/bgBox";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigations/mainStacks/types";
import { useUtilsProvider } from "@/network/utilsProvider";
import { Comment } from "@/network/types";
import SendComment from "./SendComment";
import Item from "./Item";

type Props = NativeStackScreenProps<RootStackParamList, "comment">;

const CommentList: React.FC<Props> = ({ navigation, route }) => {
  const { comicId } = route.params;
  const { httpRequest } = useUtilsProvider();
  const pageRef = useRef({
    currerntPage: 1,
    totalPage: 0,
  });
  const [dataSource, setDataSource] = useState<Comment[]>([]);

  const { loading, run } = useRequest(
    httpRequest.fetchComicComment.bind(httpRequest),
    {
      defaultParams: [{ comicId, page: 1 }],
      onSuccess(data) {
        const { pages, docs } = data.comments;
        pageRef.current.totalPage = pages;
        setDataSource([...dataSource, ...docs]);
      },
    }
  );

  const loadMore = () => {
    if (pageRef.current.currerntPage < pageRef.current.totalPage) {
      pageRef.current.currerntPage++;
      run({
        page: pageRef.current.currerntPage,
        comicId,
      });
    }
  };

  const updateDataSource = useCallback(
    (id: string, liked: boolean) => {
      const current = dataSource.find((item) => item._id === id);
      const info = liked
        ? { likesCount: current!.likesCount + 1, isLiked: liked }
        : { likesCount: current!.likesCount - 1, isLiked: liked };
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

  const renderItem: ListRenderItem<Comment> = ({ item }) => {
    return (
      <Item
        item={item}
        navigation={navigation}
        updateDataSource={updateDataSource}
      />
    );
  };

  const initRefresh = () => {
    pageRef.current.currerntPage = 0;
    setDataSource([]);
  };

  const renderFooter = () => {
    return loading ? (
      <View
        style={{
          alignItems: "center",
          paddingVertical: 10,
          height: 110,
        }}
      >
        <ActivityIndicator size="small" animating />
      </View>
    ) : (
      <View style={{ height: 110 }} />
    );
  };

  return (
    <BgBox style={styles.container}>
      <View style={styles.full}>
        <FlashList
          showsVerticalScrollIndicator={false}
          data={dataSource}
          keyExtractor={(item) => item._id + item.content.slice(0, 10)}
          renderItem={renderItem}
          estimatedItemSize={120}
          ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
          onEndReachedThreshold={0.3}
          onEndReached={loadMore}
          ListFooterComponent={renderFooter}
          keyboardDismissMode="on-drag"
        />
        <SendComment comicId={comicId} refresh={initRefresh} />
      </View>
    </BgBox>
  );
};

export default React.memo(CommentList);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  full: {
    width: "100%",
    height: "100%",
    paddingHorizontal: 8,
    position: "relative",
  },
});
