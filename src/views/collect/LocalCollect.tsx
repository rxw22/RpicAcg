import React, { useCallback, memo, useLayoutEffect } from "react";
import List from "@/components/ComicsList/";
import BgBox from "@/components/bgBox";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigations/mainStacks/types";
import { useRequest } from "ahooks";
import { useUtilsProvider } from "@/network/utilsProvider";
import AppBar from "./LocalCollectAppBar";

type Props = NativeStackScreenProps<RootStackParamList, "local-collect">;

const LocalCollect: React.FC<Props> = ({ navigation }) => {
  const { localCollectCache } = useUtilsProvider();

  const { data, error, refresh } = useRequest(
    localCollectCache!.getData.bind(localCollectCache),
    {
      onError(e) {
        console.log(e);
      },
    }
  );
  const loadMore = useCallback(() => {}, []);

  const navigate = useCallback((name: string, params: any) => {
    // @ts-ignore
    navigation.navigate(name, params);
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: (props) => (
        <AppBar
          {...props}
          clearAll={() => {
            localCollectCache?.removeAll(() => {
              refresh();
            });
          }}
        />
      ),
    });
  }, []);

  return (
    <BgBox
      style={{ flex: 1, paddingHorizontal: 5 }}
      refresh={refresh}
      error={error?.message}
    >
      <List
        dataSource={data || []}
        navigate={navigate}
        loadMore={loadMore}
        loading={false}
        longPress={(id) => {
          localCollectCache?.remove(id).then(() => {
            refresh();
          });
        }}
      />
    </BgBox>
  );
};

export default memo(LocalCollect);
