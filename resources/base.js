const vscode = acquireVsCodeApi();

let renderCallback = null;

window.render = function (callback) {
  renderCallback = callback;

  window.addEventListener("message", (event) => {
    const message = event.data;
    console.log("[Clipper] Received message:", message);

    if (message.type === "render" && message.value && typeof renderCallback === "function") {
      console.log("[Clipper] Rendering state:", message.value);
      renderCallback(message.value);
    }
  });
};

window.dispatch = function (actionType, payload) {
  console.log("[Clipper] Dispatching action:", actionType, payload);
  vscode.postMessage({
    type: "dispatch",
    value: { actionType, payload },
  });
};

window.onCopyAllClips = function () {
  dispatch("copyAllClips");
};

window.onRemoveAllClips = function () {
  dispatch("removeAllClips");
};

window.openDashboard = function () {
  vscode.postMessage({
    type: "command",
    command: "clipper.openDashboard",
  });
};
