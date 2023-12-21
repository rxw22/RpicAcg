import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { Appbar, Searchbar } from "react-native-paper";
import { getHeaderTitle } from "@react-navigation/elements";
import React, { useState } from "react";

const CustomSearchBar: React.FC<NativeStackHeaderProps> = ({
  navigation,
  route,
  options,
  back,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const onChangeSearch = (query: string) => setSearchQuery(query);
  return (
    <Appbar.Header>
      <Searchbar
        placeholder="Search"
        onChangeText={onChangeSearch}
        value={searchQuery}
        icon="arrow-left"
        onIconPress={() => {
          navigation.goBack();
        }}
      />
    </Appbar.Header>
  );
};

export default CustomSearchBar;
