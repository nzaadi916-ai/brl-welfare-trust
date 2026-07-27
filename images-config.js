// Image configuration details for BRL Welfare Trust website
// This file stores which images are shown, which are hidden, and their categories.
// You can edit this file directly or export from image-manager.html.

const DEFAULT_IMAGES_CONFIG = {
  // Add filenames of blurry or military images here to block them from showing on the website
  blocked: [
    "WhatsApp Image 2026-07-18 at 11.08.36 AM (2).jpeg", // 11KB (Thumbnail)
    "WhatsApp Image 2026-07-23 at 8.50.04 AM (1).jpeg", // 30KB (Low resolution)
    "WhatsApp Image 2026-07-23 at 8.50.52 AM.jpeg",     // 46KB (Low resolution)
    "WhatsApp Image 2026-07-23 at 8.51.02 AM (2).jpeg", // 48KB (Low resolution)
    "WhatsApp Image 2026-07-23 at 8.51.15 AM (3).jpeg", // 37KB (Low resolution)
    "WhatsApp Image 2026-07-23 at 8.51.58 AM (2).jpeg", // 45KB (Low resolution)
    "WhatsApp Image 2026-07-23 at 8.52.08 AM.jpeg",     // 45KB (Low resolution)
    "WhatsApp Image 2026-07-23 at 8.52.19 AM.jpeg"      // 44KB (Low resolution)
  ],
  // Categorized images. Any uncategorized images will go to the general gallery pool.
  categories: {
    "WhatsApp Image 2026-07-23 at 8.49.48 AM.jpeg": "combine-marriages",
    "WhatsApp Image 2026-07-23 at 8.52.39 AM (1).jpeg": "combine-marriages",
    "WhatsApp Image 2026-07-23 at 8.52.39 AM (2).jpeg": "combine-marriages",
    "WhatsApp Image 2026-07-23 at 8.52.39 AM (3).jpeg": "combine-marriages",
    "WhatsApp Image 2026-07-23 at 8.52.39 AM.jpeg": "combine-marriages",
    "WhatsApp Image 2026-07-23 at 8.52.40 AM (1).jpeg": "combine-marriages",
    "WhatsApp Image 2026-07-23 at 8.52.40 AM (2).jpeg": "combine-marriages",
    "WhatsApp Image 2026-07-23 at 8.52.40 AM.jpeg": "combine-marriages",
    "WhatsApp Image 2026-07-23 at 8.50.04 AM.jpeg": "computer-education",
    "WhatsApp Image 2026-07-23 at 8.50.04 AM (1).jpeg": "computer-education",
    "WhatsApp Image 2026-07-23 at 8.50.04 AM (2).jpeg": "computer-education",
    "WhatsApp Image 2026-07-23 at 8.50.04 AM (3).jpeg": "computer-education",
    "WhatsApp Image 2026-07-23 at 8.50.04 AM (4).jpeg": "computer-education",
    "WhatsApp Image 2026-07-23 at 8.50.05 AM (1).jpeg": "computer-education",
    "WhatsApp Image 2026-07-23 at 8.50.05 AM (2).jpeg": "computer-education",
    "WhatsApp Image 2026-07-23 at 8.50.05 AM.jpeg": "computer-education",
    "WhatsApp Image 2026-07-23 at 8.50.02 AM.jpeg": "eye-camps",
    "WhatsApp Image 2026-07-23 at 8.50.02 AM (1).jpeg": "eye-camps",
    "WhatsApp Image 2026-07-23 at 8.50.02 AM (2).jpeg": "eye-camps",
    "WhatsApp Image 2026-07-23 at 8.51.02 AM.jpeg": "medical-camps",
    "WhatsApp Image 2026-07-23 at 8.51.02 AM (1).jpeg": "medical-camps",
    "WhatsApp Image 2026-07-23 at 8.51.02 AM (2).jpeg": "medical-camps",
    "WhatsApp Image 2026-07-23 at 8.51.02 AM (3).jpeg": "medical-camps",
    "WhatsApp Image 2026-07-23 at 8.51.15 AM.jpeg": "medical-camps",
    "WhatsApp Image 2026-07-23 at 8.51.15 AM (1).jpeg": "medical-camps",
    "WhatsApp Image 2026-07-23 at 8.51.15 AM (2).jpeg": "medical-camps",
    "WhatsApp Image 2026-07-23 at 8.51.15 AM (3).jpeg": "medical-camps",
    "WhatsApp Image 2026-07-23 at 8.51.15 AM (4).jpeg": "medical-camps",
    "WhatsApp Image 2026-07-23 at 8.51.15 AM (5).jpeg": "medical-camps",
    "WhatsApp Image 2026-07-18 at 11.08.35 AM.jpeg": "flood-relief",
    "WhatsApp Image 2026-07-18 at 11.08.36 AM.jpeg": "flood-relief",
    "WhatsApp Image 2026-07-18 at 11.08.38 AM.jpeg": "flood-relief",
    "WhatsApp Image 2026-07-18 at 11.08.38 AM (1).jpeg": "flood-relief",
    "WhatsApp Image 2026-07-23 at 8.50.46 AM.jpeg": "flood-relief",
    "WhatsApp Image 2026-07-23 at 8.50.46 AM (1).jpeg": "flood-relief",
    "WhatsApp Image 2026-07-23 at 8.49.47 AM.jpeg": "hand-pumps",
    "WhatsApp Image 2026-07-23 at 8.49.47 AM (1).jpeg": "hand-pumps",
    "WhatsApp Image 2026-07-23 at 8.49.48 AM (1).jpeg": "hand-pumps",
    "WhatsApp Image 2026-07-23 at 8.49.49 AM.jpeg": "school-furniture",
    "WhatsApp Image 2026-07-23 at 8.49.50 AM.jpeg": "school-furniture",
    "WhatsApp Image 2026-07-23 at 8.49.50 AM (1).jpeg": "school-furniture",
    "WhatsApp Image 2026-07-23 at 8.50.09 AM.jpeg": "volunteers",
    "WhatsApp Image 2026-07-23 at 8.51.30 AM.jpeg": "volunteers",
    "WhatsApp Image 2026-07-23 at 8.51.31 AM.jpeg": "volunteers",
    "WhatsApp Image 2026-07-23 at 8.51.31 AM (1).jpeg": "volunteers",
    "WhatsApp Image 2026-07-23 at 8.51.31 AM (2).jpeg": "volunteers",
    "WhatsApp Image 2026-07-23 at 8.51.40 AM.jpeg": "volunteers",
    "WhatsApp Image 2026-07-23 at 8.51.42 AM.jpeg": "volunteers"
  }
};

// Helper functions to manage configurations in the browser
function getImagesConfig() {
  const localConfig = localStorage.getItem('brl_images_config');
  if (localConfig) {
    try {
      return JSON.parse(localConfig);
    } catch (e) {
      console.error("Failed to parse local image config, falling back to default.", e);
    }
  }
  return DEFAULT_IMAGES_CONFIG;
}

function saveImagesConfig(config) {
  localStorage.setItem('brl_images_config', JSON.stringify(config));
}
