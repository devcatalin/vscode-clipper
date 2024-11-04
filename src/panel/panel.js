window.render((state) => {
  console.log("Rendering Panel View...");
  const app = document.getElementById("app");
  if (!app) {
    return;
  }

  const clips = state.clips;

  let html = "<h1>Panel View - Clips Dashboard</h1>";

  if (clips.length === 0) {
    html += '<div class="empty-state">No clips available. Create a clip using the command palette.</div>';
  } else {
    html += '<div class="clips-container">';
    clips.forEach((clip) => {
      html += `
        <div class="clip-card">
          <div class="clip-header">
            <div class="clip-title">${clip.message}</div>
            <button class="btn btn-icon" onclick="dispatch('removeClip', ${clip.id})">🗑️</button>
          </div>
          <div class="clip-content">
            <div class="clip-file">${clip.filePath}</div>
            <pre class="clip-code"><code>${clip.code}</code></pre>
          </div>
        </div>
      `;
    });
    html += "</div>";
  }

  app.innerHTML = html;
});
