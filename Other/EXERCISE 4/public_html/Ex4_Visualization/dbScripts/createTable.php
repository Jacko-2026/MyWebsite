<?php
// Set default timezone
require('openDB.php');
try {
    /**************************************
    * Create tables            *
    /**************************************/

        $file_db->exec("PRAGMA foreign_keys = on");

   $theQuery = 'CREATE TABLE IF NOT EXISTS events (
     eventID INTEGER PRIMARY KEY NOT NULL,
     eventName TEXT,
     eventDescription TEXT)';
   $file_db ->exec($theQuery);


//FOREIGN KEY (uID) REFERENCES users(userID)
// specify that it is a foreign key AND specify where it comes from (LINK)
   $theQueryT = 'CREATE TABLE IF NOT EXISTS dataStuff (
     dataId INTEGER PRIMARY KEY NOT NULL,
     day TEXT,
     weather TEXT,
     start_mood TEXT,
     after_mood TEXT,
     after_mood_strength TEXT,
     event_affect_strength TEXT,
     eID INTEGER,
    FOREIGN KEY (eID) REFERENCES events(eventID))';
    $file_db ->exec($theQueryT);

      // Close file db connection
       $file_db = null;


  }
  catch(PDOException $e) {
    // Print PDOException message
    echo $e->getMessage();
  }
  ?>
