import { Ignore } from "ignore";
import { readdirSync, Dirent } from "fs";
import { join } from "path";

function getFilteredAndSortedItems(dir: string, ig: Ignore): Dirent[] {
  return readdirSync(dir, { withFileTypes: true })
    .filter((item) => !ig.ignores(item.name))
    .sort((a, b) => {
      if (a.isDirectory() && !b.isDirectory()) {
        return -1;
      }
      if (!a.isDirectory() && b.isDirectory()) {
        return 1;
      }
      return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
    });
}

export function generateFileTree(dir: string, rootName: string, ig: Ignore, indent: string = ""): string {
  let result = `${rootName}\n`;
  const items = getFilteredAndSortedItems(dir, ig);

  items.forEach((item, index) => {
    const isLast = index === items.length - 1;
    const connector = isLast ? "└── " : "├── ";
    const nextIndent = indent + (isLast ? "    " : "│   ");

    result += `${indent}${connector}${item.name}\n`;

    if (item.isDirectory()) {
      result += generateFileTree(join(dir, item.name), "", ig, nextIndent).split("\n").slice(1).join("\n");
      if (result[result.length - 1] !== "\n") {
        result += "\n";
      }
    }
  });

  return result;
}

export function generateFileTreeWithDepth(
  dir: string,
  rootName: string,
  ig: Ignore,
  maxDepth: number,
  isRelative: boolean,
  currentDepth: number = 0,
  indent: string = ""
): string {
  let result = `${rootName}\n`;

  if (currentDepth >= maxDepth) {
    result += `${indent}...\n`;
    return result;
  }

  const items = getFilteredAndSortedItems(dir, ig);

  items.forEach((item, index) => {
    const isLast = index === items.length - 1;
    const connector = isLast ? "└── " : "├── ";
    const nextIndent = indent + (isLast ? "    " : "│   ");

    result += `${indent}${connector}${item.name}\n`;

    if (item.isDirectory()) {
      const subTree = generateFileTreeWithDepth(
        join(dir, item.name),
        "",
        ig,
        maxDepth,
        isRelative,
        currentDepth + 1,
        nextIndent
      );
      result += subTree.split("\n").slice(1).join("\n");
    }
  });

  return result;
}
