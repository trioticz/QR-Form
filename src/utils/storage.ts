import { Visitor, VisitorStatus } from '../types';

const STORAGE_KEY = 'aurapass_visitors_manifest_v2';

export function getStoredVisitors(): Visitor[] {
  try {
    // Clear any previous mock data session
    if (localStorage.getItem('aurapass_visitors_v1')) {
      localStorage.removeItem('aurapass_visitors_v1');
    }
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Failed to parse visitors from localStorage', e);
    return [];
  }
}

export function saveVisitor(newVisitor: Visitor): Visitor[] {
  const current = getStoredVisitors();
  const updated = [newVisitor, ...current];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save visitor', e);
  }
  return updated;
}

export function updateVisitorStatus(
  id: string,
  newStatus: VisitorStatus
): Visitor[] {
  const current = getStoredVisitors();
  const now = new Date();
  const timeFormatted = now.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const updated = current.map((v) => {
    if (v.id !== id) return v;

    if (newStatus === 'checked_in') {
      return {
        ...v,
        status: newStatus,
        checkInTime: timeFormatted,
      };
    } else if (newStatus === 'checked_out') {
      return {
        ...v,
        status: newStatus,
        checkOutTime: timeFormatted,
      };
    } else {
      return {
        ...v,
        status: newStatus,
      };
    }
  });

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to update visitor status', e);
  }
  return updated;
}

export function clearAllVisitors(): Visitor[] {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('aurapass_visitors_v1');
  } catch (e) {
    console.error('Failed to clear visitors', e);
  }
  return [];
}
