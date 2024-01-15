import { StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import PressableButton from "@/components/button";
import { Surface, useTheme } from "react-native-paper";
import { ComicDetail } from "@/network/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigations/mainStacks/types";
import { useUtilsProvider } from "@/network/utilsProvider";
import { useRequest } from "ahooks";

interface Props {
  response: ComicDetail | undefined;
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "details",
    undefined
  >;
  comicId: string;
}

const CollectOrLike: React.FC<Props> = ({ response, comicId, navigation }) => {
  const theme = useTheme();
  const { httpRequest } = useUtilsProvider();

  // 记录是否点赞
  const [like, setLike] = useState(false);
  // 记录是否收藏
  const [collect, setCollect] = useState(false);

  useEffect(() => {
    setLike(!!response?.isLiked);
    setCollect(!!response?.isFavourite);
  }, [response]);

  const { run: likeRun, loading: likeLoading } = useRequest(
    httpRequest.likeOrUnlikeComic.bind(httpRequest),
    {
      manual: true,
      onError(e) {
        console.log(e);
      },
      onSuccess() {
        setLike(!like);
      },
    }
  );

  const { run: collectRun, loading: collectLoading } = useRequest(
    httpRequest.collectOrUncollectComic.bind(httpRequest),
    {
      manual: true,
      onError(e) {
        console.log(e);
      },
      onSuccess() {
        setCollect(!collect);
      },
    }
  );

  return (
    <Surface style={styles.comicInfo} mode="flat">
      <PressableButton
        onPress={() => {
          likeRun(comicId);
        }}
        rippleColor="rgba(0, 0, 0, .12)"
        style={styles.infoItem}
        title={response?.likesCount}
        icon={like ? "cards-heart" : "cards-heart-outline"}
        iconSize={24}
        iconColor={theme.colors.primary}
        textProps={{ variant: "bodyLarge" }}
        loading={likeLoading}
      />
      <PressableButton
        onPress={() => {
          collectRun(comicId);
        }}
        rippleColor="rgba(0, 0, 0, .12)"
        style={styles.infoItem}
        title={collect ? "已收藏" : "未收藏"}
        icon={collect ? "tag-heart" : "tag-heart-outline"}
        iconSize={24}
        iconColor={theme.colors.primary}
        textProps={{ variant: "bodyLarge" }}
        loading={collectLoading}
      />
      <PressableButton
        onPress={() => {
          navigation.navigate("comment", {
            comicId,
          });
        }}
        rippleColor="rgba(0, 0, 0, .12)"
        style={styles.infoItem}
        title={response?.totalComments}
        icon="comment-processing"
        iconSize={24}
        iconColor={theme.colors.primary}
        textProps={{ variant: "bodyLarge" }}
      />
    </Surface>
  );
};

export default React.memo(CollectOrLike);

const styles = StyleSheet.create({
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
});
