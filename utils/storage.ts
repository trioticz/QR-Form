import { Customer } from '../types';

const STORAGE_KEY = 'customer_records_v1';
const LEGACY_STORAGE_KEY = 'aurapass_visitors_manifest_v2';

export function getStoredCustomers(): Customer[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((item: any) => ({
          id: item.id || `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
          name: item.name || item.fullName || 'Unnamed Customer',
          phone: item.phone || '',
          email: item.email || '',
          businessType: item.businessType || item.purpose || 'General',
          organizationName: item.organizationName || (item.company && item.company !== 'Independent Guest' && item.company !== 'Individual' ? item.company : ''),
          registeredAt: item.registeredAt || new Date().toISOString().slice(0, 16).replace('T', ' '),
          registeredDate: item.registeredDate || (item.registeredAt ? item.registeredAt.slice(0, 10) : new Date().toISOString().slice(0, 10)),
          fullName: item.name || item.fullName,
          company: item.organizationName || item.company,
          purpose: item.businessType || item.purpose,
        }));
      }
    }

    // Check for legacy records to migrate seamlessly
    const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacyRaw) {
      const legacyList = JSON.parse(legacyRaw);
      if (Array.isArray(legacyList) && legacyList.length > 0) {
        const migrated: Customer[] = legacyList.map((item: any, idx: number) => {
          const registeredAt = item.registeredAt || item.checkInTime || new Date().toISOString().slice(0, 16).replace('T', ' ');
          const registeredDate = item.expectedDate || (registeredAt ? registeredAt.slice(0, 10) : new Date().toISOString().slice(0, 10));
          return {
            id: item.id || `CUST-${1000 + idx}`,
            name: item.fullName || item.name || 'Customer',
            phone: item.phone || '',
            email: item.email || '',
            businessType: item.purpose || 'General',
            organizationName: item.company && item.company !== 'Independent Guest' && item.company !== 'Individual' ? item.company : '',
            registeredAt,
            registeredDate,
            fullName: item.fullName,
            company: item.company,
            purpose: item.purpose,
          };
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
        return migrated;
      }
    }

    return [];
  } catch (e) {
    console.error('Failed to read customers from storage', e);
    return [];
  }
}

export function saveCustomer(newCustomer: Customer): Customer[] {
  const current = getStoredCustomers();
  const updated = [newCustomer, ...current];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save customer', e);
  }
  return updated;
}

export function deleteCustomer(id: string): Customer[] {
  const current = getStoredCustomers();
  const updated = current.filter((c) => c.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to delete customer', e);
  }
  return updated;
}

export function updateCustomer(id: string, partial: Partial<Customer>): Customer[] {
  const current = getStoredCustomers();
  const updated = current.map((c) => (c.id === id ? { ...c, ...partial } : c));
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to update customer', e);
  }
  return updated;
}

export function clearAllCustomers(): Customer[] {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LEGACY_STORAGE_KEY);
    localStorage.removeItem('aurapass_visitors_v1');
  } catch (e) {
    console.error('Failed to clear customer storage', e);
  }
  return [];
}

// Backward-compatibility aliases
export const getStoredVisitors = getStoredCustomers;
export const saveVisitor = saveCustomer;
export const clearAllVisitors = clearAllCustomers;
export function updateVisitorStatus(_id: string, _status: any): Customer[] {
  return getStoredCustomers();
}
