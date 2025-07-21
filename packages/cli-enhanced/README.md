# Gemini CLI Enhanced

Enhanced version of the Google Gemini CLI with additional features for improved development workflow.

## What's New in Enhanced Version

### 🎯 Default Custom Instructions
Gemini CLI Enhanced comes with pre-configured custom instructions that focus on:
- **Task Verification**: Always confirms understanding before starting
- **Concise Communication**: Direct, actionable responses
- **Systematic Planning**: Structured approach to complex tasks
- **Development Best Practices**: Security-first, convention-following approach
- **Efficient Workflow**: Tool-focused responses with minimal explanations

### 📋 Built-in TODO Tool
Integrated task management with visual progress tracking:
- **⭕ Not Made** (Red circle) - Task not started
- **🔄 In Progress** (Blue arrows) - Currently working on task  
- **✅ Made** (Green checkmark) - Task completed

The TODO tool helps break down complex tasks and track progress systematically. It automatically clears when returning to the main prompt.

## Installation

Install alongside the original Gemini CLI:

```bash
npm install -g @google/gemini-cli-enhanced
```

## Usage

Run the enhanced version with:

```bash
gemini-enhanced
```

The original Gemini CLI remains available as:

```bash
gemini
```

## Enhanced Features in Action

### Automatic Task Planning
When given complex tasks, Gemini CLI Enhanced will:
1. Initialize a TODO list with clear steps
2. Update step status as work progresses
3. Display progress visually in the CLI
4. Clear the list when returning to main prompt

### Custom Instructions
The enhanced version includes built-in instructions that ensure:
- **Verification First**: Confirms task understanding before proceeding
- **Structured Approach**: Breaks down complex tasks systematically
- **Security Focus**: Never introduces vulnerabilities
- **Convention Following**: Matches existing code patterns
- **Efficient Communication**: Minimal explanations, maximum action

## Compatibility

Gemini CLI Enhanced is fully compatible with:
- All existing Gemini CLI features
- Same authentication methods
- Same configuration files
- Same MCP servers and extensions

## Example Workflow

```bash
$ gemini-enhanced
> Implement a user authentication system with JWT tokens

# Gemini CLI Enhanced will:
# 1. Summarize the task for verification
# 2. Initialize a TODO list with steps
# 3. Update progress as each step completes
# 4. Show visual progress indicators
# 5. Follow security best practices
```

## Differences from Standard Gemini CLI

| Feature | Standard Gemini CLI | Gemini CLI Enhanced |
|---------|-------------------|-------------------|
| Custom Instructions | User configurable | Built-in development-focused |
| Task Management | Manual | Automatic TODO tool |
| Progress Tracking | None | Visual status indicators |
| Communication Style | Verbose | Concise and direct |
| Task Verification | Optional | Always confirms first |

## Configuration

Gemini CLI Enhanced uses the same configuration as the standard version. All settings in `.gemini/` directory are shared between both versions.

## Support

For issues specific to the enhanced features, please refer to the main Gemini CLI repository and mention you're using the enhanced version.
