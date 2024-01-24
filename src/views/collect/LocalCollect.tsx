import React, { useCallback, memo } from "react";
import List from "@/components/ComicsList/";
import BgBox from "@/components/bgBox";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigations/mainStacks/types";
import { useReadStore } from "@/store/readStore";

type Props = NativeStackScreenProps<RootStackParamList, "local-collect">;

const LocalCollect: React.FC<Props> = ({ navigation }) => {
  const { localCollect } = useReadStore();

  const loadMore = useCallback(() => {}, []);

  const navigate = useCallback((name: string, params: any) => {
    // @ts-ignore
    navigation.navigate(name, params);
  }, []);

  return (
    <BgBox style={{ flex: 1, paddingHorizontal: 5 }}>
      <List
        dataSource={localCollect}
        navigate={navigate}
        loadMore={loadMore}
        loading={false}
      />
    </BgBox>
  );
};

export default memo(LocalCollect);
