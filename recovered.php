<?php
    //Open the session
    session_start();
    //Create a variable called stolen with the value false
    $stolen = false;

    //If the $_SESSION global has a bike_id value set then:
    if (isset($_SESSION["bike_id"])){
        //Get the bike_id and assign it to $id
        $id = $_SESSION["bike_id"];
        //Create a sql statement that updates the "stolen" field in the bike table to be false for the bike of the given id
        $sql = "UPDATE `tbl_bike` SET stolen='".$stolen."' WHERE bike_id='".$id."'";

        //Get access to the code in the config.php file (used to access the database)
        include "config.php";

        //If the sql query is executed then:
        if(mysqli_query($connection, $sql)) {
            //Create a new sql statement to delete all rows in the investigation table that have the given bike id
            $deletesql = "DELETE FROM `tbl_investigation` WHERE bike_id='".$id."'";
            //If the sql query is executed then echo back "success"
            if(mysqli_query($connection, $deletesql)){
                echo "success";
            //Otherwise echo back an error message
            } else {
                echo "marked as not stolen but could not remove investigation updates";
            }
        //Otherwise echo back an error message
        } else {
            echo "could not update bike";
        }
    //Otherwise echo back an error message
    } else {
        echo "could not update bike";
    }