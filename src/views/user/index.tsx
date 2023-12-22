import { StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { useRequest } from 'ahooks';

import BgBox from "@/components/bgBox";
import { useNetworkProvider } from '@/network/networkProvider';

export default function User() {
  const { httpRequest } = useNetworkProvider();

  const { data, loading, refresh } = useRequest(httpRequest.fetchUserProfile.bind(httpRequest), {
    onError(e){
      console.log(e);
    }
  })

  return (
    <BgBox style={styles.container}>
      <Text variant="headlineMedium">{JSON.stringify(data)}</Text>
    </BgBox>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
