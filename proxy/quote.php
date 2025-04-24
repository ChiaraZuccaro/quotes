<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once 'config.php';
$code = 500;
$error = true;
$result = null;
$message = 'Generic error';

$request_uri = trim($_SERVER['REQUEST_URI'], '/');

$uriParts = explode('?', $request_uri, 2);
$path = $uriParts[0];
$queryString = $uriParts[1] ?? '';

$segments = explode('/', $path);

$keyUrl = $segments[1];

if(isset($urlConfigs[$keyUrl])) {
  $url = $urlConfigs[$keyUrl];

  if (!empty($queryString)) {
    $separator = strpos($url, '?') === false ? '?' : '&';
    $url .= $separator . $queryString;
  }

  $contextOptions = [
    "ssl" => [
      "verify_peer"      => false,
      "verify_peer_name" => false,
    ]
  ];

  $context = stream_context_create($contextOptions);
  $resProv = file_get_contents($url, false, $context);
  // TODO manage case api fails
  $result = json_decode($resProv);
  $code = 200;
  $message = 'Everything went good!';
  $error = false;
} else {
  $code = 404;
  $result = $segments[1] . ' property not valid!';
}


$response = [
  'error' => $error,
  'code' => $code,
  'message' => $message,
  'result' => $result
];

echo json_encode($response);
?>