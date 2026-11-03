import mysql from 'mysql2/promise';

interface CustomerPayload {
  id?: string;
  name: string;
  phone: string;
  email: string;
  businessType: string;
  organizationName?: string;
  registeredAt?: string;
  registeredDate?: string;
}

const DB_CONFIG = {
  host: process.env.MYSQL_HOST || process.env.DB_HOST || 'srv2050.hstgr.io',
  port: Number(process.env.MYSQL_PORT || process.env.DB_PORT || 3306),
  user: process.env.MYSQL_USER || process.env.DB_USER || 'u975848500_trioticz',
  password: process.env.MYSQL_PASSWORD || process.env.DB_PASSWORD || 'Trioticz@1234',
  database: process.env.MYSQL_DATABASE || process.env.DB_NAME || 'u975848500_form_register',
  connectTimeout: 8000,
};

let pool: mysql.Pool | null = null;

function getPool(customPassword?: string): mysql.Pool {
  const pwd = customPassword || DB_CONFIG.password;
  if (!pool || customPassword) {
    pool = mysql.createPool({
      ...DB_CONFIG,
      password: pwd,
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0,
    });
  }
  return pool;
}

// Auto-create table if not exists
async function ensureTable(p: mysql.Pool) {
  const createSql = `
    CREATE TABLE IF NOT EXISTS customers (
      id VARCHAR(64) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      phone VARCHAR(50) NOT NULL,
      email VARCHAR(255) NOT NULL,
      business_type VARCHAR(255) NOT NULL,
      organization_name VARCHAR(255) DEFAULT '',
      registered_at VARCHAR(50) NOT NULL,
      registered_date VARCHAR(50) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `;
  await p.query(createSql);
}

function setCors(res: any) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-db-password'
  );
}

function sendJson(res: any, statusCode: number, data: any) {
  if (typeof res.status === 'function') {
    res.status(statusCode).json(data);
  } else {
    res.statusCode = statusCode;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
  }
}

export default async function handler(req: any, res: any) {
  setCors(res);

  if (req.method === 'OPTIONS') {
    if (typeof res.status === 'function') {
      res.status(200).end();
    } else {
      res.statusCode = 200;
      res.end();
    }
    return;
  }

  // Check for password
  const url = new URL(req.url, `http://${req.headers?.host || 'localhost'}`);
  const customPass = (req.headers?.['x-db-password'] as string) || url.searchParams.get('db_pass') || undefined;
  const activePassword = customPass || DB_CONFIG.password;

  if (!activePassword) {
    sendJson(res, 400, {
      success: false,
      error: 'Database password not configured.',
    });
    return;
  }

  try {
    const db = getPool(activePassword);
    await ensureTable(db);

    // GET /api/customers - fetch all records
    if (req.method === 'GET') {
      const [rows]: [any[], any] = await db.query(
        'SELECT id, name, phone, email, business_type as businessType, organization_name as organizationName, registered_at as registeredAt, registered_date as registeredDate FROM customers ORDER BY created_at DESC'
      );

      const formatted = rows.map((r) => ({
        ...r,
        fullName: r.name,
        company: r.organizationName || '',
        purpose: r.businessType,
      }));

      sendJson(res, 200, {
        success: true,
        count: formatted.length,
        data: formatted,
      });
      return;
    }

    // POST /api/customers - save customer registration
    if (req.method === 'POST') {
      let body: CustomerPayload = req.body;
      if (!body && typeof req[Symbol.asyncIterator] === 'function') {
        try {
          const buffers = [];
          for await (const chunk of req) {
            buffers.push(chunk);
          }
          const rawStr = Buffer.concat(buffers).toString('utf-8');
          if (rawStr) {
            body = JSON.parse(rawStr);
          }
        } catch {}
      }
      if (typeof body === 'string') {
        try {
          body = JSON.parse(body);
        } catch {}
      }

      if (!body || !body.name || !body.phone) {
        sendJson(res, 400, { success: false, error: 'Name and Phone are required.' });
        return;
      }

      const id = body.id || `CUST-${Math.floor(1000 + Math.random() * 9000)}`;
      const now = new Date();
      const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const dateFormatted = body.registeredDate || now.toISOString().slice(0, 10);
      const registeredAt = body.registeredAt || `${dateFormatted} ${timeFormatted}`;

      const insertSql = `
        INSERT INTO customers (id, name, phone, email, business_type, organization_name, registered_at, registered_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE 
          name = VALUES(name),
          phone = VALUES(phone),
          email = VALUES(email),
          business_type = VALUES(business_type),
          organization_name = VALUES(organization_name)
      `;

      await db.query(insertSql, [
        id,
        body.name.trim(),
        body.phone.trim(),
        (body.email || '').trim().toLowerCase(),
        body.businessType.trim(),
        (body.organizationName || '').trim(),
        registeredAt,
        dateFormatted,
      ]);

      const savedCustomer = {
        id,
        name: body.name.trim(),
        phone: body.phone.trim(),
        email: (body.email || '').trim().toLowerCase(),
        businessType: body.businessType.trim(),
        organizationName: (body.organizationName || '').trim(),
        registeredAt,
        registeredDate: dateFormatted,
        fullName: body.name.trim(),
        company: (body.organizationName || '').trim(),
        purpose: body.businessType.trim(),
      };

      sendJson(res, 201, {
        success: true,
        message: 'Customer saved to Hostinger MySQL database successfully.',
        customer: savedCustomer,
      });
      return;
    }

    // DELETE /api/customers?id=...
    if (req.method === 'DELETE') {
      const idToDelete = url.searchParams.get('id') || req.body?.id;
      if (!idToDelete) {
        sendJson(res, 400, { success: false, error: 'Customer id is required to delete.' });
        return;
      }

      await db.query('DELETE FROM customers WHERE id = ?', [idToDelete]);
      sendJson(res, 200, { success: true, message: `Customer ${idToDelete} deleted successfully.` });
      return;
    }

    sendJson(res, 405, { success: false, error: `Method ${req.method} not allowed.` });
  } catch (error: any) {
    console.error('MySQL Database Error:', error);
    sendJson(res, 500, {
      success: false,
      error: error.message || 'Database error occurred.',
      code: error.code,
    });
  }
}
