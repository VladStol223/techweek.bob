import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

// ── Panel ─────────────────────────────────────────────────────────────────────

// A minimal common interface for both WebviewPanel and WebviewView
interface WebviewHost {
  webview: vscode.Webview;
  onDidDispose?: (fn: () => void) => void;
}

export class BadgePanel {
  private static current: BadgePanel | undefined;
  private readonly host: WebviewHost;
  private readonly context: vscode.ExtensionContext;

  private constructor(host: WebviewHost, context: vscode.ExtensionContext) {
    this.host = host;
    this.context = context;

    this.host.webview.html = this.loadingHtml();
    this.host.onDidDispose?.(() => { BadgePanel.current = undefined; });
    this.host.webview.onDidReceiveMessage((msg: { command: string }) => this.handleMessage(msg));

    this.refresh();
  }

  static show(context: vscode.ExtensionContext): void {
    if (BadgePanel.current) {
      if ('reveal' in BadgePanel.current.host) {
        (BadgePanel.current.host as vscode.WebviewPanel).reveal();
      }
      return;
    }
    const panel = vscode.window.createWebviewPanel(
      'bobBadgePanel',
      'IBM Bob · Badge Issuer',
      vscode.ViewColumn.One,
      { enableScripts: true, retainContextWhenHidden: true }
    );
    BadgePanel.current = new BadgePanel(panel, context);
  }

  static resolveInView(view: vscode.WebviewView, context: vscode.ExtensionContext): void {
    // Sidebar view — always create a fresh instance (no singleton needed)
    new BadgePanel(view, context);
  }

  // ── Init ─────────────────────────────────────────────────────────────────

  private async refresh(): Promise<void> {
    const installed = this.isInstalled();
    this.host.webview.html = this.buildHtml(installed);
  }

  // ── Message handling ─────────────────────────────────────────────────────

  private async handleMessage(msg: { command: string }): Promise<void> {
    if (msg.command === 'install') {
      await this.install();
    } else if (msg.command === 'uninstall') {
      await this.uninstall();
    } else if (msg.command === 'refresh') {
      await this.refresh();
    }
  }

  // ── Install ───────────────────────────────────────────────────────────────

  private async install(): Promise<void> {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
      vscode.window.showErrorMessage('Open a workspace folder first.');
      return;
    }

    // Prompt for issuer service credentials before touching the filesystem
    const issuerUrl = await vscode.window.showInputBox({
      title: 'Badge Issuer Service URL',
      prompt: 'Enter the URL of the IBM Badge Issuer service',
      value: 'https://badge-issuer.ce.techzone.ibm.com/',
      ignoreFocusOut: true,
      validateInput: v => v.trim() ? undefined : 'URL is required',
    });
    if (issuerUrl === undefined) { return; } // user cancelled

    const issuerApiKey = await vscode.window.showInputBox({
      title: 'Badge Issuer API Key',
      prompt: 'Enter the API key for the IBM Badge Issuer service',
      password: true,
      ignoreFocusOut: true,
      validateInput: v => v.trim() ? undefined : 'API key is required',
    });
    if (issuerApiKey === undefined) { return; } // user cancelled

    const root = workspaceFolder.uri.fsPath;
    const bobDir = path.join(root, '.bob');
    const skillDir = path.join(bobDir, 'skills', 'badge-issuer-lite');

