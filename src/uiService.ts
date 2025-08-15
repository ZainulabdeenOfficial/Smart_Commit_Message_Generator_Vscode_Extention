import * as vscode from 'vscode';
import { CommitValidator } from './commitValidator';

export class UIService {
    private statusBarItem: vscode.StatusBarItem | undefined;
    private config: vscode.WorkspaceConfiguration;

    constructor() {
        this.config = vscode.workspace.getConfiguration('smartCommit');
        this.initializeStatusBar();
    }

    private initializeStatusBar(): void {
        if (this.config.get<boolean>('showStatusBar', true)) {
            this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
            this.statusBarItem.name = 'Smart Commits';
            this.statusBarItem.tooltip = 'Smart Commits - Generate AI-powered commit messages';
            this.statusBarItem.command = 'smartCommit.generateMessage';
            this.updateStatusBar();
            this.statusBarItem.show();
        }
    }

    updateStatusBar(): void {
        if (!this.statusBarItem) return;

        const useAI = this.config.get<boolean>('useAI', true);
        const hasApiKey = !!this.config.get<string>('apiKey', '');
        const usePublicKey = this.config.get<boolean>('usePublicKey', false);

        if (useAI && (hasApiKey || usePublicKey)) {
            this.statusBarItem.text = '$(brain) Smart Commits';
            this.statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.prominentBackground');
        } else if (useAI) {
            this.statusBarItem.text = '$(warning) Smart Commits';
            this.statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
        } else {
            this.statusBarItem.text = '$(lightbulb) Smart Commits';
            this.statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.background');
        }
    }

    async showCustomQuickPick(suggestions: string[]): Promise<string | undefined> {
        const items = suggestions.map((suggestion, index) => {
            const lines = suggestion.split('\n');
            const title = lines[0];
            const description = lines.slice(1).join('\n');
            
            return {
                label: `$(lightbulb) ${title}`,
                description: description,
                detail: suggestion,
                iconPath: new vscode.ThemeIcon('lightbulb'),
                buttons: [
                    {
                        iconPath: new vscode.ThemeIcon('edit'),
                        tooltip: 'Edit this suggestion'
                    },
                    {
                        iconPath: new vscode.ThemeIcon('check'),
                        tooltip: 'Use this suggestion'
                    }
                ]
            };
        });

        const selected = await vscode.window.showQuickPick(items, {
            placeHolder: 'Choose a commit message suggestion',
            matchOnDescription: true,
            matchOnDetail: true,
            canPickMany: false
        });

        return selected?.detail;
    }

    async showCustomInputBox(message: string): Promise<string | undefined> {
        const theme = this.config.get<string>('uiTheme', 'auto');
        const isDark = theme === 'dark' || (theme === 'auto' && vscode.window.activeColorTheme.kind === vscode.ColorThemeKind.Dark);

        const input = await vscode.window.showInputBox({
            value: message,
            prompt: 'Edit your commit message',
            placeHolder: 'feat(scope): your commit message',
            validateInput: (value) => {
                const validation = CommitValidator.validate(value);
                if (!validation.isValid) {
                    return {
                        message: validation.error || 'Invalid commit message',
                        severity: vscode.InputBoxValidationSeverity.Error
                    };
                }
                return null;
            },
            ignoreFocusOut: true
        });

        return input;
    }

    async showSettingsUI(): Promise<void> {
        const options = [
            {
                label: '$(gear) API Configuration',
                description: 'Configure OpenAI API settings',
                detail: 'Set API key, model, and endpoint'
            },
            {
                label: '$(brain) AI Mode Settings',
                description: 'Configure AI generation options',
                detail: 'Toggle AI mode, public key, suggestions count'
            },
            {
                label: '$(paintbrush) UI Customization',
                description: 'Customize the user interface',
                detail: 'Theme, status bar, auto-suggestions'
            },
            {
                label: '$(file-text) Custom Templates',
                description: 'Manage custom commit templates',
                detail: 'Add, edit, or remove custom templates'
            }
        ];

        const selected = await vscode.window.showQuickPick(options, {
            placeHolder: 'Choose a settings category',
            canPickMany: false
        });

        if (selected) {
            await this.openSpecificSettings(selected.label);
        }
    }

