export interface ValidationResult {
    isValid: boolean;
    error?: string;
}

export class CommitValidator {
    private static readonly VALID_TYPES = ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'chore'];
    private static readonly MAX_SUMMARY_LENGTH = 72;
    private static readonly MAX_BODY_LINE_LENGTH = 100;

    static validate(message: string): ValidationResult {
        const lines = message.split('\n');
        const firstLine = lines[0].trim();

        // Check if message is empty
        if (!firstLine) {
            return {
                isValid: false,
                error: 'Commit message cannot be empty'
            };
        }

        // Check if first line follows conventional commit format
        const conventionalCommitRegex = /^(feat|fix|docs|style|refactor|perf|test|chore)(\([a-z0-9-]+\))?:\s+.+$/;
        
        if (!conventionalCommitRegex.test(firstLine)) {
            return {
                isValid: false,
                error: 'First line must follow Conventional Commit format: type(scope): summary'
            };
        }

        // Extract type and scope
        const match = firstLine.match(/^(feat|fix|docs|style|refactor|perf|test|chore)(\([a-z0-9-]+\))?:\s+(.+)$/);
        if (!match) {
            return {
                isValid: false,
                error: 'Invalid commit message format'
            };
        }

        const [, type, scope, summary] = match;

        // Validate type
        if (!this.VALID_TYPES.includes(type)) {
            return {
                isValid: false,
                error: `Invalid type: ${type}. Must be one of: ${this.VALID_TYPES.join(', ')}`
            };
        }

        // Validate scope (if present)
        if (scope) {
            const scopeContent = scope.slice(1, -1); // Remove parentheses
            if (!/^[a-z0-9-]+$/.test(scopeContent)) {
                return {
                    isValid: false,
                    error: 'Scope must contain only lowercase letters, numbers, and hyphens'
                };
            }
        }

        // Validate summary length
        if (summary.length > this.MAX_SUMMARY_LENGTH) {
            return {
                isValid: false,
                error: `Summary is too long (${summary.length} chars). Maximum is ${this.MAX_SUMMARY_LENGTH} characters`
            };
        }

        // Check for trailing period in summary
        if (summary.endsWith('.')) {
            return {
                isValid: false,
                error: 'Summary should not end with a period'
            };
        }

        // Validate body lines (if present)
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            
            // Skip empty lines
            if (!line) continue;
            
            // Check body line length
            if (line.length > this.MAX_BODY_LINE_LENGTH) {
                return {
                    isValid: false,
                    error: `Body line ${i + 1} is too long (${line.length} chars). Maximum is ${this.MAX_BODY_LINE_LENGTH} characters`
                };
            }
        }

        return { isValid: true };
    }

    static formatMessage(type: string, scope: string, summary: string, body?: string): string {
        let message = `${type}(${scope}): ${summary}`;
        
        if (body) {
            message += `\n\n${body}`;
        }
        
        return message;
    }

    static extractComponents(message: string): { type: string; scope: string; summary: string; body?: string } | null {
        const lines = message.split('\n');
        const firstLine = lines[0].trim();

        const match = firstLine.match(/^(feat|fix|docs|style|refactor|perf|test|chore)(\([a-z0-9-]+\))?:\s+(.+)$/);
        if (!match) {
            return null;
        }

        const [, type, scope, summary] = match;
        const scopeContent = scope ? scope.slice(1, -1) : '';
        
        // Extract body (everything after the first line, skipping empty lines)
        const bodyLines = lines.slice(1).filter(line => line.trim());
        const body = bodyLines.length > 0 ? bodyLines.join('\n') : undefined;

        return {
            type,
            scope: scopeContent,
            summary,
            body
        };
    }

    static suggestFix(message: string): string {
        const components = this.extractComponents(message);
        if (!components) {
            return 'feat(general): add new feature';
        }

        let { type, scope, summary, body } = components;

        // Fix type if invalid
        if (!this.VALID_TYPES.includes(type)) {
            type = 'feat';
        }

        // Fix scope if invalid
        if (scope && !/^[a-z0-9-]+$/.test(scope)) {
            scope = 'general';
        }

        // Fix summary length
        if (summary.length > this.MAX_SUMMARY_LENGTH) {
            summary = summary.substring(0, this.MAX_SUMMARY_LENGTH - 3) + '...';
        }

        // Remove trailing period
        if (summary.endsWith('.')) {
            summary = summary.slice(0, -1);
        }

        // Fix body line lengths
        if (body) {
            const bodyLines = body.split('\n');
            const fixedBodyLines = bodyLines.map(line => {
                if (line.length > this.MAX_BODY_LINE_LENGTH) {
                    return line.substring(0, this.MAX_BODY_LINE_LENGTH - 3) + '...';
                }
                return line;
            });
            body = fixedBodyLines.join('\n');
        }

        return this.formatMessage(type, scope, summary, body);
    }
} 