const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const fs = require('fs');
const chokidar = require('chokidar');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3000;

// Configurable path to CoD4 Screenshots folder
// By default, it will look for a "screenshots" folder in the mod directory (parent folder)
const SCREENSHOTS_DIR = path.resolve(__dirname, '../screenshots');

// Ensure screenshots directory exists so the server starts without crashing
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  console.log(`[CoD4 SS] Created missing screenshots directory at: ${SCREENSHOTS_DIR}`);
} else {
  console.log(`[CoD4 SS] Monitoring screenshots directory: ${SCREENSHOTS_DIR}`);
}

app.use(cors());
app.use(express.json());

// Serve static dashboard files
app.use(express.static(path.join(__dirname, 'public')));

// Serve the CoD4 screenshots folder statically
app.use('/screenshots', express.static(SCREENSHOTS_DIR));

// Helper function to parse screenshot metadata from its filename
// Standard CoD4x format is usually: <guid>_<date>_<time> or custom formats.
// E.g.: "76561198000000001_2026-05-28_02-45-12.png" or "guid_2026-05-28_02.jpg"
function parseScreenshotMetadata(filename) {
  const ext = path.extname(filename);
  const nameWithoutExt = path.basename(filename, ext);
  const parts = nameWithoutExt.split('_');

  let guid = 'Unknown_GUID';
  let date = 'Unknown_Date';
  let time = 'Unknown_Time';

  if (parts.length >= 1) {
    guid = parts[0];
  }
  if (parts.length >= 2) {
    date = parts[1];
  }
  if (parts.length >= 3) {
    // Reconstruct time (e.g. 02-45-12 -> 02:45:12)
    time = parts[2].replace(/-/g, ':');
  }

  // File stats for date fallback
  let timestamp = Date.now();
  try {
    const stats = fs.statSync(path.join(SCREENSHOTS_DIR, filename));
    timestamp = stats.birthtimeMs || stats.mtimeMs;
  } catch (err) {
    // fallback
  }

  return {
    filename,
    guid,
    date,
    time,
    url: `/screenshots/${filename}`,
    timestamp
  };
}

// REST API to get all screenshots (sorted by newest first)
app.get('/api/screenshots', (req, res) => {
  fs.readdir(SCREENSHOTS_DIR, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read screenshots directory' });
    }

    const screenshotFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ext === '.jpg' || ext === '.jpeg' || ext === '.png';
    });

    const screenshots = screenshotFiles.map(parseScreenshotMetadata);
    
    // Sort by timestamp descending (newest first)
    screenshots.sort((a, b) => b.timestamp - a.timestamp);

    res.json(screenshots);
  });
});

// Chokidar Directory Monitor for real-time updates
const watcher = chokidar.watch(SCREENSHOTS_DIR, {
  ignored: /(^|[\/\\])\../, // ignore dotfiles
  persistent: true,
  ignoreInitial: true // ignore existing files on startup
});

watcher.on('add', (filePath) => {
  const filename = path.basename(filePath);
  const ext = path.extname(filename).toLowerCase();
  
  if (ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
    console.log(`[Realtime-SS] New screenshot detected: ${filename}`);
    
    // Wait slightly for file writing to finish before parsing and broadcasting
    setTimeout(() => {
      try {
        const metadata = parseScreenshotMetadata(filename);
        io.emit('new-screenshot', metadata);
      } catch (err) {
        console.error('[Realtime-SS] Error parsing new file:', err);
      }
    }, 500);
  }
});

// Socket.io connection logic
io.on('connection', (socket) => {
  console.log(`[WS] Client connected to live stream: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`[WS] Client disconnected: ${socket.id}`);
  });
});

// Start Server
server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`⚡ HAVOC CoD4 Promod SS Dashboard running on port ${PORT}`);
  console.log(`🌍 Access it locally: http://localhost:${PORT}`);
  console.log(`=======================================================`);
});
