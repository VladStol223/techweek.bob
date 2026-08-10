import * as vscode from 'vscode';
import { BadgePanel } from './badgePanel';

export class BadgeSidebarProvider implements vscode.WebviewViewProvider {
  public static readonly viewId = 'bobBadge.sidebarView';
  private _view?: vscode.WebviewView;

  constructor(private readonly context: vscode.ExtensionContext) {}

  resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken,
  ): void {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this.context.extensionUri],
    };

    BadgePanel.resolveInView(webviewView, this.context);
  }
}
