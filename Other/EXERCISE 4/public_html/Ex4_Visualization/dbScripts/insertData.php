<?php
// Set default timezone
//  date_default_timezone_set('UTC');
//https://www.sqlitetutorial.net/sqlite-foreign-key/
//https://www.techonthenet.com/sqlite/foreign_keys/foreign_keys.php
//** Important:
// we cannot insert into a table if the associated foreign key does NOT exist! */
require('openDB.php');
try {
    /**************************************
    * Create databases and                *
    * open connections                    *
    **************************************/
// ENABLE THE CONSTRAINT...
//The command returns an integer value: 1: enable, 0: disabled. If the command returns nothing, it means that your SQLite version doesn’t support foreign key constraints.

//If the SQLite library is compiled with foreign key constraint support,
//the application can use the PRAGMA foreign_keys command to enable or disable foreign key constraints at runtime.

//PRAGMA:: the code that consists of useful information on how a compiler or interpreter or assembler should process the program - only affects the associated compilers behaviour

    $file_db->exec("PRAGMA foreign_keys = on");

  $queryInsertEvents = array(
     "INSERT INTO events(eventID, eventName,eventDescription) VALUES(1,'walking in a forest','a leisurly pasttime')",
     "INSERT INTO events(eventID, eventName,eventDescription) VALUES(2,'swimming in the ocean','choppy')",
     "INSERT INTO events(eventID, eventName,eventDescription) VALUES(3,'dining with sibling','a long time coming')",
     "INSERT INTO events(eventID, eventName,eventDescription) VALUES(4,'taking a nap with a cat','is it good?')",
     "INSERT INTO events(eventID, eventName,eventDescription) VALUES(5,'watching rain fall though the window','contmplative?')",
     "INSERT INTO events(eventID, eventName,eventDescription) VALUES(6,'reading a comic','dark')",
     "INSERT INTO events(eventID, eventName,eventDescription) VALUES(7,'baking a chocolate cake','mmmm')",
     "INSERT INTO events(eventID, eventName,eventDescription) VALUES(8,'rollerskating','ahhhh')",
     "INSERT INTO events(eventID, eventName,eventDescription) VALUES(9,'reading a comic','dark')",
     "INSERT INTO events(eventID, eventName,eventDescription) VALUES(10,'planting roses','red or white')",
     "INSERT INTO events(eventID, eventName,eventDescription) VALUES(11,'chomping on carrots','crunchy')",
     "INSERT INTO events(eventID, eventName,eventDescription) VALUES(12,'whistling in the wind','pitch')",
     "INSERT INTO events(eventID, eventName,eventDescription) VALUES(13,'walking through a dark tunnel','long')",
     "INSERT INTO events(eventID, eventName,eventDescription) VALUES(14,'sunbathing in the desert','salty')",
     "INSERT INTO events(eventID, eventName,eventDescription) VALUES(15,'visitng a parent for an afternoon','none')",
     "INSERT INTO events(eventID, eventName,eventDescription) VALUES(16,'learning a new programming language','none')",
     "INSERT INTO events(eventID, eventName,eventDescription) VALUES(17,'running up stairs','how many')"
      );
   for($i =0; $i< count($queryInsertEvents); $i++){
     $file_db->exec($queryInsertEvents[$i]);
  }



$days = array('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday');
$weather = array('stormy','raining','sunny','cloudy','clear', 'snowing', 'grey', 'fog');
$moods = array('happy','sad', 'angry','neutral','calm', 'anxious', 'serene','moody','well','hurt');
  $queryInsertData = array();


  for($i=0; $i<1000; $i++)
  {
  $a = rand(0,6);
  $b = rand(0,7);
  $c = rand(0,9);
  $d = rand(0,9);
  $e = rand(1,10);
  $f = rand(1,10);
  $g = rand(1,17);
 $queryInsertData[]="INSERT INTO dataStuff(dataId,day,weather,start_mood, after_mood, after_mood_strength,event_affect_strength,eID)VALUES($i+1,'$days[$a]','$weather[$b]','$moods[$c]','$moods[$d]','$e','$f',$g)";
}


 for($i =0; $i< count($queryInsertData); $i++){
   $file_db->exec($queryInsertData[$i]);
}


  // if we reach this point then all the data has been inserted successfully.
  echo ("INSERTION OF ENTRY into artCollection Table successful");
      // Close file db connection
       $file_db = null;


  }
  catch(PDOException $e) {
    // Print PDOException message
    echo $e->getMessage();
  }
  ?>
