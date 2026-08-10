import * as vscode from 'vscode';
import { BadgePanel } from './badgePanel';
import { BadgeSidebarProvider } from './badgeSidebar';

export function activate(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.commands.registerCommand('bobBadge.openPanel', () => {
      BadgePanel.show(context);
    }),
    vscode.window.registerWebviewViewProvider(
      BadgeSidebarProvider.viewId,
      new BadgeSidebarProvider(context),
      { webviewOptions: { retainContextWhenHidden: true } }
    )
  );
}

export function deactivate(): void {}
