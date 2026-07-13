<?php

// Define Host Info || Who is sending emails?
define("HOST_NAME", "Мій Курс");
define("HOST_EMAIL", "logist@myroute.com.ua");

// Define Recipent Info ||  Who will get this email?
define("RECIPIENT_NAME", "Мій курс");
define("RECIPIENT_EMAIL", "vdutik@gmail.com");

// Запис даних в файл
$filename = 'form_data.txt';

$name = isset($_POST['name']) ? trim(htmlspecialchars($_POST['name'])) : '';
$email = isset($_POST['email']) ? trim(htmlspecialchars($_POST['email'])) : '';
$phone = isset($_POST['Phone']) ? trim(htmlspecialchars($_POST['Phone'])) : '';
$message = isset($_POST['message']) ? trim(htmlspecialchars($_POST['message'])) : '';
$honeypot = isset($_POST['website']) ? $_POST['website'] : ''; // Honeypot поле для визначення ботів

// Обов'язкові поля — не відправляємо лист із порожніми даними
$required_empty = array();
if ($name === '') $required_empty[] = "Ім'я";
if ($email === '') $required_empty[] = "Email";
if ($phone === '') $required_empty[] = "Телефон";
if ($message === '') $required_empty[] = "Повідомлення";
if (!empty($required_empty)) {
    echo "<div class='inner error'><p class='error'>Будь ласка, заповніть усі обов'язкові поля: " . implode(', ', $required_empty) . ".</p></div><!-- /.inner -->";
    exit;
}

// Перевіряємо honeypot поле - якщо воно заповнене, це бот
if (!empty($honeypot)) {
    echo "<div class='inner success'><p class='success'>Дякуємо за ваше повідомлення. Ми зв'яжемося з вами якнайшвидше!</p></div><!-- /.inner -->";
    exit;
}

// Збір даних про відправника (IP, браузер, пристрій, ОС тощо)
function getClientIp() {
    if (!empty($_SERVER['HTTP_CLIENT_IP'])) return $_SERVER['HTTP_CLIENT_IP'];
    if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) return trim(explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'])[0]);
    return isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : '—';
}
function parseUserAgent($ua) {
    if (empty($ua)) return array('browser' => '—', 'os' => '—', 'device' => '—');
    $browser = '—';
    if (preg_match('/Edge\/\d+/i', $ua)) $browser = 'Microsoft Edge';
    elseif (preg_match('/Edg\/\d+/i', $ua)) $browser = 'Microsoft Edge (Chromium)';
    elseif (preg_match('/Chrome\/\d+/i', $ua) && !preg_match('/Chromium|Edg/i', $ua)) $browser = 'Chrome';
    elseif (preg_match('/Firefox\/\d+/i', $ua)) $browser = 'Firefox';
    elseif (preg_match('/Safari\/\d+/i', $ua) && !preg_match('/Chrome/i', $ua)) $browser = 'Safari';
    elseif (preg_match('/OPR\/\d+/i', $ua)) $browser = 'Opera';
    $os = '—';
    if (preg_match('/Windows NT 10/i', $ua)) $os = 'Windows 10/11';
    elseif (preg_match('/Windows NT/i', $ua)) $os = 'Windows';
    elseif (preg_match('/Android/i', $ua)) $os = 'Android';
    elseif (preg_match('/iPhone|iPad|iPod/i', $ua)) $os = 'iOS';
    elseif (preg_match('/Mac OS X/i', $ua)) $os = 'macOS';
    elseif (preg_match('/Linux/i', $ua)) $os = 'Linux';
    $device = (preg_match('/Mobile|Android|iPhone|iPad|iPod/i', $ua)) ? 'Мобільний' : 'Десктоп';
    return array('browser' => $browser, 'os' => $os, 'device' => $device);
}

