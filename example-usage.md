# Smart Commits Extension - Example Usage

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Compile the extension:
   ```bash
   npm run compile
   ```

3. Open the project in VS Code and press `F5` to run the extension in development mode.

## Example Workflow

### 1. Make Changes
Create a new file `src/auth.js`:
```javascript
// Authentication middleware
function authenticate(req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    // ... authentication logic
}
```

### 2. Stage Changes
```bash
git add src/auth.js
```

### 3. Generate Commit Message
- Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
- Type "Generate Smart Commit Message"
- Select the command

### 4. Expected Output
The extension will generate suggestions like:

```
1. feat(auth): add authentication middleware
   Implemented JWT token validation for API requests

2. feat(auth): add token-based authentication
   Added middleware to validate authorization headers

3. feat(auth): implement user authentication
   Created authentication system with JWT tokens
```

### 5. Select and Commit
- Choose one of the suggestions
- Edit if needed
- Confirm to execute the commit

## Configuration Examples

### OpenAI API Setup
```json
{
    "smartCommit.apiKey": "your-openai-api-key-here",
    "smartCommit.model": "gpt-3.5-turbo",
    "smartCommit.suggestions": 3
}
```

### Template Mode (Offline)
```json
{
    "smartCommit.useAI": false,
    "smartCommit.suggestions": 3
}
```

## Different Change Types

### Feature Addition
```bash
# Add new functionality
git add src/features/user-profile.js
# Generates: feat(user): add profile management
```

### Bug Fix
```bash
# Fix existing code
git add src/bugfixes/login-error.js
# Generates: fix(auth): resolve login validation error
```

### Documentation
```bash
# Update docs
git add README.md docs/api.md
# Generates: docs(general): update API documentation
```

### Refactoring
```bash
# Improve code structure
git add src/refactor/database-connection.js
# Generates: refactor(database): improve connection pooling
```

## Validation Examples

### Valid Commit Messages
```
feat(auth): add JWT token refresh logic
fix(api): resolve user data validation error
docs(readme): update installation instructions
refactor(database): optimize query performance
```

### Invalid Commit Messages (with fixes)
```
❌ "Added JWT token refresh"
✅ "feat(auth): add JWT token refresh logic"

❌ "feat(auth): add JWT token refresh logic with automatic renewal and error handling capabilities."
✅ "feat(auth): add JWT token refresh logic"

❌ "feat(AUTH): add token refresh"
✅ "feat(auth): add token refresh"
```

## Troubleshooting

### No staged changes found
```bash
# Make sure to stage your changes first
git add .
```

### API key not configured
- Open VS Code settings
- Search for "Smart Commits"
- Enter your OpenAI API key

### Network errors
- The extension will automatically fall back to template mode
- Check your internet connection
- Verify your API key is correct 