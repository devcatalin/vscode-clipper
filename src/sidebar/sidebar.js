window.render((state) => {
  console.log("Rendering Sidebar View...");
  const app = document.getElementById("app");
  if (!app) {
    return;
  }

  const clips = state.clips;

  let html = "<h1>Sidebar View - Clips</h1>";
  html += '<button class="btn btn-secondary" onclick="openDashboard()">📋 Open Dashboard</button>';

  if (clips.length === 0) {
    html += '<div class="empty-state">No clips available</div>';
  } else {
    clips.forEach((clip) => {
      html += `
        <div class="clip-item">
          <div class="clip-header">
            <div class="clip-title">${clip.message}</div>
            <button class="btn btn-icon" onclick="dispatch('removeClip', ${clip.id})">🗑️</button>
          </div>
          <div class="clip-file">${clip.filePath}</div>
        </div>
      `;
    });
  }

  app.innerHTML = html;
});
