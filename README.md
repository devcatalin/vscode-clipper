# Clipper

Clipper is a powerful Visual Studio Code extension designed to enhance your productivity by allowing you to effortlessly copy various project elements to your clipboard. Whether you're preparing context for discussions with large language models or documenting your projects, Clipper streamlines the process of gathering and managing project information.

## Features

- **Copy File Tree Structure**

  - **Full File Tree:** Copy the entire file tree of a selected folder, respecting `.gitignore` and common ignore patterns.
  - **Depth-Limited File Tree:** Specify a maximum depth to copy a truncated version of the file tree, representing deeper levels with ellipses (`...`).

- **Copy Code from Open Editors**

  - Extract and copy the content of all currently open text editors, formatted with appropriate language syntax highlighting.

- **Copy Problems from Open Editors**

  - Gather and copy all diagnostics (errors and warnings) from open editors, including contextual code snippets for each problem.

- **Clip Management**

  - **Create Clip:** Save custom clips with optional line numbers and metadata for easy reference.
  - **Copy All Clips:** Consolidate and copy all saved clips to your clipboard.
  - **Remove All Clips:** Clear all saved clips from the internal store.

- **Sidebar Integration**
  - **Clipper Sidebar:** Utilize a dedicated sidebar for quick access to Clipper's functionalities and views.
