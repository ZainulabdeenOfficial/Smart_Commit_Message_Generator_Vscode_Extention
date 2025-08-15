import * as vscode from 'vscode';
import axios from 'axios';
import { GitService } from './gitService';

export class CommitMessageGenerator {
    private gitService: GitService;

    constructor() {
        this.gitService = new GitService();
    }

    async generateSuggestions(diff: string): Promise<string[]> {
        const config = vscode.workspace.getConfiguration('smartCommit');
        const useAI = config.get<boolean>('useAI', true);
        const suggestionsCount = config.get<number>('suggestions', 3);

        if (useAI) {
            return await this.generateAISuggestions(diff, suggestionsCount);
        } else {
            return await this.generateTemplateSuggestions(diff, suggestionsCount);
        }
    }

    private async generateAISuggestions(diff: string, count: number): Promise<string[]> {
        const config = vscode.workspace.getConfiguration('smartCommit');
        const apiKey = config.get<string>('apiKey', '');
        const usePublicKey = config.get<boolean>('usePublicKey', false);
        const apiEndpoint = config.get<string>('apiEndpoint', 'https://api.openai.com/v1/chat/completions');
        const model = config.get<string>('model', 'gpt-3.5-turbo');

        // Use public key for testing if enabled
        const finalApiKey = usePublicKey ? 'sk-proj-public-key-for-testing' : apiKey;
        
        if (!finalApiKey && !usePublicKey) {
            throw new Error('OpenAI API key not configured. Please set smartCommit.apiKey in settings or enable smartCommit.usePublicKey for testing.');
        }

        const prompt = this.buildAIPrompt(diff);
        
        try {
            const response = await axios.post(apiEndpoint, {
                model: model,
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert at generating high-quality Git commit messages following Conventional Commit format.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: 500,
                temperature: 0.7,
                n: count
            }, {
                headers: {
                    'Authorization': `Bearer ${finalApiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            const suggestions: string[] = [];
            for (const choice of response.data.choices) {
                const message = choice.message.content.trim();
                if (message) {
                    suggestions.push(message);
                }
            }

            return suggestions.slice(0, count);
        } catch (error) {
            console.error('AI API error:', error);
            // Fallback to template generation
            return await this.generateTemplateSuggestions(diff, count);
        }
    }

    private async generateTemplateSuggestions(diff: string, count: number): Promise<string[]> {
        const changedFiles = await this.gitService.getChangedFiles();
        const scope = this.gitService.extractScopeFromFiles(changedFiles);
        const changeType = this.gitService.detectChangeType(diff);

        const suggestions: string[] = [];
        
        // Check for custom templates first
        const customTemplates = vscode.workspace.getConfiguration('smartCommit').get<string[]>('customTemplates', []);
        if (customTemplates.length > 0) {
            for (const template of customTemplates.slice(0, count)) {
                const customizedTemplate = template
                    .replace('{type}', changeType)
                    .replace('{scope}', scope)
                    .replace('{summary}', this.generateRandomSummary(changeType));
                suggestions.push(customizedTemplate);
            }
        }
        
        // Generate different variations based on the change type
        const summaries = this.generateSummaries(diff, changeType);
        
        for (let i = 0; i < Math.min(count - suggestions.length, summaries.length); i++) {
            const summary = summaries[i];
            const message = `${changeType}(${scope}): ${summary}`;
            if (!suggestions.includes(message)) {
                suggestions.push(message);
            }
        }

        // If we need more suggestions, generate variations
        while (suggestions.length < count) {
            const variation = this.generateVariation(changeType, scope, diff);
            if (!suggestions.includes(variation)) {
                suggestions.push(variation);
            }
        }

        return suggestions.slice(0, count);
    }

    private buildAIPrompt(diff: string): string {
        return `Generate a high-quality Git commit message based on the following diff. 
Follow Conventional Commit format: type(scope): short summary

Rules:
- type should be one of: feat, fix, docs, style, refactor, perf, test, chore
- scope should be the feature/module/file affected (keep lowercase, no spaces)
- summary should be concise, imperative, and under 72 characters
- Include a short description in the body (wrap at 100 chars) explaining the change
- Do not include emojis or personal notes

Example format:
feat(auth): add JWT token refresh logic

Implemented automatic token refresh when expired. Updated middleware to handle 401 responses.

Here's the diff:
${diff}

Generate 3 different commit message suggestions:`;
    }

    private generateSummaries(diff: string, changeType: string): string[] {
        const lines = diff.split('\n');
        const fileChanges = new Map<string, number>();
        
        // Analyze file changes
        for (const line of lines) {
            if (line.startsWith('+++')) {
                const file = line.substring(4);
                fileChanges.set(file, (fileChanges.get(file) || 0) + 1);
            }
        }

        const summaries: string[] = [];
        
        // Generate summaries based on change type and files
        if (changeType === 'feat') {
            summaries.push('add new feature');
            summaries.push('implement new functionality');
            summaries.push('add new capability');
        } else if (changeType === 'fix') {
            summaries.push('fix bug');
            summaries.push('resolve issue');
            summaries.push('correct error');
        } else if (changeType === 'refactor') {
            summaries.push('refactor code');
            summaries.push('improve structure');
            summaries.push('clean up code');
        } else if (changeType === 'docs') {
            summaries.push('update documentation');
            summaries.push('improve docs');
            summaries.push('add documentation');
        } else if (changeType === 'test') {
            summaries.push('add tests');
            summaries.push('improve test coverage');
            summaries.push('update test suite');
        } else {
            summaries.push('update code');
            summaries.push('make changes');
            summaries.push('modify files');
        }

        return summaries;
    }

    private generateRandomSummary(changeType: string): string {
        const summaries = this.generateSummaries('', changeType);
        const randomIndex = Math.floor(Math.random() * summaries.length);
        return summaries[randomIndex];
    }

    private generateVariation(changeType: string, scope: string, diff: string): string {
        const variations = [
            `${changeType}(${scope}): update implementation`,
            `${changeType}(${scope}): enhance functionality`,
            `${changeType}(${scope}): improve performance`,
            `${changeType}(${scope}): optimize code`,
            `${changeType}(${scope}): maintain codebase`
        ];

        const randomIndex = Math.floor(Math.random() * variations.length);
        return variations[randomIndex];
    }
} 