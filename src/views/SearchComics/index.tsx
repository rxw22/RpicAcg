import { View, StyleSheet } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";

import BgBox from "@/components/bgBox";
import { useUtilsProvider } from "@/network/utilsProvider";
import { useRequest } from "ahooks";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigations/mainStacks/types";
import { Comic, ComicSort, SearchedComic } from "@/network/types";
import List from '@/components/ComicsList';
import Item from './Item'
import { useGlobalStore } from "@/store/globalStore";
import LoadingMask from "@/components/LoadingMask";

type Props = NativeStackScreenProps<RootStackParamList, "searchcomics">;

const SearchComics: React.FC<Props> = ({ route, navigation }) => {
  const { keyword } = route.params;
  const { httpRequest } = useUtilsProvider();
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

  const navigate = useCallback((name: string, params: any) => {
    // @ts-ignore
    navigation.navigate(name, params);
  }, [navigation]);

  return (
    <BgBox style={styles.container} error={error?.message} refresh={refresh}>
      <View style={[styles.full, { paddingHorizontal: 5, position: "relative" }]}>
        <LoadingMask once={true} loading={loading} />
        <List
          dataSource={(dataSource || []) as unknown as Comic[]}
          loading={loading}
          loadMore={loadMore}
          navigate={navigate}
          CustomItem={Item}
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
