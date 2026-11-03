import { Customer } from '../types';
import { getStoredCustomers, saveCustomer, deleteCustomer } from './storage';

// Endpoint can be local Vercel /api/customers or custom domain api.php
const API_BASE = '/api/customers';
const PHP_API_FALLBACK = 'https://registration.triopneumax.com/api.php';

function getDbPasswordHeader(): Record<string, string> {
  const customPwd = localStorage.getItem('db_password');
  return customPwd ? { 'x-db-password': customPwd } : {};
}

/**
 * Fetch all registered customers from MySQL database with localStorage fallback
 */
export async function fetchCustomers(): Promise<Customer[]> {
  try {
    const res = await fetch(API_BASE, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        ...getDbPasswordHeader(),
      },
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        // Sync local storage cache
        try {
          localStorage.setItem('customer_records_v1', JSON.stringify(json.data));
        } catch {}
        return json.data;
      }
    }
  } catch (err) {
    console.warn('Direct /api/customers call failed, trying Hostinger PHP endpoint...', err);
  }

  // Fallback 1: Try PHP endpoint on registration.triopneumax.com
  try {
    const res = await fetch(PHP_API_FALLBACK, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        ...getDbPasswordHeader(),
      },
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        return json.data;
      }
    }
  } catch (err) {
    console.warn('PHP API fallback failed, using local offline cache...', err);
  }

  // Fallback 2: Local storage
  return getStoredCustomers();
}

/**
 * Save new customer to MySQL database, with offline local persistence guarantee
 */
export async function registerCustomer(newCustomer: Customer): Promise<{ success: boolean; customer: Customer; isOffline?: boolean }> {
  // Always persist locally first so registration is never lost
  saveCustomer(newCustomer);

  try {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...getDbPasswordHeader(),
      },
      body: JSON.stringify(newCustomer),
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success) {
        return { success: true, customer: json.customer || newCustomer, isOffline: false };
      }
    }
  } catch (err) {
    console.warn('/api/customers POST failed, attempting PHP endpoint...', err);
  }

  // Fallback to PHP endpoint
  try {
    const res = await fetch(PHP_API_FALLBACK, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...getDbPasswordHeader(),
      },
      body: JSON.stringify(newCustomer),
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success) {
        return { success: true, customer: json.customer || newCustomer, isOffline: false };
      }
    }
  } catch (err) {
    console.warn('Backend MySQL write failed, saved in local device storage instead.', err);
  }

  return { success: true, customer: newCustomer, isOffline: true };
}

/**
 * Delete customer from MySQL database
 */
export async function removeCustomer(id: string): Promise<boolean> {
  deleteCustomer(id);

  try {
    const res = await fetch(`${API_BASE}?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: {
        ...getDbPasswordHeader(),
      },
    });
    return res.ok;
  } catch {
    return false;
  }
}
