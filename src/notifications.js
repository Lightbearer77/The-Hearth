// ─── Notifications module ───
// Manages permission state, firing reminders on app open, and per-day dedup
// so the same reminder doesn't fire twice in one day.

import { remindersForDate } from './holidays.js';
import { todayISO } from './constants.js';

const NOTIFIED_KEY = 'hearth-notified-v1';
const ICON_PATH = (import.meta.env?.BASE_URL || '/') + 'icon-192.png';

// ─── Support & permission ───
export const notificationSupport = () =>
  typeof window !== 'undefined' && 'Notification' in window;

export const notificationPermission = () =>
  notificationSupport() ? Notification.permission : 'unsupported';

export const requestNotificationPermission = async () => {
  if (!notificationSupport()) return 'unsupported';
  if (Notification.permission !== 'default') return Notification.permission;
  try {
    const result = await Notification.requestPermission();
    return result;
  } catch (e) {
    return Notification.permission;
  }
};

// ─── Dedup tracking ───
// Stores: { "YYYY-MM-DD": ["holidayId:daysAway", ...] }
// Prunes entries older than 7 days on each write.
const getNotifiedMap = () => {
  try {
    return JSON.parse(localStorage.getItem(NOTIFIED_KEY) || '{}');
  } catch {
    return {};
  }
};

const setNotifiedMap = (map) => {
  // Prune older than 7 days
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 7);
  const cutoffISO = cutoff.toISOString().slice(0, 10);
  const pruned = {};
  for (const [date, ids] of Object.entries(map)) {
    if (date >= cutoffISO) pruned[date] = ids;
  }
  try {
    localStorage.setItem(NOTIFIED_KEY, JSON.stringify(pruned));
  } catch {}
};

// ─── Fire notifications ───
// Called on app open. Checks today's reminders, fires any not yet fired today.
export const checkAndFireReminders = async () => {
  if (notificationPermission() !== 'granted') {
    return { fired: 0, skipped: 0, reason: 'no-permission' };
  }

  const today = todayISO();
  const year  = parseInt(today.slice(0, 4), 10);
  const reminders = remindersForDate(today, year);
  if (reminders.length === 0) return { fired: 0, skipped: 0 };

  const map = getNotifiedMap();
  const alreadyFired = new Set(map[today] || []);
  const toFire = reminders.filter(r => !alreadyFired.has(`${r.holiday.id}:${r.daysAway}`));

  if (toFire.length === 0) {
    return { fired: 0, skipped: reminders.length, reason: 'already-fired-today' };
  }

  // Prefer the service worker registration to show notifications — more reliable
  // on Android, and required for iOS PWAs.
  let registration = null;
  if ('serviceWorker' in navigator) {
    try {
      registration = await navigator.serviceWorker.ready;
    } catch {}
  }

  for (const r of toFire) {
    const dayLabel = r.daysAway === 1 ? 'Tomorrow' : `In ${r.daysAway} days`;
    const typeLabel = r.holiday.type === 'remembrance' ? 'Day of Remembrance' : 'Holy Day';
    const title = `${r.holiday.symbol}  ${r.holiday.title}`;
    const body  = `${dayLabel} · ${typeLabel}`;
    const tag   = `hearth-${r.holiday.id}-${r.daysAway}`;

    try {
      if (registration?.showNotification) {
        await registration.showNotification(title, {
          body,
          icon: ICON_PATH,
          badge: ICON_PATH,
          tag,
          // Allow the browser to bundle into the notification tray
          renotify: false,
          silent: false,
        });
      } else if (notificationSupport()) {
        new Notification(title, { body, icon: ICON_PATH, tag });
      }
    } catch (e) {
      console.warn('Hearth: notification fire failed', e);
    }
  }

  // Mark all fired
  const newIds = toFire.map(r => `${r.holiday.id}:${r.daysAway}`);
  map[today] = [...alreadyFired, ...newIds];
  setNotifiedMap(map);

  return { fired: toFire.length, skipped: reminders.length - toFire.length };
};

// ─── Test fire — for the "Send a test notification" button ───
export const fireTestNotification = async () => {
  if (notificationPermission() !== 'granted') return false;
  let registration = null;
  if ('serviceWorker' in navigator) {
    try { registration = await navigator.serviceWorker.ready; } catch {}
  }
  const title = '🔥  The Hearth';
  const body  = 'Notifications are working. Reminders will fire when you open the app on a reminder day.';
  try {
    if (registration?.showNotification) {
      await registration.showNotification(title, { body, icon: ICON_PATH, tag: 'hearth-test' });
    } else {
      new Notification(title, { body, icon: ICON_PATH, tag: 'hearth-test' });
    }
    return true;
  } catch {
    return false;
  }
};
