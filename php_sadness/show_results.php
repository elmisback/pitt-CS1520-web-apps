<html>
<body>
<?php

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
//$conn = new mysqli("localhost", "", "", "test");
if ($conn->connect_error) {
  echo "There is a problem connecting to DB.";
} else {

  // once we've connected we'll retrieve the data from the DB.
  $sql = "SELECT c_color, c_number FROM t_responses";
  $result = $conn->query($sql);
  
  // the num_rows property identifies how many records were returned by the query.
  if ($result->num_rows > 0) {
    $n_reds = 0;
    $n_blues = 0;
    $n_ones = 0;
    $n_twos = 0;
    // for each result, we'll need to retrieve the underlying values.
    // when there are no more records, this will return null.
    while ($row = $result->fetch_assoc()) {
      if ($row['c_color'] == 1) {
          $n_reds = $n_reds + 1;
      } else if ($row['c_color'] == 2) {
          $n_blues = $n_blues + 1;
      }
      
      if ($row['c_number'] == 1) {
          $n_ones += 1;
      } else if ($row['c_number'] == 2) {
          $n_twos += 1;
      }
    }
    echo "People who prefer red: " . $n_reds . "<br>";
    echo "People who prefer blue: " . $n_blues . "<br>";
    echo "People who prefer one: " . $n_ones . "<br>";
    echo "People who prefer two: " . $n_twos . "<br>";
    echo "<br><br><br>";
  } else {
    echo "There are no results.";
  }
}

$conn->close();

?>
<a href="enter_response.php">post a new survey response</a>
</body>
</html>