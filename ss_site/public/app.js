document.addEventListener('DOMContentLoaded', () => {
  const socket = io();

  // DOM Elements
  const galleryGrid = document.getElementById('gallery-grid');
  const searchInput = document.getElementById('search-input');
  const btnRefresh = document.getElementById('btn-refresh');
  const activityLog = document.getElementById('activity-log');
  const totalSsEl = document.getElementById('total-ss');
  
  // Lightbox DOM Elements
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const btnClosePanel = document.getElementById('btn-close-panel');
  const imageContainer = document.querySelector('.lightbox-image-container');
  
  // Lightbox Details DOM Elements
  const detailGuid = document.getElementById('detail-guid');
  const detailDate = document.getElementById('detail-date');
  const detailTime = document.getElementById('detail-time');
  const detailFilename = document.getElementById('detail-filename');
  const btnDownload = document.getElementById('btn-download');

  let allScreenshots = [];

  // 1. Fetch Screenshots from Server
  async function fetchScreenshots() {
    try {
      showLoading();
      const response = await fetch('/api/screenshots');
      if (!response.ok) throw new Error('Failed to fetch screenshots');
      
      allScreenshots = await response.ok ? await response.json() : [];
      renderGallery(allScreenshots);
      updateStats();
    } catch (error) {
      console.error('Error fetching screenshots:', error);
      galleryGrid.innerHTML = `
        <div class="no-screenshots">
          <i class="fa-solid fa-circle-exclamation" style="color: var(--danger);"></i>
          <h3>Failed to load screenshots</h3>
          <p>Please make sure the server backend is running and reachable.</p>
        </div>
      `;
    }
  }

  // 2. Render Gallery Cards
  function renderGallery(screenshots) {
    if (screenshots.length === 0) {
      galleryGrid.innerHTML = `
        <div class="no-screenshots">
          <i class="fa-solid fa-image-portrait"></i>
          <h3>No screenshots found</h3>
          <p>Once player screenshots are taken in-game, they will appear here automatically.</p>
        </div>
      `;
      return;
    }

    galleryGrid.innerHTML = '';
    screenshots.forEach(ss => {
      const card = createScreenshotCard(ss);
      galleryGrid.appendChild(card);
    });
  }

  // 3. Create Screenshot Card Element
  function createScreenshotCard(ss, isNew = false) {
    const card = document.createElement('div');
    card.className = `glass-card gallery-card ${isNew ? 'new-card-added' : ''}`;
    
    // Check if GUID looks like steamid or fallback
    const shortGuid = ss.guid.length > 15 ? `${ss.guid.substring(0, 12)}...` : ss.guid;

    card.innerHTML = `
      <div class="image-preview">
        ${isNew ? '<span class="live-badge">NEW</span>' : ''}
        <img src="${ss.url}" alt="Player Capture" loading="lazy">
        <div class="inspect-overlay">
          <span class="inspect-btn"><i class="fa-solid fa-magnifying-glass-plus"></i> INSPECT SCREEN</span>
        </div>
      </div>
      <div class="card-details">
        <div class="card-guid-row">
          <i class="fa-solid fa-user-shield"></i>
          <span class="player-guid" title="${ss.guid}">${ss.guid}</span>
        </div>
        <div class="card-meta-row">
          <span><i class="fa-solid fa-calendar"></i> ${ss.date}</span>
          <span><i class="fa-solid fa-clock"></i> ${ss.time}</span>
        </div>
      </div>
    `;

    // Click Event to open Lightbox Modal
    card.addEventListener('click', () => openLightbox(ss));

    return card;
  }

  // 4. Open Inspection Lightbox Modal
  function openLightbox(ss) {
    lightboxImg.src = ss.url;
    
    // Set Sidebar Details
    detailGuid.textContent = ss.guid;
    detailDate.textContent = ss.date;
    detailTime.textContent = ss.time;
    detailFilename.textContent = ss.filename;
    
    // Configure Download link
    btnDownload.href = ss.url;
    btnDownload.setAttribute('download', ss.filename);

    // Display Lightbox
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Disable page scrolling
  }

  // 5. Cursor-Following Zoom effect in Lightbox
  imageContainer.addEventListener('mousemove', (e) => {
    const rect = imageContainer.getBoundingClientRect();
    const x = e.clientX - rect.left; // x coordinate inside element
    const y = e.clientY - rect.top;  // y coordinate inside element
    
    // Calculate percentage coordinates
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;
    
    // Dynamically update transform-origin to follow the mouse
    lightboxImg.style.transformOrigin = `${xPercent}% ${yPercent}%`;
  });

  imageContainer.addEventListener('mouseleave', () => {
    // Reset zoom center on mouse exit
    lightboxImg.style.transformOrigin = 'center center';
  });

  // 6. Close Lightbox Modal
  function closeLightbox() {
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto'; // Enable page scrolling
    lightboxImg.src = '';
  }

  // Bind close events
  lightboxClose.addEventListener('click', closeLightbox);
  btnClosePanel.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.style.display === 'flex') {
      closeLightbox();
    }
  });

  // 7. Add Activity Log Ticker Message
  function addActivityLog(message, type = 'default') {
    // Remove empty placeholder log if present
    const emptyLog = activityLog.querySelector('.empty-log');
    if (emptyLog) emptyLog.remove();

    const li = document.createElement('li');
    li.className = type === 'success' ? 'success-log' : '';
    
    const time = new Date().toLocaleTimeString();
    li.innerHTML = `<strong>[${time}]</strong> ${message}`;

    // Prepend to top of activity list
    activityLog.insertBefore(li, activityLog.firstChild);

    // Cap activity list to latest 15 logs
    while (activityLog.children.length > 15) {
      activityLog.lastChild.remove();
    }
  }

  // 8. Stats & Spinner Utilities
  function updateStats() {
    totalSsEl.textContent = allScreenshots.length;
  }

  function showLoading() {
    galleryGrid.innerHTML = `
      <div class="loading-spinner">
        <i class="fa-solid fa-circle-notch fa-spin"></i>
        <span>Scanning Server Directory...</span>
      </div>
    `;
  }

  // 9. Client Side Live Search Filter
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    
    if (query === '') {
      renderGallery(allScreenshots);
      return;
    }

    const filtered = allScreenshots.filter(ss => {
      return ss.guid.toLowerCase().includes(query) || 
             ss.filename.toLowerCase().includes(query);
    });

    renderGallery(filtered);
  });

  // Refresh Button Click
  btnRefresh.addEventListener('click', () => {
    fetchScreenshots();
    addActivityLog('Screenshots directory manually scanned & refreshed.', 'success');
  });

  // =================================================================================
  // ⚡ SOCKET.IO REALTIME EVENTS ⚡
  // =================================================================================
  
  // Real-time Event: Server detects a new screenshot file
  socket.on('new-screenshot', (ss) => {
    console.log('Realtime screenshot received from server:', ss);

    // Append to local memory array at the front
    allScreenshots.unshift(ss);
    updateStats();

    // Check search criteria
    const query = searchInput.value.toLowerCase().trim();
    const matchesSearch = query === '' || 
                          ss.guid.toLowerCase().includes(query) || 
                          ss.filename.toLowerCase().includes(query);

    if (matchesSearch) {
      // Remove no-screenshots message if it's there
      const noSsMsg = galleryGrid.querySelector('.no-screenshots');
      if (noSsMsg) noSsMsg.remove();
      
      // Create card with live animation badge
      const newCard = createScreenshotCard(ss, true);
      
      // Prepend to gallery grid
      galleryGrid.insertBefore(newCard, galleryGrid.firstChild);
      
      // Fade-out live alert badge after 8 seconds
      setTimeout(() => {
        const badge = newCard.querySelector('.live-badge');
        if (badge) {
          badge.style.opacity = '0';
          badge.style.transition = 'opacity 1s ease';
          setTimeout(() => badge.remove(), 1000);
        }
      }, 8000);
    }

    // Log to activity log
    addActivityLog(`Capturing screen for Player: <span class="neon-text">${ss.guid}</span> successfully uploaded.`, 'success');
  });

  // WebSocket Connection log
  socket.on('connect', () => {
    addActivityLog('Connected to Live WebSocket stream.', 'success');
  });

  socket.on('disconnect', () => {
    addActivityLog('<span style="color: var(--danger);">Disconnected from live stream. Reconnecting...</span>');
  });

  // Run initial fetch on load
  fetchScreenshots();
});
