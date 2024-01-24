import React, { useCallback, memo } from "react";
import List from "@/components/ComicsList/";
import BgBox from "@/components/bgBox";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigations/mainStacks/types";
import { useReadStore } from "@/store/readStore";

type Props = NativeStackScreenProps<RootStackParamList, "history">;

const BrowsingHistory: React.FC<Props> = ({ navigation }) => {
  const { browses } = useReadStore();

  const loadMore = useCallback(() => {}, []);

  const navigate = useCallback((name: string, params: any) => {
    // @ts-ignore
    navigation.navigate(name, params);
  }, []);

  return (
    <BgBox style={{ flex: 1, paddingHorizontal: 5 }}>
      <List
        dataSource={browses}
        navigate={navigate}
        loadMore={loadMore}
        loading={false}
      />
    </BgBox>
  );
};

export default memo(BrowsingHistory);
