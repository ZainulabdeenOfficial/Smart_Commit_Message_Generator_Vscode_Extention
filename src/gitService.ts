import * as vscode from 'vscode';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class GitService {
    private workspaceRoot: string;

    constructor() {
        this.workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '';
    }

    async getStagedDiff(): Promise<string | null> {
        try {
            const { stdout } = await execAsync('git diff --staged', {
                cwd: this.workspaceRoot
            });
            return stdout.trim() || null;
        } catch (error) {
            console.error('Error getting staged diff:', error);
            return null;
        }
    }

    async getUnstagedDiff(): Promise<string | null> {
        try {
            const { stdout } = await execAsync('git diff', {
                cwd: this.workspaceRoot
            });
            return stdout.trim() || null;
        } catch (error) {
            console.error('Error getting unstaged diff:', error);
            return null;
        }
    }

    async getChangedFiles(): Promise<string[]> {
        try {
            const { stdout } = await execAsync('git diff --name-only --staged', {
                cwd: this.workspaceRoot
            });
            return stdout.split('\n').filter(file => file.trim());
        } catch (error) {
            console.error('Error getting changed files:', error);
            return [];
        }
    }

    async isGitRepository(): Promise<boolean> {
        try {
            await execAsync('git rev-parse --git-dir', {
                cwd: this.workspaceRoot
            });
            return true;
        } catch {
            return false;
        }
    }

    async hasStagedChanges(): Promise<boolean> {
        const diff = await this.getStagedDiff();
        return !!diff;
    }

    extractScopeFromFiles(files: string[]): string {
        if (files.length === 0) return 'general';

        // Group files by directory
        const directories = new Map<string, number>();
        
        files.forEach(file => {
            const dir = file.split('/')[0];
            directories.set(dir, (directories.get(dir) || 0) + 1);
        });

        // Find the most common directory
        let mostCommonDir = 'general';
        let maxCount = 0;

        for (const [dir, count] of directories) {
            if (count > maxCount) {
                mostCommonDir = dir;
                maxCount = count;
            }
        }

        // Clean up the scope name
        return mostCommonDir
            .replace(/[^a-zA-Z0-9]/g, '')
            .toLowerCase()
            .substring(0, 20);
    }

    detectChangeType(diff: string): string {
        const lines = diff.split('\n');
        
        // Count additions and deletions
        let additions = 0;
        let deletions = 0;
        
        for (const line of lines) {
            if (line.startsWith('+') && !line.startsWith('+++')) {
                additions++;
            } else if (line.startsWith('-') && !line.startsWith('---')) {
                deletions++;
            }
        }

        // Determine change type based on patterns
        if (additions > deletions * 2) {
            return 'feat';
        } else if (deletions > additions * 2) {
            return 'refactor';
        } else if (diff.includes('test') || diff.includes('spec')) {
            return 'test';
        } else if (diff.includes('fix') || diff.includes('bug')) {
            return 'fix';
        } else if (diff.includes('doc') || diff.includes('readme')) {
            return 'docs';
        } else {
            return 'refactor';
        }
    }
} 