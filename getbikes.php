<?php
    //Open the session so $_SESSION can be accessed
    session_start();

    //Get the account type from the session global variable
    $type = $_SESSION["account_type"];
    
    //If the account type is a user then get the user_id value and use it to create a SQL statement to get
    //all the bikes belonging to that user
    if ($type == "user"){
        $id = $_SESSION["user_id"];
        $sql = "SELECT * FROM `tbl_bike` WHERE owner_id='".$id."'";
    }
    //If it's a police or admin account then create a sql statement to get all the bikes that are registered as stolen
    else if ($type == "admin" or $type == "police"){
        $sql = "SELECT * FROM `tbl_bike` WHERE stolen='1'";
    }
    
    //Get access to the code in the config.php file (used to access the database)
    include "config.php";
    //Execute the SQL query and get the result
    $res = mysqli_query($connection, $sql);
    //Get the number of rows in the result of the query
    $num_rows = mysqli_num_rows($res);
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
        //If there are rows then add 2 key value pairs: account type (with the type variable), and number of bikes (number of rows)
        } else {
            $rows["account_type"] = $type;
            $rows["num_of_bikes"] = $num_rows;
            //Encode the rows variable to JSON format and echo it back
            echo json_encode($rows);
        }
    }

    