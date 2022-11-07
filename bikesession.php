<?php
    //Open the session so $_SESSION can be accessed
    session_start();

    //Get the bike id from the given $_POST variable
    $bike_id = $_POST["bike_id"];
    //Add the bike id to the $_SESSION global variable
    $_SESSION["bike_id"] = $bike_id;

    //Respond with "success" if setting the value was successful
    if(isset($_SESSION["bike_id"])){
        echo "success";
    }