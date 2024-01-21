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
          // headerShown: false,
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
    </Stack.Navigator>
  );
}
