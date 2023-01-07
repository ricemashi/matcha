import * as vscode from "vscode";
import { Storage } from "./Storage";
import { Sidebar } from "./views/Sidebar";

export function activate(ctx: vscode.ExtensionContext) {
  const pingCommand = vscode.commands.registerCommand("ping", () => {
    vscode.window.showInformationMessage("Choo Choo, Matcha is awake!");
  });
  ctx.subscriptions.push(pingCommand);

  const clearHistoryCommand = vscode.commands.registerCommand(
    "clearHistory",
    () => {
      const action = "Reload Window";
      Storage.reset();
      vscode.window
        .showInformationMessage("Beep boop, cleared reading history!", action)
        .then((selectedAction) => {
          if (selectedAction === action) {
            vscode.commands.executeCommand("workbench.action.reloadWindow");
          }
        });
    }
  );
  ctx.subscriptions.push(clearHistoryCommand);

  const sidebarProvider = new Sidebar(ctx.extensionUri);
  ctx.subscriptions.push(
    vscode.window.registerWebviewViewProvider("sidebar", sidebarProvider, {
      webviewOptions: {
        retainContextWhenHidden: true,
      },
    })
  );
}

export function deactivate() {}
