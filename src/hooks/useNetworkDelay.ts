import React, { useCallback, useMemo, useRef, useState } from "react";
import { useRequest } from "ahooks";
import HttpRequest from "@/network/httpRequest";
import { AppChannel } from "@/store/appConfigStore";

// 这个待我后续改
export const useNetworkDelay = () => {
  const netInfo = useRef({
    分流一: {
      startTime: 0,
      endTime: 0,
      total: "",
    },
    分流二: {
      startTime: 0,
      endTime: 0,
      total: "",
    },
    分流三: {
      startTime: 0,
      endTime: 0,
      total: "",
    },
  });

  const [netState, setNetState] = useState({
    分流一: "0ms",
    分流二: "0ms",
    分流三: "0ms",
  });

  const httpRequest1 = useMemo(
    () =>
      new HttpRequest({
        headers: {
          "app-channel": AppChannel.分流一,
        },
      }),
    []
  );
  const httpRequest2 = useMemo(
    () =>
      new HttpRequest({
        headers: {
          "app-channel": AppChannel.分流二,
        },
      }),
    []
  );
  const httpRequest3 = useMemo(
    () =>
      new HttpRequest({
        headers: {
          "app-channel": AppChannel.分流三,
        },
      }),
    []
  );

  const { run: run1 } = useRequest(httpRequest1.getDelay.bind(httpRequest1), {
    manual: true,
    onBefore() {
      netInfo.current.分流一.startTime = Date.now();
    },
    onSuccess() {
      netInfo.current.分流一.endTime = Date.now();
    },
    onError() {
      netInfo.current.分流一.total = "error";
    },
    onFinally() {
      if (netInfo.current.分流一.total !== "error") {
        setNetState({
          ...netState,
          分流一:
            netInfo.current.分流一.endTime -
            netInfo.current.分流一.startTime +
            "ms",
        });
      } else {
        setNetState({
          ...netState,
          分流一: "失败",
        });
      }
    },
  });

  const { run: run2 } = useRequest(httpRequest2.getDelay.bind(httpRequest2), {
    manual: true,
    onBefore() {
      netInfo.current.分流二.startTime = Date.now();
    },
    onSuccess() {
      netInfo.current.分流二.endTime = Date.now();
    },
    onError() {
      netInfo.current.分流二.total = "error";
    },
    onFinally() {
      if (netInfo.current.分流二.total !== "error") {
        setNetState({
          ...netState,
          分流二:
            netInfo.current.分流二.endTime -
            netInfo.current.分流二.startTime +
            "ms",
        });
      } else {
        setNetState({
          ...netState,
          分流二: "失败",
        });
      }
    },
  });

  const { run: run3 } = useRequest(httpRequest3.getDelay.bind(httpRequest3), {
    manual: true,
    onBefore() {
      netInfo.current.分流三.startTime = Date.now();
    },
    onSuccess() {
      netInfo.current.分流三.endTime = Date.now();
    },
    onError() {
      netInfo.current.分流三.total = "error";
    },
    onFinally() {
      if (netInfo.current.分流三.total !== "error") {
        setNetState({
          ...netState,
          分流三:
            netInfo.current.分流三.endTime -
            netInfo.current.分流三.startTime +
            "ms",
        });
      } else {
        setNetState({
          ...netState,
          分流三: "失败",
        });
      }
    },
  });

  const start = useCallback(() => {
    setNetState({
      分流一: "0ms",
      分流二: "0ms",
      分流三: "0ms",
    });
    run1();
    run2();
    run3();
  }, []);

  return {
    start,
    netState,
  };
};
