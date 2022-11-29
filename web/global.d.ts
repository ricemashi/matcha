import * as _vscode from "vscode";

declare global {
  const tsvscode: {
    getState: () => any;
    setState: (param: any) => void;
    postMessage: ({ type: string, data: any }) => void;
  };
  const SE: {
    init: (options: Object) => void;
    authenticate: (options: Object) => void;
  };
}
