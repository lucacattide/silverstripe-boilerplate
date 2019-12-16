<?php
  // TODO: Replace email
  define('EMAIL', 'info@lucacattide.dev');
  define('SUBJECT', 'CSP violation');

  http_response_code(204);

  $data = file_get_contents('php://input');

  // Data Check
  if ($data = json_decode($data)) {
	  $data = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

  	@mail(EMAIL, SUBJECT, $data, 'Content-Type: text/plain;charset=utf-8');
  }
?>
