import { StyleSheet, View } from "react-native";
import React, { useRef, useState } from "react";
import {
  Card,
  Icon,
  Text,
  TouchableRipple,
  ActivityIndicator,
} from "react-native-paper";
import { useRequest } from "ahooks";
import { FlashList, ListRenderItem } from "@shopify/flash-list";
import { Image } from "expo-image";
import dayjs from "dayjs";

import BgBox from "@/components/bgBox";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigations/mainStacks/types";
import { useUtilsProvider } from "@/network/utilsProvider";
import { Comment } from "@/network/types";
import SendComment from "./SendComment";

type Props = NativeStackScreenProps<RootStackParamList, "comment">;

const CommentList: React.FC<Props> = ({ navigation, route }) => {
  const { comicId } = route.params;
  const { httpRequest } = useUtilsProvider();
  const pageRef = useRef({
    currerntPage: 1,
    totalPage: 0,
  });
  const [dataSource, setDataSource] = useState<Comment[]>([]);

  const { loading, data, run } = useRequest(
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

  const renderItem: ListRenderItem<Comment> = ({ item }) => {
    const { _user, content, _id, created_at, likesCount, commentsCount } = item;
    const uri = _user?.avatar
      ? `${_user.avatar.fileServer}/static/${_user.avatar.path}`
      : require("@/assets/imgs/user.png");

    return (
      <View style={itemStyles.warpper}>
        <View style={itemStyles.avatarView}>
          <Card
            style={[itemStyles.image, { overflow: "hidden" }]}
            mode="contained"
          >
            <Image
              style={itemStyles.image}
              source={uri}
              recyclingKey={_id}
              transition={150}
            />
          </Card>
        </View>
        <View style={itemStyles.contentView}>
          <View>
            <Text variant="titleSmall" numberOfLines={1}>
              {_user.name}
            </Text>
          </View>
          <View style={{ paddingTop: 8, paddingBottom: 4 }}>
            <Text variant="bodyMedium">{content}</Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <View style={{ marginRight: 40, paddingTop: 4 }}>
              <Text variant="bodySmall">
                {dayjs(created_at).format("YYYY-MM-DD HH:mm:ss")}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                flex: 1,
                justifyContent: "space-between",
              }}
            >
              <TouchableRipple
                onPress={() => console.log("Pressed")}
                rippleColor="rgba(0, 0, 0, .22)"
              >
                <View style={{ flexDirection: "row", padding: 4 }}>
                  <Icon source="cards-heart-outline" size={15} />
                  <View style={{ width: 5 }} />
                  <Text variant="bodySmall">{likesCount}</Text>
                </View>
              </TouchableRipple>
              <TouchableRipple
                onPress={() => {
                  navigation.navigate("comchildren", {
                    comment: item,
                  });
                }}
                rippleColor="rgba(0, 0, 0, .22)"
                style={{
                  marginRight: 12,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    padding: 4,
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
          justifyContent: "center",
          paddingVertical: 10,
        }}
      >
        <ActivityIndicator size="small" animating />
      </View>
    ) : null;
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
          ItemSeparatorComponent={() => <View style={{ height: 11 }} />}
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

const itemStyles = StyleSheet.create({
  warpper: {
    flexDirection: "row",
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarView: {
    paddingHorizontal: 8,
  },
  contentView: {
    flex: 1,
    marginLeft: 8,
  },
});
