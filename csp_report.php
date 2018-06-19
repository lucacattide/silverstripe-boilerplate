<?php
  // TODO: Sostituire email
  define('EMAIL', 'l.cattide@email.it');
  define('SUBJECT', 'CSP violation');

  http_response_code(204);

  $dati = file_get_contents('php://input');

  // Controllo dati
  if ($dati = json_decode($dati)) {
	  $dati = json_encode($dati, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

  	@mail(EMAIL, SUBJECT, $dati, 'Content-Type: text/plain;charset=utf-8');
  }
?>
