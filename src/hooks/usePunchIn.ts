import { useEffect, useState } from "react";

import usePicaHttp from "@/services/http";
import { PunchInResponse } from "@/services/types";

const usePunchIn = () => {
  const { punchIn } = usePicaHttp();
  const [result, setResult] = useState<PunchInResponse>();
  const start = async () => {
    try {
      const result = await punchIn();
      setResult(result);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    start();
    console.log(1111);
  }, []);

  return { result };
};

export default usePunchIn;
