import { useUtilsProvider } from "@/network/utilsProvider";
import { useGlobalStore } from "@/store/globalStore";
import { useRequest } from "ahooks";
import { Toast } from "toastify-react-native";

const usePunchIn = () => {
  const { httpRequest } = useUtilsProvider();
  const { setUser } = useGlobalStore();

  const { run } = useRequest(httpRequest.punchIn.bind(httpRequest), {
    manual: true,
    onError(e) {
      Toast.error("自动打卡失败", "bottom");
    },
    onSuccess() {
      Toast.success("自动打卡成功", "bottom");
    },
  });

  useRequest(httpRequest.fetchUserProfile.bind(httpRequest), {
    onError(e) {
      console.log(e);
    },
    onSuccess(data) {
      setUser(data);
      if (!data.isPunched) {
        run();
      }
    },
  });
};

export default usePunchIn;
