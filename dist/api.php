<?php
/**
 * Hostinger MySQL Database API for She Wins Customer Registration
 * Database: u975848500_form_register
 * User: u975848500_trioticz
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, x-db-password');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$db_host = 'localhost'; // When running on Hostinger, localhost is fastest. Fallback to srv2050.hstgr.io
$db_name = 'u975848500_form_register';
$db_user = 'u975848500_trioticz';

// Password can be passed via env, header, or query param, or updated below
$headers = getallheaders();
$db_pass = getenv('DB_PASSWORD') ?: ($headers['x-db-password'] ?? ($_GET['db_pass'] ?? ''));

if (empty($db_pass)) {
    // If not supplied dynamically, check if hardcoded or throw
    $db_pass = ''; // Enter password here if needed
}

try {
    // Try localhost first, then remote host
    $pdo = null;
    try {
        $pdo = new PDO("mysql:host={$db_host};dbname={$db_name};charset=utf8mb4", $db_user, $db_pass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_TIMEOUT => 5
        ]);
    } catch (PDOException $e) {
        // Fallback to external hostname
        $pdo = new PDO("mysql:host=srv2050.hstgr.io;port=3306;dbname={$db_name};charset=utf8mb4", $db_user, $db_pass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_TIMEOUT => 5
        ]);
    }

    // Ensure table exists
    $pdo->exec("
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
    ");

    $method = $_SERVER['REQUEST_METHOD'];

    // GET /api.php - fetch all customers
    if ($method === 'GET') {
        $stmt = $pdo->query("SELECT id, name, phone, email, business_type AS businessType, organization_name AS organizationName, registered_at AS registeredAt, registered_date AS registeredDate FROM customers ORDER BY created_at DESC");
        $customers = $stmt->fetchAll();

        foreach ($customers as &$c) {
            $c['fullName'] = $c['name'];
            $c['company'] = $c['organizationName'] ?: '';
            $c['purpose'] = $c['businessType'];
        }

        echo json_encode([
            'success' => true,
            'count' => count($customers),
            'data' => $customers
        ]);
        exit;
    }

    // POST /api.php - insert or update customer
    if ($method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input) {
            $input = $_POST;
        }

        if (empty($input['name']) || empty($input['phone'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Name and Phone are required.']);
            exit;
        }

        $id = $input['id'] ?? ('CUST-' . rand(1000, 9999));
        $now = new DateTime();
        $registeredDate = $input['registeredDate'] ?? $now->format('Y-m-d');
        $registeredAt = $input['registeredAt'] ?? $now->format('Y-m-d H:i');

        $stmt = $pdo->prepare("
            INSERT INTO customers (id, name, phone, email, business_type, organization_name, registered_at, registered_date)
            VALUES (:id, :name, :phone, :email, :business_type, :organization_name, :registered_at, :registered_date)
            ON DUPLICATE KEY UPDATE
                name = VALUES(name),
                phone = VALUES(phone),
                email = VALUES(email),
                business_type = VALUES(business_type),
                organization_name = VALUES(organization_name)
        ");

        $stmt->execute([
            ':id' => $id,
            ':name' => trim($input['name']),
            ':phone' => trim($input['phone']),
            ':email' => strtolower(trim($input['email'] ?? '')),
            ':business_type' => trim($input['businessType'] ?? 'General'),
            ':organization_name' => trim($input['organizationName'] ?? ''),
            ':registered_at' => $registeredAt,
            ':registered_date' => $registeredDate
        ]);

        $saved = [
            'id' => $id,
            'name' => trim($input['name']),
            'phone' => trim($input['phone']),
            'email' => strtolower(trim($input['email'] ?? '')),
            'businessType' => trim($input['businessType'] ?? 'General'),
            'organizationName' => trim($input['organizationName'] ?? ''),
            'registeredAt' => $registeredAt,
            'registeredDate' => $registeredDate,
            'fullName' => trim($input['name']),
            'company' => trim($input['organizationName'] ?? ''),
            'purpose' => trim($input['businessType'] ?? 'General')
        ];

        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'Customer saved to MySQL database successfully.',
            'customer' => $saved
        ]);
        exit;
    }

    // DELETE /api.php?id=...
    if ($method === 'DELETE') {
        $id = $_GET['id'] ?? null;
        if (!$id) {
            $input = json_decode(file_get_contents('php://input'), true);
            $id = $input['id'] ?? null;
        }

        if (!$id) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Customer id required.']);
            exit;
        }

        $stmt = $pdo->prepare("DELETE FROM customers WHERE id = :id");
        $stmt->execute([':id' => $id]);

        echo json_encode([
            'success' => true,
            'message' => "Customer {$id} deleted successfully."
        ]);
        exit;
    }

    http_response_code(405);
    echo json_encode(['success' => false, 'error' => "Method {$method} not allowed."]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Database connection or query failed: ' . $e->getMessage()
    ]);
}