    private async openSpecificSettings(category: string): Promise<void> {
        if (category.includes('API Configuration')) {
            await vscode.commands.executeCommand('workbench.action.openSettings', 'smartCommit.apiKey');
        } else if (category.includes('AI Mode Settings')) {
            await vscode.commands.executeCommand('workbench.action.openSettings', 'smartCommit.useAI');
        } else if (category.includes('UI Customization')) {
            await vscode.commands.executeCommand('workbench.action.openSettings', 'smartCommit.uiTheme');
        } else if (category.includes('Custom Templates')) {
            await this.showTemplateManager();
        }
    }

    private async showTemplateManager(): Promise<void> {
        const templates = this.config.get<string[]>('customTemplates', []);
        
        const options: Array<{
            label: string;
            description: string;
            detail: string;
            template?: string;
            index?: number;
        }> = [
            {
                label: '$(add) Add New Template',
                description: 'Create a new custom template',
                detail: 'Add a new commit message template'
            },
            ...templates.map((template, index) => ({
                label: `$(file-text) Template ${index + 1}`,
                description: template,
                detail: 'Click to edit or delete',
                template: template,
                index: index
            }))
        ];

        const selected = await vscode.window.showQuickPick(options, {
            placeHolder: 'Manage custom templates',
            canPickMany: false
        });

        if (selected) {
            if (selected.label.includes('Add New Template')) {
                await this.addNewTemplate();
            } else if (selected.index !== undefined && selected.template) {
                await this.editTemplate(selected.index, selected.template);
            }
        }
    }

    private async addNewTemplate(): Promise<void> {
        const template = await vscode.window.showInputBox({
            prompt: 'Enter a new commit message template',
            placeHolder: 'feat(scope): template message',
            validateInput: (value) => {
                if (!value || value.trim().length === 0) {
                    return 'Template cannot be empty';
                }
                return null;
            }
        });

        if (template) {
            const templates = this.config.get<string[]>('customTemplates', []);
            templates.push(template);
            await this.config.update('customTemplates', templates, vscode.ConfigurationTarget.Workspace);
            vscode.window.showInformationMessage('Template added successfully!');
        }
    }

    private async editTemplate(index: number, template: string): Promise<void> {
        const actions = [
            {
                label: '$(edit) Edit Template',
                description: 'Modify this template'
            },
            {
                label: '$(trash) Delete Template',
                description: 'Remove this template'
            }
        ];

        const action = await vscode.window.showQuickPick(actions, {
            placeHolder: 'Choose an action'
        });

        if (action) {
            if (action.label.includes('Edit')) {
                const newTemplate = await vscode.window.showInputBox({
                    value: template,
                    prompt: 'Edit the template',
                    placeHolder: 'feat(scope): template message'
                });

                if (newTemplate) {
                    const templates = this.config.get<string[]>('customTemplates', []);
                    templates[index] = newTemplate;
                    await this.config.update('customTemplates', templates, vscode.ConfigurationTarget.Workspace);
                    vscode.window.showInformationMessage('Template updated successfully!');
                }
            } else if (action.label.includes('Delete')) {
                const templates = this.config.get<string[]>('customTemplates', []);
                templates.splice(index, 1);
                await this.config.update('customTemplates', templates, vscode.ConfigurationTarget.Workspace);
                vscode.window.showInformationMessage('Template deleted successfully!');
            }
        }
    }

    showNotification(message: string, type: 'info' | 'warning' | 'error' = 'info'): void {
        switch (type) {
            case 'info':
                vscode.window.showInformationMessage(`Smart Commits: ${message}`);
                break;
            case 'warning':
                vscode.window.showWarningMessage(`Smart Commits: ${message}`);
                break;
            case 'error':
                vscode.window.showErrorMessage(`Smart Commits: ${message}`);
                break;
        }
    }

    async showProgress<T>(title: string, task: () => Promise<T>): Promise<T> {
        return await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: title,
            cancellable: false
        }, async (progress) => {
            progress.report({ increment: 0 });
            const result = await task();
            progress.report({ increment: 100 });
            return result;
        });
    }

    dispose(): void {
        if (this.statusBarItem) {
            this.statusBarItem.dispose();
        }
    }
} 