import * as assert from 'assert';
import { CommitValidator } from '../commitValidator';

suite('Commit Validator Test Suite', () => {
    test('Valid commit message', () => {
        const message = 'feat(auth): add JWT token refresh logic';
        const result = CommitValidator.validate(message);
        assert.strictEqual(result.isValid, true);
    });

    test('Invalid commit message - wrong format', () => {
        const message = 'Added JWT token refresh';
        const result = CommitValidator.validate(message);
        assert.strictEqual(result.isValid, false);
        assert.ok(result.error);
    });

    test('Invalid commit message - too long summary', () => {
        const message = 'feat(auth): add JWT token refresh logic with automatic renewal and error handling capabilities';
        const result = CommitValidator.validate(message);
        assert.strictEqual(result.isValid, false);
        assert.ok(result.error?.includes('too long'));
    });

    test('Valid commit message with body', () => {
        const message = `feat(auth): add JWT token refresh logic

Implemented automatic token refresh when expired. Updated middleware to handle 401 responses.`;
        const result = CommitValidator.validate(message);
        assert.strictEqual(result.isValid, true);
    });

    test('Extract components from valid message', () => {
        const message = 'feat(auth): add JWT token refresh logic';
        const components = CommitValidator.extractComponents(message);
        assert.ok(components);
        assert.strictEqual(components.type, 'feat');
        assert.strictEqual(components.scope, 'auth');
        assert.strictEqual(components.summary, 'add JWT token refresh logic');
    });

    test('Suggest fix for invalid message', () => {
        const message = 'Added JWT token refresh logic with automatic renewal and error handling capabilities.';
        const fixed = CommitValidator.suggestFix(message);
        assert.ok(fixed.startsWith('feat(general):'));
        assert.ok(!fixed.includes('.'));
    });
}); 