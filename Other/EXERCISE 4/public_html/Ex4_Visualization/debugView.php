<?php
require('dbScripts/openDB.php');
try {

$myStr="SELECT * FROM dataStuff";
$myStrTwo="SELECT day,weather, COUNT(*) FROM dataStuff GROUP BY day";
$result = $file_db->query($myStrTwo);

if (!$result) die("Cannot execute query.");
while($row = $result->fetch(PDO::FETCH_ASSOC))
{
  var_dump($row);

foreach ($row as $key=>$entry)
{

 echo "<p>".$key." :: ".$entry."</p>";
}

}//end while


}

catch(PDOException $e) {
  // Print PDOException message
  echo $e->getMessage();

}
exit;
  ?>
