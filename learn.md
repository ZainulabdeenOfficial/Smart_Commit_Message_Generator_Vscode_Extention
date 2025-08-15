# Smart Commits - AI-Powered Git Commit Messages

[![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](https://marketplace.visualstudio.com/items?itemName=mzainulabideen.smart-commits)
[![Downloads](https://img.shields.io/badge/downloads-0-brightgreen.svg)](https://marketplace.visualstudio.com/items?itemName=mzainulabideen.smart-commits)
[![Rating](https://img.shields.io/badge/rating-0.0-yellow.svg)](https://marketplace.visualstudio.com/items?itemName=mzainulabideen.smart-commits)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/ZainulabdeenOfficial/Smart_Commit_Message_Generator_Vscode_Extention/blob/main/LICENSE)

## 🚀 **Generate Professional Git Commit Messages with AI**

Smart Commits is a powerful VS Code extension that generates high-quality, conventional commit messages using AI or intelligent templates. Say goodbye to generic commit messages and hello to professional, meaningful commits!

**[📦 Install from VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=mzainulabideen.smart-commits)**

## ✨ **Features**

### 🤖 **AI-Powered Generation**
- **OpenAI Integration**: Uses GPT models for intelligent commit message generation
- **Conventional Commits**: Follows the industry-standard conventional commit format
- **Context-Aware**: Analyzes your code changes to generate relevant messages
- **Multiple Suggestions**: Choose from 3 AI-generated options

### 🎨 **Beautiful & Customizable UI**
- **Smart Status Bar**: Color-coded status indicator with one-click access
- **Enhanced Command Palette**: Beautiful icons and smart filtering
- **Customizable Quick Pick**: Rich suggestions with interactive buttons
- **Theme-Aware**: Automatically adapts to light/dark themes
- **Progress Indicators**: Beautiful loading animations

### ⚙️ **Flexible Configuration**
- **Template Mode**: Works offline with intelligent templates
- **Custom Templates**: Create your own commit message patterns
- **Public Key Testing**: Try AI features without API key setup
- **Auto-Suggestions**: Proactive help when files are staged

### 📝 **Conventional Commit Support**
- **Standard Format**: `type(scope): summary`
- **Valid Types**: feat, fix, docs, style, refactor, perf, test, chore
- **Auto Scope Detection**: Automatically detects scope from file paths
- **Validation**: Ensures messages follow conventional commit rules

## 🎯 **Quick Start**

### 1. **Install the Extension**
- Search for "Smart Commits" in VS Code Extensions
- Click Install
- Or install directly: [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=mzainulabideen.smart-commits)

### 2. **Configure AI (Optional)**
- Open VS Code Settings (`Ctrl+,`)
- Search for "Smart Commits"
- Add your OpenAI API key or enable public key testing

### 3. **Generate Your First Commit**
1. Make code changes
2. Stage files: `git add .`
3. Press `Ctrl+Shift+P` → "Generate Smart Commit Message"
4. Choose from beautiful suggestions
5. Edit if needed and confirm

## 🎨 **Beautiful UI Features**

### 🧠 **Smart Status Bar**
- **Dynamic Status**: Shows current AI mode with color coding
- **One-Click Access**: Click to generate commit messages instantly
- **Visual Feedback**: Green (AI ready), Yellow (needs API key), Gray (template mode)

### 🎯 **Enhanced Commands**
- `$(lightbulb)` **Generate Smart Commit Message** - Generate suggestions
- `$(check)` **Generate and Commit** - Generate and commit immediately
- `$(gear)` **Open Smart Commits Settings** - Beautiful settings UI
- `$(brain)` **Toggle AI Mode** - Switch between AI and template modes

### 🎨 **Customizable Interface**
- **UI Themes**: Light, dark, or auto mode
- **Status Bar**: Show/hide as needed
- **Auto-Suggestions**: Enable/disable proactive help
- **Custom Templates**: Create your own patterns

## ⚙️ **Configuration**

### 🤖 **AI Settings**
```json
{
    "smartCommit.useAI": true,
    "smartCommit.apiKey": "your-openai-key",
    "smartCommit.usePublicKey": false,
    "smartCommit.model": "gpt-3.5-turbo",
    "smartCommit.suggestions": 3
}
```

### 🎨 **UI Settings**
```json
{
    "smartCommit.uiTheme": "auto",
    "smartCommit.showStatusBar": true,
    "smartCommit.autoSuggest": true
}
```

### 📝 **Custom Templates**
```json
{
    "smartCommit.customTemplates": [
        "{type}({scope}): {summary}",
        "feat({scope}): implement new feature",
        "fix({scope}): resolve issue"
    ]
}
```

## 🎪 **Usage Examples**

### **Feature Addition**
```
feat(auth): add JWT token refresh logic

Implemented automatic token refresh when expired. Updated middleware to handle 401 responses.
```

### **Bug Fix**
```
fix(api): resolve user data validation error

Fixed validation logic for user input. Added proper error handling for malformed requests.
```

### **Documentation Update**
```
docs(readme): update installation instructions

Added detailed setup guide for new users. Included troubleshooting section.
```

## 🎯 **Commands**

| Command | Description | Icon |
|---------|-------------|------|
| Generate Smart Commit Message | Generate suggestions for staged changes | `$(lightbulb)` |
| Generate and Commit | Generate and commit immediately | `$(check)` |
| Open Smart Commits Settings | Open beautiful settings UI | `$(gear)` |
| Toggle AI Mode | Switch between AI and template modes | `$(brain)` |

## 🎨 **Customization Examples**

### 🌙 **Professional Dark Theme**
```json
{
    "smartCommit.uiTheme": "dark",
    "smartCommit.showStatusBar": true,
    "smartCommit.autoSuggest": true,
    "smartCommit.customTemplates": [
        "feat({scope}): implement {summary}",
        "fix({scope}): resolve {summary}",
        "docs({scope}): update {summary}"
    ]
}
```

### ☀️ **Minimalist Light Theme**
```json
{
    "smartCommit.uiTheme": "light",
    "smartCommit.showStatusBar": false,
    "smartCommit.autoSuggest": false,
    "smartCommit.useAI": false
}
```

## 🔧 **Requirements**

- VS Code 1.74.0 or higher
- Git repository
- OpenAI API key (optional, for AI features)

## 🚀 **Getting Started**

### **Option 1: AI Mode (Recommended)**
1. Get an OpenAI API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Add your key in VS Code Settings under "Smart Commits"
3. Enjoy AI-powered commit messages!

### **Option 2: Template Mode**
1. Set `smartCommit.useAI` to `false` in settings
2. Use intelligent templates for offline commit generation
3. Add custom templates for your workflow

### **Option 3: Public Key Testing**
1. Enable `smartCommit.usePublicKey` in settings
2. Try AI features without API key setup
3. Limited functionality for testing purposes

## 🎉 **Why Smart Commits?**

### ✨ **Professional Quality**
- **Conventional Format**: Industry-standard commit messages
- **AI Intelligence**: Context-aware suggestions
- **Consistent Style**: Maintains project standards

### 🎨 **Beautiful Experience**
- **Modern UI**: Clean, professional interface
- **Customizable**: Adapts to your preferences
- **User-Friendly**: Intuitive and easy to use

### 🚀 **Productivity Boost**
- **Time Saving**: No more writing commit messages from scratch
- **Quality Improvement**: Better, more descriptive commits
- **Team Collaboration**: Clear, meaningful commit history

## 🏗️ **Development**

### **Prerequisites**
# Smart_Commit_Message_Generator_Vscode_Extention

# Smart Commits - VS Code Extension

Generate high-quality Git commit messages using AI or templates, following Conventional Commit format.

## Features

- 🤖 **AI-Powered Generation**: Uses OpenAI API to generate intelligent commit messages
- 📝 **Template Mode**: Fallback template-based generation for offline use
- ✅ **Commit Validation**: Ensures messages follow Conventional Commit format
- 🎯 **Auto Scope Detection**: Automatically detects scope from changed file paths
- 🔄 **Multiple Suggestions**: Choose from 3 AI-generated options
- ⚙️ **Configurable**: Customize API settings, model, and behavior

## Installation

1. Clone this repository
2. Install dependencies: `npm install`
3. Compile the extension: `npm run compile`
4. Press `F5` in VS Code to run the extension in development mode

## Usage

### Commands

- **Generate Smart Commit Message**: Generates commit message suggestions for staged changes
- **Generate and Commit**: Generates suggestions and commits immediately after selection

### Workflow

1. Make your code changes
2. Stage the changes: `git add .`
3. Run the command: `Ctrl+Shift+P` → "Generate Smart Commit Message"
4. Select from the generated suggestions
5. Edit if needed and confirm

### Example Output
5. Open a Pull Request

## 📄 **License**

This extension is licensed under the MIT License. See [LICENSE](LICENSE) for details.

## 🐛 **Support**

- **Issues**: [GitHub Issues](https://github.com/ZainulabdeenOfficial/Smart_Commit_Message_Generator_Vscode_Extention/issues)
- **Documentation**: [GitHub Wiki](https://github.com/ZainulabdeenOfficial/Smart_Commit_Message_Generator_Vscode_Extention/wiki)
- **Discussions**: [GitHub Discussions](https://github.com/ZainulabdeenOfficial/Smart_Commit_Message_Generator_Vscode_Extention/discussions)

## ⭐ **Rate & Review**

If you find Smart Commits helpful, please consider:
- ⭐ **Rating** the extension on the [marketplace](https://marketplace.visualstudio.com/items?itemName=mzainulabideen.smart-commits)
- 📝 **Writing a review** to help others
- 🚀 **Sharing** with your team

## 📊 **Project Structure**

```
Smart_Commit_Message_Generator_Vscode_Extention/
├── src/
│   ├── extension.ts              # Main extension entry point
│   ├── gitService.ts             # Git operations and diff handling
│   ├── commitMessageGenerator.ts # AI and template message generation
│   ├── commitValidator.ts        # Commit message validation
│   └── uiService.ts              # Beautiful UI service
├── icons/
│   ├── icon.png                  # Extension icon
│   └── README.md                 # Icon documentation
├── out/                          # Compiled JavaScript
├── package.json                  # Extension manifest
├── tsconfig.json                 # TypeScript configuration
├── README.md                     # This file
├── LICENSE                       # MIT License
└── .vscodeignore                 # Files to exclude from package
```

## 🎯 **Roadmap**

- [ ] **Enhanced AI Models**: Support for more AI providers
- [ ] **Team Templates**: Share templates across team
- [ ] **Commit History**: Learn from previous commits
- [ ] **Integration**: Support for more Git platforms
- [ ] **Mobile**: VS Code for Web support

## 🙏 **Acknowledgments**

- **VS Code Team**: For the amazing extension API
- **OpenAI**: For providing powerful AI models
- **Conventional Commits**: For the commit message standard
- **Community**: For feedback and contributions

---

**Transform your Git workflow with Smart Commits - where AI meets beautiful design!** 🚀✨

**[📦 Install Now](https://marketplace.visualstudio.com/items?itemName=mzainulabideen.smart-commits)**
