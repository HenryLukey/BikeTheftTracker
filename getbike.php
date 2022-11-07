<?php
    //Get the bike_id from the superglobal $_POST and store it in a variable called id
    $id = $_POST["bike_id"];

    //Make a sql statement to get all the info on a bike from the bike table based on the given bike_id
    $sql = "SELECT * FROM `tbl_bike` WHERE bike_id='".$id."'";
    //Get access to the code in the config.php file (used to access the database)
    include "config.php";

    //Get the result of the sql query being executed
    $res = mysqli_query($connection, $sql);

    //If there's no result then echo "none" back
    if(!$res){
        echo "none";
    }

    //Get the number of rows in the result of the query
    $num_row = mysqli_num_rows($res);
    //Get the row from the result of the query
    $row = mysqli_fetch_assoc($res);
    
    //If there's one row in the result then encode the row and echo it back
    if($num_row == 1){
        echo json_encode($row);
    //Otherwise echo back "none"
    } else {
        echo "none";
    }