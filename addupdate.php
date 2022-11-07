<?php
    //Open the session
    session_start();
    
    //Check if the bike_id value has been set in the session
    if (isset($_SESSION["bike_id"])){
        //Get the value of bike_id and store it in a variable
        $id = $_SESSION["bike_id"];
        //Get the update text from the $_POST global
        $update = $_POST["update"];
        //Create a new SQL statement used to add a row into the investigation table using the $id and $update variables
        $sql = "INSERT INTO tbl_investigation(bike_id, investigation_update)".
        " values ".
        "('$id', '$update')";

        //Get access to the code in the config.php file (used to access the database)
        include "config.php";

        //If the mysqli_query works then echo "success" back
        if(mysqli_query($connection, $sql)) {
            echo "success";
        //Otherwise echo the error
        } else {
            echo mysqli_error($connection);
            return;
        }
    //If the $_SESSION has no bike_id then return "failed to add update"
    } else {
        echo "failed to add update";
    }
    