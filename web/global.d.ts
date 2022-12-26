import * as _vscode from "vscode";

declare global {
  const tsvscode: {
    getState: () => any;
    setState: (param: any) => void;
    postMessage: (msg: Payload) => void;
  };
  const SE: {
    init: (options: Object) => void;
    authenticate: (options: Object) => void;
  };
}

interface Payload {
  type: "default" | "manga" | "anime";
  data: {
    command: string;
    [x: string | number | symbol]: unknown;
  };
}
