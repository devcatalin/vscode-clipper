# Clipper

Clipper is a Visual Studio Code extension that enhances your productivity by allowing you to easily copy various project elements to your clipboard. It's designed to help you quickly gather context for discussions with large language models or for other documentation purposes.

## Features

- Copy the file tree structure of a folder to your clipboard
- Copy the file tree structure with a specified depth limit
- Accessible via context menu for folders in the explorer
- Can be triggered from the command palette
- Respects `.gitignore` files and common ignored patterns
- Sorts directories first, then files alphabetically

## Usage

### Copy File Tree

1. **From the Explorer:**

   - Right-click on a folder in the VS Code explorer
   - Select "Clipper: Copy File Tree" from the context menu

2. **From the Command Palette:**
   - Open the command palette (Cmd+Shift+P on macOS, Ctrl+Shift+P on Windows/Linux)
   - Type "Clipper: Copy File Tree" and select the command
   - Enter a relative path when prompted, or leave empty to use the workspace root

### Copy File Tree with Depth

1. **From the Explorer:**

   - Right-click on a folder in the VS Code explorer
   - Select "Clipper: Copy File Tree with Depth" from the context menu

2. **From the Command Palette:**
   - Open the command palette (Cmd+Shift+P on macOS, Ctrl+Shift+P on Windows/Linux)
   - Type "Clipper: Copy File Tree with Depth" and select the command
   - Enter a relative path when prompted, or leave empty to use the workspace root
   - Enter the maximum depth for the file tree when prompted

The file tree structure will be copied to your clipboard, ready to be pasted wherever you need it.

## Example Output

```
project-root
├── src
│   ├── components
│   │   └── Button.tsx
│   └── utils
│       └── helpers.ts
├── tests
│   └── unit
│       └── helpers.test.ts
└── package.json
```

## Notes

- The extension ignores files and directories specified in the `.gitignore` file of the project root.
- It also ignores common patterns like `node_modules`, `.git`, and build output directories.
- When using the depth-limited copy, folders beyond the specified depth will be represented by `...` in the output.

## Upcoming Features

- Copy the content of all opened files (in development)

## Feedback and Contributions

If you encounter any issues or have suggestions for improvements, please open an issue on the GitHub repository.

Enjoy using Clipper!
