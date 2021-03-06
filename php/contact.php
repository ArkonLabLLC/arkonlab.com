<?php
// Turn off all error reporting
error_reporting(0);
set_time_limit(15); // Die pretty quickly
$MAX_BODY_CHAR = 4000; // About 500 words. This needs to match the HTML.

// header('Access-Control-Allow-Origin: *');
// header('Access-Control-Allow-Methods: POST');
// header('Access-Control-Allow-Headers: Origin, Content-Type');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  die('failure');
}

require 'config.php';
require 'phpmailer/src/Exception.php';
require 'phpmailer/src/PHPMailer.php';
require 'phpmailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;

$mail = new PHPMailer;

if ($useSMTP) {
  $mail->isSMTP();
  // 0 No output (for production use)
  // 1 Commands
  // 2 Data and commands
  // 3 As 2 plus connection status
  // 4 Low-level data output
  $mail->SMTPDebug = 0;

  // Login
  $mail->Host = $server;
  $mail->Port = $port;
  $mail->SMTPAuth = true;
  $mail->SMTPSecure = 'tls';
  $mail->Username = $username;
  $mail->Password = $password;
} else {
  $mail->isMail();
}

//Set who the message is to be sent from
$mail->setFrom($username, 'Arkon Lab Contact Form');
$mail->clearReplyTos();
foreach ($sendTo as $addr) {
  $mail->addAddress($addr);
  $mail->addReplyTo($addr);
}

date_default_timezone_set('America/New_York');
$mail->Subject = 'Arkon Lab Contact Form on ' . date('c');

$mail->Body = '' .
  'Name: ' . htmlspecialchars($_POST['name']) . "\n" .
  'Email: ' . htmlspecialchars($_POST['email']) . "\n" .
  "\n" . htmlspecialchars(substr($_POST['message'], 0, $MAX_BODY_CHAR));

// Send it!
die($mail->send() ? 'ok' : 'fail');
