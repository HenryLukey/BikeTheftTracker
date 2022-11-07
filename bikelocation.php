<?php
    //Open the session
    session_start();
    //Get the bike id from the session variable
    $id = $_SESSION["bike_id"];
    //SQL state to get the lat and lng values for the given bike
    $sql = "SELECT `lat`, `lng` FROM `tbl_bike` WHERE bike_id='".$id."'";
    //Get access to the code in the config.php file (used to access the database)
    include "config.php";

    //Execute the SQL query and get the result
    $res = mysqli_query($connection, $sql);
    //If there is no result then echo "none"
    if(!$res){
        echo "none";
    }
    //Otherwise loop through all the rows in the result and add them to the rows array
    else {
        $num_row = mysqli_num_rows($res);
        $row = mysqli_fetch_assoc($res);
        
        if($num_row == 1){
            session_start();
            echo json_encode($row);
        } else {
            echo "none";
        }
    }