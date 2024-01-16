import { useUtilsProvider } from "@/network/utilsProvider";
import { useGlobalStore } from "@/store/globalStore";
import { useRequest } from "ahooks";

const usePunchIn = () => {
  const { httpRequest, Toast } = useUtilsProvider();
  const { setUser } = useGlobalStore();
  
  const { run } = useRequest(httpRequest.punchIn.bind(httpRequest), {
    manual: true,
    onError(e) {
      Toast.show("自动打卡失败", "error");
    },
    onSuccess() {
      Toast.show("自动打卡成功", "success");
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
