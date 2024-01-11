import { View, StyleSheet } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";

import BgBox from "@/components/bgBox";
import { useUtilsProvider } from "@/network/utilsProvider";
import { useRequest } from "ahooks";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigations/mainStacks/types";
import { Comic, ComicSort } from "@/network/types";
import List from '@/components/ComicsList';
import { useGlobalStore } from "@/store/globalStore";
import LoadingMask from "@/components/LoadingMask";

type Props = NativeStackScreenProps<RootStackParamList, "comics">;

const Comics: React.FC<Props> = ({ route, navigation }) => {
  const { c } = route.params;
  const { httpRequest } = useUtilsProvider();
  const pageRef = useRef({
    currerntPage: 1,
    totalPage: 0,
    s: ComicSort.Default,
  });
  const [dataSource, setDataSource] = useState<Comic[]>([]);
  const { comicSort } = useGlobalStore();

  useEffect(() => {
    pageRef.current = {
      currerntPage: 1,
      totalPage: 0,
      s: comicSort,
    };
    setDataSource([]);
    run({ c: encodeURIComponent(c), page: 1, s: comicSort });
  }, [comicSort]);

  const { error, refresh, run, loading } = useRequest(
    httpRequest.fetchComics.bind(httpRequest),
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
        s: pageRef.current.s,
        c: encodeURIComponent(c),
      });
    }
  };

  const navigate = useCallback((name: string, params: any) => {
    // @ts-ignore
    navigation.navigate(name, params);
  }, []);

  return (
    <BgBox style={styles.container} error={error?.message} refresh={refresh}>
      <View style={[styles.full, { paddingHorizontal: 5, position: "relative" }]}>
        <LoadingMask once={true} loading={loading} />
        <List
          dataSource={dataSource || []}
          loading={loading}
          loadMore={loadMore}
          navigate={navigate}
        />
      </View>
    </BgBox>
  );
};

export default React.memo(Comics);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  full: {
    height: "100%",
    width: "100%",
  },
});
