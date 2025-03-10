<?php

// Define Host Info || Who is sending emails?
define("HOST_NAME", "Мій Курс");
define("HOST_EMAIL", "logist@myroute.com.ua");

// Define Recipent Info ||  Who will get this email?
define("RECIPIENT_NAME", "Мій курс");
define("RECIPIENT_EMAIL", "vdutik@gmail.com");

// Запис даних в файл
$filename = 'form_data.txt';

$name = isset($_POST['name']) ? htmlspecialchars($_POST['name']) : '';
$email = isset($_POST['email']) ? htmlspecialchars($_POST['email']) : '';
$phone = isset($_POST['Phone']) ? htmlspecialchars($_POST['Phone']) : '';
$message = isset($_POST['message']) ? htmlspecialchars($_POST['message']) : '';
$honeypot = isset($_POST['website']) ? $_POST['website'] : ''; // Honeypot поле для визначення ботів

$data = "Ім'я: $name\n";
$data .= "Email: $email\n";
$data .= "Телефон: $phone\n";
$data .= "Повідомлення: $message\n";
$data .= "Час: " . date('Y-m-d H:i:s') . "\n";
$data .= "-----------------------------\n";

// Записуємо дані в файл в будь-якому випадку
file_put_contents($filename, $data, FILE_APPEND | LOCK_EX);

// Перевіряємо honeypot поле - якщо воно заповнене, це бот
if (!empty($honeypot)) {
    // Це бот, повертаємо успішну відповідь, але нічого не відправляємо
    echo "<div class='inner success'><p class='success'>Дякуємо за ваше повідомлення. Ми зв'яжемося з вами якнайшвидше!</p></div><!-- /.inner -->";
    exit;
}

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