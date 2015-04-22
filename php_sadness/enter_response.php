<html>
<body>
<?php
session_start();

// if there is anything in the session field, we'll display it as an error.
if (array_key_exists('survey_error', $_SESSION)) {
  if (!empty($_SESSION['survey_error']) or strlen($_SESSION['survey_error']) > 0) {
    echo $_SESSION['survey_error'];
  }
}

function writeSelect($id, $label, $opts) {
  echo "<select form=\"response\" name=\"$id\" id=\"$id\" required=\"true\">";
  foreach ($opts as $name => $value) {
    echo "  <option value=\"" . $value . "\">" . $name . "</option>";
  }
  echo "</select>";
  echo "<br><br><br>";
}

?>

<h1>Respond to the survey, person!</h1>
<form id="response" method="post" action="submit_response.php">

<?php 
writeSelect('color', 'Preferred color: ', array("red" => 1, "blue" => 2));
writeSelect('number', 'Preferred number: ', array(1 => 1, 2 => 2));
?>

<input type="submit">
</form>
<br><a href="show_results.php">back to response list</a>
</body>
</html>