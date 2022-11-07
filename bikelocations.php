<?php
    //SQL state to get the lat and lng values for all the stolen bikes
    $sql = "SELECT `lat`, `lng` FROM `tbl_bike` WHERE stolen='1'";
    //Get access to the code in the config.php file (used to access the database)
    include "config.php";

    //Execute the SQL query and get the result
    $res = mysqli_query($connection, $sql);
    //Initialise an empty array
    $rows = array();

    //If there is no result then echo "none"
    if(!$res){
        echo "none";
    }
    //Otherwise loop through all the rows in the result and add them to the rows array
    else {
        while($r = mysqli_fetch_assoc($res)){
            $rows[] = $r;
        }
        //Encode the rows into JSON format and echo it back
        echo json_encode($rows);
    }