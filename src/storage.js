// ─── Persistent storage for The Hearth ───
const STORAGE_KEY = "hearth-calendar-v1";

// ─── Default categories — G1-G4 as starting point, user can add/rename/delete ───
export const DEFAULT_CATEGORIES = [
  { id: "G1", name: "Autonomous Man",      color: "#c9a84c" },
  { id: "G2", name: "Longhouse Tribe",     color: "#5b8a72" },
  { id: "G3", name: "Physical Foundation", color: "#8b4a4a" },
  { id: "G4", name: "Legacy Work",         color: "#4a6a8b" },
  { id: "RITUAL",   name: "Ritual",        color: "#a8704c" },
  { id: "PERSONAL", name: "Personal",      color: "#7a6a8a" },
];

// Preset color palette for category picker
export const PRESET_COLORS = [
  "#c9a84c", // gold
  "#8b4a4a", // red
  "#4a6a8b", // blue
  "#5b8a72", // green
  "#a8704c", // ember
  "#7a6a8a", // violet
  "#4a8a8a", // teal
  "#8a7a4a", // moss
  "#8a4a6a", // rose
  "#6a4a8a", // indigo
  "#8a8a4a", // olive
  "#4a4a8a", // slate
];

const defaultState = {
  events: [],
  categories: DEFAULT_CATEGORIES,
  schemaVersion: 2,
};

export const loadState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultState };
    const parsed = JSON.parse(raw);
    // Migrate v1 → v2: ensure categories exist
    if (!parsed.categories) {
      parsed.categories = DEFAULT_CATEGORIES;
      parsed.schemaVersion = 2;
    }
    return { ...defaultState, ...parsed };
  } catch (e) {
    console.warn("Hearth: failed to load state", e);
    return { ...defaultState };
  }
};

export const saveState = (state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn("Hearth: failed to save state", e);
  }
};

// ─── Category helpers ───
export const categoryById = (categories, id) =>
  categories.find(c => c.id === id) || { id, name: id, color: "#7a7060" };

export const newCategory = (overrides = {}) => ({
  id: `cat_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
  name: "New Category",
  color: PRESET_COLORS[0],
  ...overrides,
});

// ─── Event helpers ───
export const newEvent = (overrides = {}) => ({
  id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
  title: "",
  description: "",
  location: "",
  date: "",
  endDate: "",
  startTime: "",
  endTime: "",
  allDay: false,      // ← default OFF
  categoryId: "G1",
  createdAt: Date.now(),
  ...overrides,
});

export const eventsForDate = (events, isoDate) => {
  return events.filter(e => {
    if (e.endDate && e.endDate >= e.date) {
      return isoDate >= e.date && isoDate <= e.endDate;
    }
    return e.date === isoDate;
  });
};
