<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once 'config.php';

$request_uri = trim($_SERVER['REQUEST_URI'], '/');
$url = RANDOM;
$resp = file_get_contents($url);

echo json_encode($resp);
?>