<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");

    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        http_response_code(204);
        exit();
    }

    $host = 'localhost';
    $dbname = 'p95264ke_formula';
    $username = 'p95264ke_formula';
    $password = 'nC4q60YZh&oj';

    try {
        $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]);
        
        $stmt = $pdo->query("SELECT AVG(rating) as average FROM feedbacks");
        $average = $stmt->fetchColumn();
        $averageRating = $average ? round($average, 1) : 5.0; // Значение по умолчанию 5.0
        
        $formattedRating = number_format($averageRating, 1, ',', '');

        if (isset($_GET['rating_only'])) {
            echo json_encode([
                'success' => true,
                'averageRating' => $formattedRating
            ]);
            exit();
        }
        
        $input = json_decode(file_get_contents('php://input'), true);
        $offset = isset($input['offset']) ? max(0, (int)$input['offset']) : 0;
        $limit = 3;
        
        $stmt = $pdo->prepare("SELECT * FROM feedbacks ORDER BY date DESC LIMIT :limit OFFSET :offset");
        $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        $feedbacks = $stmt->fetchAll();
        
        $stmt = $pdo->query("SELECT COUNT(*) FROM feedbacks");
        $total = $stmt->fetchColumn();
        
        echo json_encode([
            'success' => true,
            'feedbacks' => $feedbacks,
            'averageRating' => $formattedRating,
            'hasMore' => ($offset + $limit) < $total
        ]);
        
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Database error: ' . $e->getMessage()
        ]);
    }
?>