    try {
      fs.mkdirSync(skillDir, { recursive: true });

      // Copy SKILL.md
      const skillSrc = this.context.asAbsolutePath(path.join('assets', 'bob', 'SKILL.md'));
      fs.copyFileSync(skillSrc, path.join(skillDir, 'SKILL.md'));

      // Copy bob_badge.py script
      const scriptSrc = this.context.asAbsolutePath(path.join('assets', 'bob', 'bob_badge.py'));
      fs.copyFileSync(scriptSrc, path.join(skillDir, 'bob_badge.py'));

      // Write issuer service credentials (user-provided)
      const envDest = path.join(root, 'badge-issuer', '.env.badge-issuer');
      fs.mkdirSync(path.dirname(envDest), { recursive: true });
      fs.writeFileSync(envDest,
        '# Credentials written by bob-badge-ext at install time.\n' +
        '# DO NOT commit this file. Add badge-issuer/.env.badge-issuer to .gitignore.\n' +
        `ISSUER_SERVICE_URL=${issuerUrl.trim()}\n` +
        `ISSUER_SERVICE_API_KEY=${issuerApiKey.trim()}\n`,
        'utf8'
      );

      // Merge custom_modes.yaml
      const modesSrc = this.context.asAbsolutePath(path.join('assets', 'bob', 'custom_modes.yaml'));
      const modesDest = path.join(bobDir, 'custom_modes.yaml');
      this.mergeModes(modesSrc, modesDest);

      // Copy participant badge guide to workspace root
      const guideSrc = this.context.asAbsolutePath(path.join('assets', 'bob', 'BADGE_GUIDE.md'));
      fs.copyFileSync(guideSrc, path.join(root, 'BADGE_GUIDE.md'));

      await this.refresh();
      vscode.window.showInformationMessage('✅ Bob Badge Issuer mode installed in .bob/');
    } catch (err) {
      vscode.window.showErrorMessage(`Install failed: ${String(err)}`);
    }
  }

  // ── Uninstall ─────────────────────────────────────────────────────────────

  private async uninstall(): Promise<void> {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) { return; }

    const confirmed = await vscode.window.showWarningMessage(
      'Remove Bob Badge Issuer (skill and credentials) from this workspace?',
      { modal: true },
      'Remove'
    );
    if (confirmed !== 'Remove') { return; }

    const root = workspaceFolder.uri.fsPath;
    const skillDir = path.join(root, '.bob', 'skills', 'badge-issuer-lite');
    const modesFile = path.join(root, '.bob', 'custom_modes.yaml');

    try {
      // Remove skill directory
      if (fs.existsSync(skillDir)) {
        fs.rmSync(skillDir, { recursive: true, force: true });
      }

      // Remove badge-issuer-lite block from custom_modes.yaml
      if (fs.existsSync(modesFile)) {
        let content = fs.readFileSync(modesFile, 'utf8');
        content = this.removeModeBlock(content, 'badge-issuer-lite');
        if (content.trim() === 'customModes:' || content.trim() === '') {
          fs.rmSync(modesFile);
        } else {
          fs.writeFileSync(modesFile, content, 'utf8');
        }
      }

      // Remove badge-issuer credentials dir
      const badgeIssuerDir = path.join(root, 'badge-issuer');
      if (fs.existsSync(badgeIssuerDir)) {
        fs.rmSync(badgeIssuerDir, { recursive: true, force: true });
      }

      // Remove badge guide
      const guideFile = path.join(root, 'BADGE_GUIDE.md');
      if (fs.existsSync(guideFile)) {
        fs.rmSync(guideFile);
      }

      await this.refresh();
      vscode.window.showInformationMessage('🗑️ Bob Badge Issuer removed from workspace.');
    } catch (err) {
      vscode.window.showErrorMessage(`Uninstall failed: ${String(err)}`);
    }
  }

  private removeModeBlock(content: string, slug: string): string {
    // Split into lines and remove the block belonging to this slug
    const lines = content.split('\n');
    const result: string[] = [];
    let skipping = false;
    let indentDepth = -1;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!skipping && line.includes(`slug: ${slug}`)) {
        // Walk back to remove the preceding `- slug:` starter line
        while (result.length > 0 && result[result.length - 1].trimStart().startsWith('- slug:')) {
          result.pop();
        }
        // Also remove the blank line before the block if present
        if (result.length > 0 && result[result.length - 1].trim() === '') {
          result.pop();
        }
        skipping = true;
        indentDepth = line.search(/\S/);
        continue;
      }
      if (skipping) {
        const currentIndent = line.search(/\S/);
        // Stop skipping when we hit a new top-level list item or same/lower indent non-empty line
        if (line.trim() !== '' && currentIndent <= indentDepth && line.trimStart().startsWith('- ')) {
          skipping = false;
        } else if (line.trim() !== '' && currentIndent < indentDepth) {
          skipping = false;
        } else {
          continue;
        }
      }
      result.push(line);
    }
    return result.join('\n');
  }

  // ── Mode merge ────────────────────────────────────────────────────────────

  private mergeModes(srcPath: string, destPath: string): void {
    const srcContent = fs.readFileSync(srcPath, 'utf8');

    if (!fs.existsSync(destPath)) {
      fs.writeFileSync(destPath, srcContent, 'utf8');
      return;
    }

    const existing = fs.readFileSync(destPath, 'utf8');
    if (existing.includes('slug: badge-issuer-lite')) {
      return; // already present
    }

    // Append the mode block (skip the "customModes:" header line if dest already has it)
    const toAppend = existing.includes('customModes:')
      ? srcContent.replace(/^customModes:\n/, '')
      : srcContent;

    fs.appendFileSync(destPath, '\n' + toAppend, 'utf8');
  }

  // ── Badge fetching ────────────────────────────────────────────────────────

  private isInstalled(): boolean {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) { return false; }
    const skillPath = path.join(
      workspaceFolder.uri.fsPath, '.bob', 'skills', 'badge-issuer-lite', 'SKILL.md'
    );
    return fs.existsSync(skillPath);
  }

  // ── HTML ──────────────────────────────────────────────────────────────────

  private loadingHtml(): string {
    return this.shell('<p style="color:var(--vscode-descriptionForeground)">Loading…</p>');
  }

  private installingHtml(): string {
    return this.shell(`
      <div style="display:flex;align-items:center;gap:10px;color:var(--vscode-descriptionForeground)">
        <span class="spinner"></span>
        <span>Installing… this may take a few seconds</span>
      </div>
      <style>
        .spinner {
          width: 16px; height: 16px; border-radius: 50%;
          border: 2px solid var(--vscode-descriptionForeground);
          border-top-color: var(--vscode-button-background);
          animation: spin 0.8s linear infinite;
          flex-shrink: 0;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      </style>
    `);
  }

  private buildHtml(installed: boolean): string {
    const installSection = installed
      ? `<div class="status installed">
           <span class="dot"></span><span class="status-label">Badge Issuer Lite mode is installed</span>
           <div class="btn-group">
             <button class="btn-sm" onclick="send('refresh')">↻ Refresh</button>
             <button class="btn-sm btn-sm-danger" onclick="send('uninstall')">✕ Remove</button>
           </div>
         </div>`
      : `<div class="status not-installed">
           <span class="dot"></span><span class="status-label">Badge Issuer Lite mode is <strong>not installed</strong> in this workspace</span>
           <div class="btn-group">
             <button class="btn-sm" id="btn-install" onclick="this.disabled=true;this.textContent='Installing…';send('install')">Install</button>
           </div>
         </div>`;

    return this.shell(`
      <h1>IBM Bob · Badge Issuer</h1>

      <div class="instructions">
        <p>Lab instructors should use this extension to add the Bob Badge Issuer mode to a lab repo. Once installed, participants can open the repo in IBM Bob, switch to <strong>Badge Issuer Lite</strong> mode, and claim a badge upon completing the bobathon.</p>
        <ol>
          <li>Open your lab repo in IBM Bob</li>
          <li>Click <strong>Install</strong> below to add the mode and skill to <code>.bob/</code></li>
          <li>Commit and push the <code>.bob/</code> folder — this includes the skill, mode, and <code>BADGE_GUIDE.md</code> for participants</li>
          <li>Participants clone the repo — the Badge Issuer Lite mode and guide are available automatically</li>
        </ol>
      </div>

      <hr/>
      ${installSection}
    `);
  }

  private shell(body: string): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline';"/>