$client_ip = getClientIp();
$user_agent = isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : '—';
$parsed_ua = parseUserAgent($user_agent);
$referer = isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : '—';
$accept_lang = isset($_SERVER['HTTP_ACCEPT_LANGUAGE']) ? $_SERVER['HTTP_ACCEPT_LANGUAGE'] : '—';
$request_uri = isset($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : '—';
$request_method = isset($_SERVER['REQUEST_METHOD']) ? $_SERVER['REQUEST_METHOD'] : '—';

$sender_info_text = "Дані відправника:\n";
$sender_info_text .= "IP: $client_ip\n";
$sender_info_text .= "Браузер: {$parsed_ua['browser']}\n";
$sender_info_text .= "ОС: {$parsed_ua['os']}\n";
$sender_info_text .= "Пристрій: {$parsed_ua['device']}\n";
$sender_info_text .= "User-Agent: $user_agent\n";
$sender_info_text .= "Мова: $accept_lang\n";
$sender_info_text .= "Звідки перейшов (Referer): $referer\n";
$sender_info_text .= "URI запиту: $request_uri\n";
$sender_info_text .= "Метод: $request_method\n";

$data = "Ім'я: $name\n";
$data .= "Email: $email\n";
$data .= "Телефон: $phone\n";
$data .= "Повідомлення: $message\n";
$data .= "Час: " . date('Y-m-d H:i:s') . "\n";
$data .= $sender_info_text;
$data .= "-----------------------------\n";

file_put_contents($filename, $data, FILE_APPEND | LOCK_EX);

// Відправляємо email, якщо це не бот
$to = RECIPIENT_EMAIL;
$subject = "Нове повідомлення від $name з сайту МІЙ КУРС";

// Заголовки листа
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= "From: " . HOST_NAME . " <" . HOST_EMAIL . ">" . "\r\n";
$headers .= "Reply-To: $email" . "\r\n";

// HTML-вміст листа
$email_content = "
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 5px;
        }
        h2 {
            color: #2196F3;
            border-bottom: 2px solid #eee;
            padding-bottom: 10px;
        }
        .field {
            margin-bottom: 15px;
        }
        .label {
            font-weight: bold;
            display: inline-block;
            width: 100px;
        }
        .footer {
            margin-top: 30px;
            font-size: 12px;
            color: #777;
            text-align: center;
        }
        .sender-info {
            margin-top: 20px;
            padding: 15px;
            background: #f5f5f5;
            border-radius: 5px;
            font-size: 13px;
        }
        .sender-info h3 {
            margin: 0 0 10px 0;
            font-size: 14px;
            color: #2196F3;
        }
    </style>
</head>
<body>
    <div class='container'>
        <h2>Нове повідомлення з сайту МІЙ КУРС</h2>
        <div class='field'>
            <span class='label'>Ім'я:</span> $name
        </div>
        <div class='field'>
            <span class='label'>Email:</span> $email
        </div>
        <div class='field'>
            <span class='label'>Телефон:</span> $phone
        </div>
        <div class='field'>
            <span class='label'>Повідомлення:</span>
            <p>" . nl2br($message) . "</p>
        </div>
        <div class='sender-info'>
            <h3>Дані відправника</h3>
            <div class='field'><span class='label'>IP:</span> " . htmlspecialchars($client_ip) . "</div>
            <div class='field'><span class='label'>Браузер:</span> " . htmlspecialchars($parsed_ua['browser']) . "</div>
            <div class='field'><span class='label'>ОС:</span> " . htmlspecialchars($parsed_ua['os']) . "</div>
            <div class='field'><span class='label'>Пристрій:</span> " . htmlspecialchars($parsed_ua['device']) . "</div>
            <div class='field'><span class='label'>Мова:</span> " . htmlspecialchars($accept_lang) . "</div>
            <div class='field'><span class='label'>Referer:</span> " . htmlspecialchars($referer) . "</div>
            <div class='field'><span class='label'>User-Agent:</span> " . htmlspecialchars($user_agent) . "</div>
            <div class='field'><span class='label'>URI:</span> " . htmlspecialchars($request_uri) . "</div>
        </div>
        <div class='footer'>
            Повідомлення надіслано " . date('d.m.Y H:i:s') . "
        </div>
    </div>
</body>
</html>
";

// Відправляємо лист
$mail_sent = mail($to, $subject, $email_content, $headers);

if ($mail_sent) {
    echo "<div class='inner success'><p class='success'>Дякуємо за ваше повідомлення. Ми зв'яжемося з вами якнайшвидше!</p></div><!-- /.inner -->";
} else {
    // Записуємо помилку в лог, але користувачу показуємо успішне відправлення
    $error_log = "Помилка відправки на email: " . date('Y-m-d H:i:s') . "\n";
    file_put_contents('mail_errors.log', $error_log, FILE_APPEND | LOCK_EX);
    echo "<div class='inner success'><p class='success'>Дякуємо за ваше повідомлення. Ми зв'яжемося з вами якнайшвидше!</p></div><!-- /.inner -->";
}