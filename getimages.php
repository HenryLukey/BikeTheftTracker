<?php
    //Get the bike_id value from the given $_POST global
    $id = $_POST["bike_id"];

    //Create a SQL statement to get the image_name values from the bike image connecting table for a given id
    $sql = "SELECT `image_name` FROM `tbl_bike_image` WHERE bike_id='".$id."'";
    //Get access to the code in the config.php file (used to access the database)
    include "config.php";
    //Execute the SQL query and get the result
    $res = mysqli_query($connection, $sql);
    //Create an empty array called names
    $names = array();

    //If there's no result then echo "1.png" (this is the name of a bike icon image used if no images canbe found for a given bike)
    if(!$res){
        echo "1.png";
    }
    //Otherwise: 
    else {
        //add all the rows of the result to the names array
        while($r = mysqli_fetch_assoc($res)){
            $names[] = $r;
        }
        //If there's no rows then echo "1.png"
        if (count($names) == 0){
            echo "1.png";
        //If there are rows, then encode them into JSON format and echo them back
        } else {
            echo json_encode($names);
        }
    }