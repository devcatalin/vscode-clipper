const vscode = acquireVsCodeApi();

function deleteCard(id) {
  vscode.postMessage({
    type: "deleteCard",
    value: id,
  });
  const card = document.getElementById("card-" + id);
  if (card) {
    card.remove();
  }
}
