import * as vscode from 'vscode';
import { GitService } from './gitService';
import { CommitMessageGenerator } from './commitMessageGenerator';
import { CommitValidator } from './commitValidator';
import { UIService } from './uiService';

export function activate(context: vscode.ExtensionContext) {
    const gitService = new GitService();
    const commitGenerator = new CommitMessageGenerator();
    const commitValidator = new CommitValidator();
    const uiService = new UIService();

    // Register command: Generate Smart Commit Message
    const generateMessageCommand = vscode.commands.registerCommand('smartCommit.generateMessage', async () => {
        try {
            const diff = await gitService.getStagedDiff();
            if (!diff) {
                uiService.showNotification('No staged changes found. Please stage your changes first.', 'warning');
                return;
            }

            const suggestions = await uiService.showProgress<string[]>(
                'Generating commit message suggestions...',
                () => commitGenerator.generateSuggestions(diff)
            );

            if (suggestions.length === 0) {
                uiService.showNotification('Failed to generate commit message suggestions.', 'error');
                return;
            }

            const selectedMessage = await uiService.showCustomQuickPick(suggestions);
            if (selectedMessage) {
                await showCommitInput(selectedMessage, uiService);
            }
        } catch (error) {
            uiService.showNotification(`Error generating commit message: ${error}`, 'error');
        }
    });

    // Register command: Generate and Commit
    const commitCommand = vscode.commands.registerCommand('smartCommit.commit', async () => {
        try {
            const diff = await gitService.getStagedDiff();
            if (!diff) {
                uiService.showNotification('No staged changes found. Please stage your changes first.', 'warning');
                return;
            }

            const suggestions = await uiService.showProgress<string[]>(
                'Generating commit message suggestions...',
                () => commitGenerator.generateSuggestions(diff)
            );

            if (suggestions.length === 0) {
                uiService.showNotification('Failed to generate commit message suggestions.', 'error');
                return;
            }

            const selectedMessage = await uiService.showCustomQuickPick(suggestions);
            if (selectedMessage) {
                await executeCommit(selectedMessage, uiService);
            }
        } catch (error) {
            uiService.showNotification(`Error committing: ${error}`, 'error');
        }
    });

    // Register command: Open Settings UI
    const openSettingsCommand = vscode.commands.registerCommand('smartCommit.openSettings', async () => {
        await uiService.showSettingsUI();
    });

    // Register command: Toggle AI Mode
    const toggleAICommand = vscode.commands.registerCommand('smartCommit.toggleAI', async () => {
        const config = vscode.workspace.getConfiguration('smartCommit');
        const currentUseAI = config.get<boolean>('useAI', true);
        await config.update('useAI', !currentUseAI, vscode.ConfigurationTarget.Workspace);
        
        uiService.updateStatusBar();
        uiService.showNotification(
            `AI mode ${!currentUseAI ? 'enabled' : 'disabled'}`,
            'info'
        );
    });

    // Auto-suggest when files are staged
    const autoSuggest = vscode.workspace.getConfiguration('smartCommit').get<boolean>('autoSuggest', true);
    if (autoSuggest) {
        const fileSystemWatcher = vscode.workspace.createFileSystemWatcher('**/*');
        fileSystemWatcher.onDidChange(async (uri) => {
            // Check if files were staged and suggest commit messages
            const hasStagedChanges = await gitService.hasStagedChanges();
            if (hasStagedChanges) {
                // Show a subtle notification
                uiService.showNotification('Files staged! Use Smart Commits to generate a commit message.', 'info');
            }
        });
        context.subscriptions.push(fileSystemWatcher);
    }

    context.subscriptions.push(
        generateMessageCommand, 
        commitCommand, 
        openSettingsCommand, 
        toggleAICommand,
        uiService
    );
}

async function showCommitInput(message: string, uiService: UIService): Promise<void> {
    const input = await uiService.showCustomInputBox(message);
    if (input) {
        await executeCommit(input, uiService);
    }
}

async function executeCommit(message: string, uiService: UIService): Promise<void> {
    try {
        const terminal = vscode.window.createTerminal('Smart Commits');
        terminal.sendText(`git commit -m "${message.replace(/"/g, '\\"')}"`);
        terminal.show();
        
        uiService.showNotification('Commit executed successfully!', 'info');
    } catch (error) {
        uiService.showNotification(`Failed to execute commit: ${error}`, 'error');
    }
}

export function deactivate() {} 