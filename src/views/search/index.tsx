import { StyleSheet, View } from "react-native";
import { Text, Chip, Appbar, Searchbar, FAB } from "react-native-paper";
import { useRequest } from "ahooks";

import BgBox from "@/components/bgBox";
import { useUtilsProvider } from "@/network/utilsProvider";
import React, { useEffect, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigations/mainStacks/types";
import { useGlobalStore } from "@/store/globalStore";

type Props = NativeStackScreenProps<RootStackParamList, "search">;

const Search: React.FC<Props> = ({ navigation }) => {
  const { httpRequest } = useUtilsProvider();
  const { keywords, setKeywords } = useGlobalStore();
  const [searchQuery, setSearchQuery] = useState("");
  const onChangeSearch = (query: string) => setSearchQuery(query);

  const { data, refresh, loading, error, run } = useRequest(
    httpRequest.fetchKeywords.bind(httpRequest),
    {
      manual: true,
      onError(e) {
        console.log(e);
      },
      onSuccess(result) {
        setKeywords(result);
      },
    }
  );

  useEffect(() => {
    if (!keywords) {
      run();
    }
  }, [keywords]);

  useEffect(() => {
    navigation.setOptions({
      header: () => {
        return (
          <Appbar.Header>
            <Searchbar
              placeholder="搜索"
              onChangeText={onChangeSearch}
              value={searchQuery}
              icon="arrow-left"
              onSubmitEditing={() => {
                navigation.navigate("searchcomics", {
                  keyword: searchQuery,
                });
              }}
              onIconPress={() => {
                navigation.goBack();
              }}
            />
          </Appbar.Header>
        );
      },
    });
  }, [searchQuery]);

  return (
    <BgBox
      style={styles.container}
      loading={loading}
      error={error?.message}
      refresh={refresh}
    >
      <View style={styles.keyWarpper}>
        <View style={{ paddingBottom: 8 }}>
          <Text variant="titleLarge">大家都在搜</Text>
        </View>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {(data || keywords)?.map((item) => {
            return (
              <Chip
                key={item}
                style={{ margin: 3 }}
                onPress={() => {
                  setSearchQuery(item);
                  navigation.navigate("searchcomics", {
                    keyword: item,
                  });
                }}
              >
                {item}
              </Chip>
            );
          })}
        </View>
      </View>
      <FAB
        icon="cloud-search"
        style={styles.fab}
        onPress={() => {
          navigation.navigate("searchcomics", {
            keyword: searchQuery,
          });
        }}
        size="medium"
      />
    </BgBox>
  );
};

export default React.memo(Search);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 8,
  },
  keyWarpper: {
    padding: 10,
  },
  fab: {
    position: "absolute",
    bottom: 15,
    right: 15,
  },
});
