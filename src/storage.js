// ─── Persistent storage for The Hearth ───
// Key is versioned so we can migrate cleanly in v2 if the schema changes.

const STORAGE_KEY = "hearth-calendar-v1";

const defaultState = {
  events: [],
  schemaVersion: 1,
};

export const loadState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultState };
    const parsed = JSON.parse(raw);
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

// ─── Event helpers ───
export const newEvent = (overrides = {}) => ({
  id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
  title: "",
  description: "",
  location: "",
  date: "",          // YYYY-MM-DD (start date, primary anchor)
  endDate: "",       // optional, for multi-day events
  startTime: "",     // HH:MM (24h) or empty for all-day
  endTime: "",
  allDay: true,
  goal: "G1",
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
