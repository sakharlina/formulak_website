<?php
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST');

    if ($_SERVER['REQUEST_METHOD'] != 'POST') {
        http_response_code(405);
        $result = [
            'success' => false,
            'message' => 'Для отправки данных поддерживается только метод POST'
        ];
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
        die();
    }

    $name = filter_var($_POST["user-name"], FILTER_SANITIZE_STRING);
    $phone = filter_var($_POST["user-phone"], FILTER_SANITIZE_STRING);

    if (empty($name) || empty($phone)) {
        http_response_code(400);
        $result = [
            'success' => false,
            'message' => 'Имя и номер телефона обязательны к заполнению'
        ];
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
        die();
    }

    if (!preg_match('/^\+7(?=[\s\-()]*[0-9])[\s\-()0-9]{10,}$/', $phone)) {
        http_response_code(400);
        $result = [
            'success' => false,
            'message' => 'Проверьте корректность введенного номера телефона'
        ];
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
        die();
    }

    $env = parse_ini_file(__DIR__ . '/.env');
    $botToken = $env['TELEGRAM_BOT_TOKEN'];
    $chatId = $env['TELEGRAM_CHAT_ID'];
    $message = "На сайте ФормулаК оставлена новая заявка:\nИмя: $name\nТелефон: $phone";
    
    $telegramUrl = "https://api.telegram.org/bot{$botToken}/sendMessage";
    $telegramData = [
        'chat_id' => $chatId,
        'text' => $message,
        'parse_mode' => 'HTML'
    ];
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $telegramUrl);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $telegramData);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $telegramResponse = curl_exec($ch);
    curl_close($ch);

    $result = [
        'success' => true,
        'message' => 'OK'
    ];
    echo json_encode($result, JSON_UNESCAPED_UNICODE);
?>