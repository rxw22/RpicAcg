import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "@/views/login";
import BottomTabs from "@/navigations/bottomTabs";
import CustomNavigationBar from "@/components/appBar";
import Settings from "@/views/settings";
import Search from "@/views/search";
import CustomSearchBar from "@/components/searchBar";
import { useUserStore } from "@/store/userStore";
import CollectBar from "@/components/collectBar";
import ComicDetails from "@/views/details";
import Reader from "@/views/reader";

import usePunchIn from "@/hooks/usePunchIn";

import type { RootStackParamList } from "./types";
import Collect from "@/views/collect";
import ComicsAppBar from "@/views/Comics/AppBar";
import Comics from "@/views/Comics";
import Comment from "@/views/comment";
import CommentAppBar from "@/views/comment/AppBar";
import ComChildren from "@/views/ComChildren";
import SearchComics from "@/views/SearchComics";
import SearchComicsAppBar from "@/views/SearchComics/AppBar";
import WebViewPage from "@/views/WebView";
import GameDetails from "@/views/game/details";
import DetailsAppBar from "@/views/game/DetailsAppBar";
import GameComment from "@/views/game/Comment";
import GameCommentAppBar from "@/views/game/Comment/AppBar";
import MyComments from "@/views/MyComment";
import MyCommentsAppBar from "@/views/MyComment/AppBar";
import NetCollect from "@/views/collect/NetCollect";
import NetCollectAppBar from "@/views/collect/NetCollectAppBar";
import LocalCollect from "@/views/collect/LocalCollect";
import LocalCollectAppBar from "@/views/collect/LocalCollectAppBar";
import History from "@/views/History";
import HistoryAppBar from "@/views/History/AppBar";
import RankingAppBar from "@/views/ranking/AppBar";
import Ranking from "@/views/ranking";
import Random from "@/views/Random";
import RandomAppBar from "@/views/Random/AppBar";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function MainStacks() {
  const { token } = useUserStore();
  // 自动打卡
  usePunchIn();
  const isLogin = token ? "main" : "login";
  return (
    <Stack.Navigator
      initialRouteName={isLogin}
      screenOptions={{
        header: (props) => <CustomNavigationBar {...props} />,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen
        name="login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="main"
        component={BottomTabs}
        options={{ title: "main", headerShown: false }}
      />
      <Stack.Screen
        name="settings"
        component={Settings}
        options={{ title: "设置" }}
      />
      <Stack.Screen
        name="search"
        component={Search}
        options={{
          header: (props) => <CustomSearchBar {...props} />,
        }}
      />
      <Stack.Screen
        name="ranking"
        options={{
          title: "排行",
          header: (props) => <RankingAppBar {...props} />,
        }}
        component={Ranking}
      />
      <Stack.Screen
        name="details"
        component={ComicDetails}
        options={{
          title: "漫画详情",
          header: (props) => <CollectBar {...props} />,
        }}
      />
      <Stack.Screen
        name="reader"
        component={Reader}
        options={{
          title: "阅读器",
          headerTransparent: true,
        }}
      />
      <Stack.Screen
        name="collect"
        component={Collect}
        options={{
          title: "收藏夹",
        }}
      />
      <Stack.Screen
        name="comics"
        component={Comics}
        options={{
          title: "分区",
          header: (props) => <ComicsAppBar {...props} />,
        }}
      />
      <Stack.Screen
        name="searchcomics"
        component={SearchComics}
        options={{
          title: "搜索",
          header: (props) => <SearchComicsAppBar {...props} />,
        }}
      />
      <Stack.Screen
        name="comment"
        component={Comment}
        options={{
          title: "评论",
          header: (props) => <CommentAppBar {...props} />,
        }}
      />
      <Stack.Screen
        name="comchildren"
        component={ComChildren}
        options={{
          title: "回复",
          header: (props) => <CommentAppBar {...props} />,
        }}
      />
      <Stack.Screen
        name="webview"
        component={WebViewPage}
        options={{
          title: "webview",
          header: (props) => <CommentAppBar {...props} />,
        }}
      />
      <Stack.Screen
        name="game-details"
        component={GameDetails}
        options={{
          header: (props) => <DetailsAppBar {...props} />,
        }}
      />
      <Stack.Screen
        name="game-comment"
        component={GameComment}
        options={{
          title: "评论",
          header: (props) => <GameCommentAppBar {...props} />,
        }}
      />
      <Stack.Screen
        name="my-comments"
        component={MyComments}
        options={{
          title: "评论",
          header: (props) => <MyCommentsAppBar {...props} />,
        }}
      />
      <Stack.Screen
        name="net-collect"
        component={NetCollect}
        options={{
          title: "网络收藏",
          header: (props) => <NetCollectAppBar {...props} />,
        }}
      />
      <Stack.Screen
        name="local-collect"
        component={LocalCollect}
        options={{
          title: "本地收藏",
          header: (props) => <LocalCollectAppBar {...props} />,
        }}
      />
      <Stack.Screen
        name="history"
        component={History}
        options={{
          title: "本地收藏",
          header: (props) => <HistoryAppBar {...props} />,
        }}
      />
      <Stack.Screen
        name="random"
        component={Random}
        options={{
          title: "随机本子",
          header: (props) => <RandomAppBar {...props} />,
        }}
      />
    </Stack.Navigator>
  );
}
