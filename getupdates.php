<?php
    //Open the session so $_SESSION can be accessed
    session_start();
    
    //If the the session has a bike id then create a sql statement to get all the updates related to that bike
    if (isset($_SESSION["bike_id"])){
        //Get the bike id from the session global variable
        $id = $_SESSION["bike_id"];
        $sql = "SELECT `investigation_update` FROM `tbl_investigation` WHERE bike_id='".$id."'";

        //Get access to the code in the config.php file (used to access the database)
        include "config.php";
        //Execute the SQL query and get the result
        $res = mysqli_query($connection, $sql);
        //Create an empty array called rows
        $rows = array();

        //If there's no result then echo "none" back
        if(!$res){
            echo "none";
        }
        //Otherwise loop through the result, adding all the rows to the rows array
        else {
            while($r = mysqli_fetch_assoc($res)){
                $rows[] = $r;
            }

            //If there are no rows then echo "none" back
            if (count($rows) == 0){
                echo "none";
            //If there are rows then encode the rows variable to JSON format and echo it back
            } else {
                echo json_encode($rows);
            }
        }
    }
    
    