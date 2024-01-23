import { StyleSheet, View } from "react-native";
import React from "react";
import { Comment } from "@/network/types";
import {
  ActivityIndicator,
  Card,
  Icon,
  Text,
  TouchableRipple,
} from "react-native-paper";
import { useUtilsProvider } from "@/network/utilsProvider";
import { useRequest } from "ahooks";
import { Image } from "expo-image";
import dayjs from "dayjs";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigations/mainStacks/types";
import { Toast } from "toastify-react-native";

interface Props {
  item: Comment;
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "game-comment",
    undefined
  >;
  updateDataSource(id: string, liked: boolean): void;
}

const Item: React.FC<Props> = ({ item, navigation, updateDataSource }) => {
  const { httpRequest } = useUtilsProvider();
  const {
    _user,
    content,
    _id,
    created_at,
    likesCount,
    commentsCount,
    isLiked,
  } = item;
  const uri = _user?.avatar
    ? `${_user.avatar.fileServer}/static/${_user.avatar.path}`
    : require("@/assets/imgs/user.png");

  const { run: likeRun, loading: likeLoading } = useRequest(
    httpRequest.likeOrUnLikeComment.bind(httpRequest),
    {
      manual: true,
      onSuccess(_, [id]) {
        updateDataSource(id, !isLiked);
      },
      onError(e) {
        console.log(e);
        Toast.error("点赞失败", "bottom");
      },
    }
  );
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
        <View
          style={{
            flexDirection: "row",
            paddingTop: 4,
            alignItems: "center",
          }}
        >
          <View style={{ marginRight: 40 }}>
            <Text variant="bodySmall">
              {dayjs(created_at).format("YYYY-MM-DD HH:mm:ss")}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              flex: 1,
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View
              style={{ borderRadius: 5, overflow: "hidden", marginRight: 8 }}
            >
              <TouchableRipple
                onPress={() => {
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
                      source={isLiked ? "cards-heart" : "cards-heart-outline"}
                      size={15}
                    />
                  )}
                  <View style={{ width: 5 }} />
                  <Text variant="bodySmall">{likesCount}</Text>
                </View>
              </TouchableRipple>
            </View>
            <View
              style={{ borderRadius: 5, overflow: "hidden", marginRight: 12 }}
            >
              <TouchableRipple
                onPress={() => {
                  navigation.navigate("comchildren", {
                    comment: item,
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
  );
};

export default React.memo(Item);

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
