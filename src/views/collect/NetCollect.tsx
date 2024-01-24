import React, { useState, useRef, useCallback, memo } from "react";
import { useUtilsProvider } from "@/network/utilsProvider";
import { useRequest } from "ahooks";
import { Comic, ComicSort } from "@/network/types";
import List from "@/components/ComicsList/";
import BgBox from "@/components/bgBox";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigations/mainStacks/types";
import LoadingMask from "@/components/LoadingMask";

type Props = NativeStackScreenProps<RootStackParamList, "net-collect">;

const NetCollect: React.FC<Props> = ({ navigation }) => {
  const { httpRequest } = useUtilsProvider();
  const [dataSource, setDataSource] = useState<Comic[]>([]);
  const pageRef = useRef({
    page: 0,
    pages: 1,
    s: ComicSort.NewToOld,
  });

  const { loading, run } = useRequest(
    httpRequest.fetchUserFavourite.bind(httpRequest),
    {
      manual: true,
      onError(e) {
        console.log(e);
      },
      onSuccess(data, params) {
        const { docs, pages } = data?.data.comics || {};
        setDataSource([...dataSource, ...docs]);
        pageRef.current.page = params[0].page || 1;
        pageRef.current.pages = pages;
        pageRef.current.s = params[0].s || ComicSort.NewToOld;
      },
    }
  );

  const loadMore = useCallback(() => {
    if (pageRef.current.page < pageRef.current.pages) {
      run({ page: pageRef.current.page + 1, s: pageRef.current.s });
    }
  }, [run]);

  const navigate = useCallback((name: string, params: any) => {
    // @ts-ignore
    navigation.navigate(name, params);
  }, []);

  return (
    <BgBox style={{ flex: 1, paddingHorizontal: 5, position: "relative" }}>
      <LoadingMask once={true} loading={loading} />
      <List
        dataSource={dataSource}
        navigate={navigate}
        loadMore={loadMore}
        loading={loading}
      />
    </BgBox>
  );
};

export default memo(NetCollect);
