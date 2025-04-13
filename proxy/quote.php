<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once 'config.php';
$code = 500;
$error = true;
$result = null;

$request_uri = trim($_SERVER['REQUEST_URI'], '/');
$segments = explode('/', $request_uri);
$keyUrl = $segments[1];

if(isset($urlConfigs[$keyUrl])) {
  $url = $urlConfigs[$keyUrl];

  $contextOptions = [
    "ssl" => [
      "verify_peer"      => false,
      "verify_peer_name" => false,
    ]
  ];

  $context = stream_context_create($contextOptions);
  $resProv = file_get_contents($url, false, $context);

  $result = json_decode($resProv);
  $code = 200;
  $error = false;
} else {
  $code = 404;
  $result = $segments[1] . ' property not valid!';
}


$response = [
  'error' => $error,
  'code' => $code,
  'result' => $result
];

echo json_encode($response);
?>