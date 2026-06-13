import fs from "fs";
import path from "path";

// ===================================================
// CONFIGURATION (Safe Fallbacks for Vercel Deployment)
// ===================================================
const BIN_ID = process.env.JSONBIN_BIN_ID || null;
const API_KEY = process.env.JSONBIN_MASTER_KEY || null;
const CLOUD_URL = BIN_ID ? `https://api.jsonbin.io/v3/b/${BIN_ID}` : null;

const dataDir = path.join(process.cwd(), "src", "data");
const filesList = ["products.json", "inquiries.json", "roles.json", "settings.json", "categories.json", "cms.json", "admins.json"];

global.fileCache = global.fileCache || null;
global.syncTimeout = global.syncTimeout || null;

// Baseline fallback states matching your exact configuration layout
const DEFAULT_TEMPLATES = {
  "products": [{ id: "1", title: "Template Product", price: 0, slug: "template" }],
  "admins": [{ id: "1", name: "Admin", role: "admin", email: "admin@test.com" }],
  "categories": [{ id: "1", name: "General", slug: "general" }],
  "roles": [{ id: "1", name: "admin" }],
  "inquiries": [],
  "cms": {},
  "settings": {}
};

function ensureCacheLoaded() {
  if (global.fileCache) return;

  global.fileCache = {};
  
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  filesList.forEach((file) => {
    const filePath = path.join(dataDir, file);
    const key = file.replace(".json", "");
    const fallbackTemplate = DEFAULT_TEMPLATES[key] || [];

    if (fs.existsSync(filePath)) {
      try {
        const fileContent = fs.readFileSync(filePath, "utf-8").trim();
        // Securely catch empty files before they can generate any .toString() execution runtime errors
        if (!fileContent || fileContent === "[]" || fileContent === "{}") {
          global.fileCache[key] = fallbackTemplate;
          fs.writeFileSync(filePath, JSON.stringify(fallbackTemplate, null, 2), "utf-8");
        } else {
          global.fileCache[key] = JSON.parse(fileContent);
        }
      } catch {
        global.fileCache[key] = fallbackTemplate;
      }
    } else {
      fs.writeFileSync(filePath, JSON.stringify(fallbackTemplate, null, 2), "utf-8");
      global.fileCache[key] = fallbackTemplate;
    }
  });
}

function queueCloudSync() {
  if (!BIN_ID || !API_KEY || !CLOUD_URL) return;

  if (global.syncTimeout) {
    clearTimeout(global.syncTimeout);
  }

  global.syncTimeout = setTimeout(() => {
    try {
      fetch(CLOUD_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Master-Key": API_KEY,
        },
        body: JSON.stringify(global.fileCache),
      }).catch((err) => console.error("Cloud background sync failed:", err));
    } catch (e) {
      console.error("Cloud snapshot sync error:", e);
    }
  }, 10000); 
}

// ===================================================
// READ DATA
// ===================================================
export function readData(fileName) {
  ensureCacheLoaded();
  
  if (!fileName) return [];

  const key = fileName.replace(".json", "");
  const fallbackTemplate = DEFAULT_TEMPLATES[key] || [];

  const currentData = global.fileCache[key];
  if (!currentData || (Array.isArray(currentData) && currentData.length === 0 && fallbackTemplate.length > 0)) {
    return fallbackTemplate;
  }

  return currentData;
}

// ===================================================
// WRITE DATA
// ===================================================
export function writeData(fileName, data) {
  if (!fileName) return;

  ensureCacheLoaded();
  const key = fileName.replace(".json", "");
  const filePath = path.join(dataDir, fileName);
  const safeData = data || DEFAULT_TEMPLATES[key] || [];

  try {
    global.fileCache[key] = safeData;
    fs.writeFileSync(filePath, JSON.stringify(safeData, null, 2), "utf-8");
    queueCloudSync();
  } catch (error) {
    console.error(`Error writing structural data to ${fileName}:`, error);
  }
}