<style>
  body { font-family: var(--vscode-font-family); font-size: var(--vscode-font-size); color: var(--vscode-foreground); background: var(--vscode-editor-background); padding: 24px; max-width: 740px; }
  h1 { font-size: 1.3em; font-weight: 600; margin-bottom: 16px; }
  hr { border: none; border-top: 1px solid var(--vscode-panel-border); margin: 20px 0; }
  .status { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; padding: 10px 14px; border-radius: 4px; font-size: 0.9em; margin-bottom: 14px; }
  .status.installed { background: var(--vscode-diffEditor-insertedTextBackground, #1a3a1a); }
  .status.not-installed { background: var(--vscode-inputValidation-warningBackground, #3a2a00); }
  .status-label { flex: 1; min-width: 0; }
  .dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; flex-shrink: 0; }
  .installed .dot { background: #4caf50; }
  .not-installed .dot { background: #f0a500; }
  .btn { display: inline-block; padding: 8px 18px; background: var(--vscode-button-background); color: var(--vscode-button-foreground); border: none; border-radius: 4px; cursor: pointer; font-size: 0.9em; font-family: inherit; }
  .btn:hover { background: var(--vscode-button-hoverBackground); }
  .btn-sm { padding: 3px 10px; background: var(--vscode-button-secondaryBackground); color: var(--vscode-button-secondaryForeground); border: none; border-radius: 3px; cursor: pointer; font-size: 0.8em; font-family: inherit; white-space: nowrap; }
  .btn-sm:hover { background: var(--vscode-button-secondaryHoverBackground); }
  .btn-group { display: flex; gap: 6px; flex-shrink: 0; }
  .error { color: var(--vscode-errorForeground); font-size: 0.88em; }
  code { font-family: monospace; background: var(--vscode-textCodeBlock-background); padding: 1px 4px; border-radius: 3px; }
  .instructions { background: var(--vscode-textBlockQuote-background, #1e1e2e); border-left: 3px solid var(--vscode-activityBarBadge-background, #3b82d4); border-radius: 0 4px 4px 0; padding: 12px 16px; font-size: 0.88em; line-height: 1.6; }
  .instructions p { margin: 0 0 8px; }
  .instructions ol { margin: 0; padding-left: 20px; }
  .instructions li { margin-bottom: 4px; }
  .btn-sm-danger { color: var(--vscode-errorForeground); background: transparent; border: 1px solid var(--vscode-errorForeground); opacity: 0.75; }
  .btn-sm-danger:hover { opacity: 1; background: var(--vscode-inputValidation-errorBackground); }
</style>
</head>
<body>
${body}
<script>
  const vscode = acquireVsCodeApi();
  function send(command) { vscode.postMessage({ command }); }
</script>
</body>
</html>`;
  }

  private esc(str: string): string {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
}
