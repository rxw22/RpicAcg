import React, { useCallback, memo, useLayoutEffect } from "react";
import List from "@/components/ComicsList/";
import BgBox from "@/components/bgBox";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigations/mainStacks/types";
import { useUtilsProvider } from "@/network/utilsProvider";
import { useRequest } from "ahooks";
import AppBar from "./AppBar";

type Props = NativeStackScreenProps<RootStackParamList, "history">;

const BrowsingHistory: React.FC<Props> = ({ navigation }) => {
  const { historyFileCache } = useUtilsProvider();

  const { data, error, refresh } = useRequest(
    historyFileCache!.getData.bind(historyFileCache),
    {
      onError(e) {
        console.log(e);
      },
    }
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      header: (props) => (
        <AppBar
          {...props}
          clearAll={() => {
            historyFileCache?.removeAll(() => {
              refresh();
            });
          }}
        />
      ),
    });
  }, []);

  const loadMore = useCallback(() => {}, []);

  const navigate = useCallback((name: string, params: any) => {
    // @ts-ignore
    navigation.navigate(name, params);
  }, []);

  return (
    <BgBox
      style={{ flex: 1, paddingHorizontal: 5 }}
      error={error?.message}
      refresh={refresh}
    >
      <List
        dataSource={data || []}
        navigate={navigate}
        loadMore={loadMore}
        loading={false}
      />
    </BgBox>
  );
};

export default memo(BrowsingHistory);
