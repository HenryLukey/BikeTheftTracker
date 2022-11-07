<?php
    //Open the session so the $_SESSION variable can be accessed
    session_start();

    //Get the lat and lng values from the given $_POST request
    $lat = $_POST["lat"];
    $lng = $_POST["lng"];
    //Get the bike id from the session
    $id = $_SESSION["bike_id"];
    //Create a "stolen" variable and set it to true
    $stolen = true;

    //Create a sql statement to update a given bike (using it's id) with lat + lng values and set stolen to be true
    $sql = "UPDATE `tbl_bike` SET lat='".$lat."', lng='".$lng."', stolen='".$stolen."' WHERE bike_id='".$id."'";

    //Get access to the code in the config.php file (used to access the database)
    include "config.php";

    //If the sql query is executed then echo back "success"
    if(mysqli_query($connection, $sql)) {
        echo "success";
    //Otherwise, echo back with the given error message
    } else {
        echo mysqli_error($connection);
    }