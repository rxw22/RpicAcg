import { View, StyleSheet } from "react-native";
import React, { useEffect, useRef, useState } from "react";

import BgBox from "@/components/bgBox";
import { useNetworkProvider } from "@/network/networkProvider";
import { useRequest } from "ahooks";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigations/mainStacks/types";
import { ComicSort, SearchedComic } from "@/network/types";
import CommonList from "./CommonList";
import { useGlobalStore } from "@/store/globalStore";

type Props = NativeStackScreenProps<RootStackParamList, "searchcomics">;

const SearchComics: React.FC<Props> = ({ route, navigation }) => {
  const { keyword } = route.params;
  const { httpRequest } = useNetworkProvider();
  const pageRef = useRef({
    currerntPage: 1,
    totalPage: 0,
    sort: ComicSort.NewToOld,
  });
  const [dataSource, setDataSource] = useState<SearchedComic[]>([]);
  const { searchSort } = useGlobalStore();

  useEffect(() => {
    pageRef.current = {
      currerntPage: 1,
      totalPage: 0,
      sort: searchSort,
    };
    setDataSource([]);
    run({ keyword: keyword, page: 1, sort: searchSort });
  }, [searchSort]);

  const { error, refresh, run, loading } = useRequest(
    httpRequest.searchComics.bind(httpRequest),
    {
      manual: true,
      onError(e) {
        console.log(e);
      },
      onSuccess(data) {
        console.log(data);
        
        const { pages, docs } = data;
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
        sort: pageRef.current.sort,
        keyword: keyword,
      });
    }
  };

  return (
    <BgBox style={styles.container} error={error?.message} refresh={refresh}>
      <View style={[styles.full, { paddingHorizontal: 8 }]}>
        <CommonList
          dataSource={dataSource || []}
          loading={loading}
          loadMore={loadMore}
          navigation={navigation}
        />
      </View>
    </BgBox>
  );
};

export default React.memo(SearchComics);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  full: {
    height: "100%",
    width: "100%",
  },
});
