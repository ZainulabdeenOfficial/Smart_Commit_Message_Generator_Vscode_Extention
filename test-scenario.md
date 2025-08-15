# Smart Commits Extension - Test Scenario

## 🚀 Ready to Test!

Your VS Code extension is now fully implemented and ready to use. Here's how to test it:

## Step 1: Run the Extension

1. **Open VS Code** in this project directory
2. **Press `F5`** to run the extension in development mode
3. A new VS Code window will open with your extension loaded

## Step 2: Create Test Changes

1. **Create a test file** in the new VS Code window:
   ```bash
   # Create a test file
   echo "function testAuth() { return 'test'; }" > test-auth.js
   ```

2. **Stage the changes**:
   ```bash
   git add test-auth.js
   ```

## Step 3: Test the Extension

### Option A: Generate Commit Message Only
1. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
2. Type "Generate Smart Commit Message"
3. Select the command
4. Choose from the generated suggestions
5. Edit if needed and confirm

### Option B: Generate and Commit Immediately
1. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
2. Type "Generate and Commit"
3. Select the command
4. Choose from the generated suggestions
5. The commit will be executed automatically

## Expected Results

### Template Mode (Default - No API Key)
You should see suggestions like:
```
1. feat(general): add new feature
2. feat(general): implement new functionality
3. feat(general): add new capability
```

### AI Mode (With OpenAI API Key)
You should see more intelligent suggestions like:
```
1. feat(auth): add authentication test function
   Implemented basic authentication testing functionality

2. feat(auth): add test authentication method
   Created test function for authentication validation

3. feat(auth): implement auth testing capability
   Added test function to verify authentication logic
```

## Configuration Testing

### Test Template Mode
1. Open VS Code Settings (`Ctrl+,`)
2. Search for "Smart Commits"
3. Set `smartCommit.useAI` to `false`
4. Test the extension again

### Test AI Mode (Optional)
#### Option 1: Your Own API Key
1. Get an OpenAI API key from https://platform.openai.com/api-keys
2. In VS Code Settings, set `smartCommit.apiKey` to your key
3. Set `smartCommit.useAI` to `true`
4. Test the extension again

#### Option 2: Public Key for Testing
1. In VS Code Settings, enable `smartCommit.usePublicKey`
2. Set `smartCommit.useAI` to `true`
3. Test the extension again (limited functionality)

## Validation Testing

Try entering invalid commit messages to test validation:
- `"Added test function"` (should show format error)
- `"feat(AUTH): add test"` (should show scope error)
- `"feat(auth): add test function with very long description that exceeds the character limit"` (should show length error)

## Success Indicators

✅ **Extension loads without errors**
✅ **Commands appear in Command Palette**
✅ **Template suggestions are generated**
✅ **Commit validation works**
✅ **Git integration functions**
✅ **No console errors**

## Troubleshooting

If you encounter issues:

1. **Check the Developer Console** (`Help > Toggle Developer Tools`)
2. **Verify Git repository**: Make sure you're in a git repository
3. **Check staged changes**: Ensure you have staged changes with `git add`
4. **Review extension logs**: Look for any error messages

## Next Steps

Once testing is successful, you can:

1. **Package the extension** for distribution
2. **Publish to VS Code Marketplace**
3. **Add more features** like custom templates
4. **Integrate with other AI providers**

Your Smart Commits extension is now ready for real-world use! 🎉 