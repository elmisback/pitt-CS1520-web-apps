<?php
session_start();
function log_error($message) {
  if (empty($_SESSION['survey_error'])) {
    $_SESSION['survey_error'] = '';
  }
  $_SESSION['survey_error'] .= $message . "<br>";
}
# We'll clear the errors first.
$_SESSION['survey_error'] = '';

# This will set the variables to the posted parameters.
$color = $_POST['color'];
$number = $_POST['number'];

// we'll connect to the database here.

// cloud 9
// let's establish a connection.
$servername = getenv('IP');
$username = getenv('C9_USER');
$password = "";
$database = "c9";
$dbport = 3306;

// Create connection
$conn = new mysqli($servername, $username, $password, $database, $dbport);
// cloud 9

// localhost
//$conn = mysqli_connect("localhost", "", "", "test");
if ($conn->connect_error) {
  log_error("can't connect to db. abandon all hope ye who enter here");
} else {
  // We're going to use a prepared statement, because it's a bit safer.
  // If there are no database errors, we'll create a prepared statement.
  $statement = $conn->prepare("INSERT INTO t_responses (c_color, c_number) VALUES (?,?)");

  /*
  Note that we could also create a regular statement, but then we'd need to 
  handle the escaping of our text values so that we'd avoid SQL injection attacks.
  It's also worth noting that we're not doing anything to prevent JavaScript 
  attacks - a user could very easily insert JavasScript and have it display on the page.
  */
  
  // we bind these parameters so that we can execute the statement.
  // the "ssis" identifies string, string, integer, string.
  $statement->bind_param("ii", $a, $b);
  
  $a = $color;
  $b = $number;
  
  $statement->execute();
}

$conn->close();

// If there are no errors, we'll go back to the "show messages" screen.
if (!empty($_SESSION['survey_error']) and strlen($_SESSION['survey_error']) > 0) {
  header('location:enter_response.php');
} else {
  header('location:show_results.php');
}

