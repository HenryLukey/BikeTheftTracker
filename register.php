<?php
    //Open the session
    session_start();
    //Get the info about the bike from the $_POST global and assign it to respective variables
    $mpn = $_POST["mpn"];
    $brand = $_POST["brand"];
    $model = $_POST["model"];
    $type = $_POST["type"];
    $wheelsize = $_POST["wheel_size"];
    $colour = $_POST["colour"];
    $gears = $_POST["gears"];
    $brakes = $_POST["brakes"];
    $suspension = $_POST["suspension"];
    $gender = $_POST["gender"];
    $agegroup = $_POST["age_group"];
    //Get the user_id of the currently logged in user from the $_SESSION variable
    $ownerid = $_SESSION["user_id"];
    //Create a variable called stolen with the value false
    $stolen = false;

    //Create a sql statement that adds a row into the bikes table with the values defined earlier
    $sql = "INSERT INTO tbl_bike(mpn, brand, model, type, wheel_size, colour, gears, brakes, suspension, gender, age_group, ".
            "owner_id, stolen)".
            " values ".
            "('$mpn', '$brand', '$model', '$type', '$wheelsize', '$colour', '$gears', '$brakes', '$suspension', '$gender', ".
            "'$agegroup', '$ownerid', '$stolen')";
    
    //Get access to the code in the config.php file (used to access the database)
    include "config.php";
    
    //Create imageName variable and set it's value to "1.png"
    $imageName = "1.png";
    //Create upload_folder variable and set it's value to "../Bikes/"
    $upload_folder = "../Bikes/";

    //If the query is executed successfully then echo back "Successfully registered"
    if(mysqli_query($connection, $sql)) {
        echo "Successfully registered";
    //Otherwise, echo back the error and return
    } else {
        echo mysqli_error($connection);
        return;
    }

    //Get the id of the row that was just inserted into the database
    $insertedID=mysqli_insert_id($connection);

    //Loop through the contents of the $_FILES variable associated with "images[]" (from the initial $_POST request)
    foreach ($_FILES['images']['name'] as $key=>$file_name){
        //Get the temporary name of each image
        $tmp_name=$_FILES['images']['tmp_name'][$key];
        //Get the extension of the file
        $ext=end(explode(".", $file_name));
        //Create an imageName variable from the insertedID, key, and extension
        $imageName="Bike_".$insertedID."_".$key.".". $ext;
        //Create a sql statement to insert the images into the bike image connecting table using the imageName and insertedID variables
        $sql="insert into tbl_bike_image(bike_id, image_name) VALUES ('$insertedID', '$imageName')";
        //If the query fails then echo back false
        if(!mysqli_query($connection, $sql)){
            echo 'False';
        }
        //Add the image to the the Bikes folder
        move_uploaded_file($tmp_name, $upload_folder.$imageName);
    }
    //Close the connection to the database
    mysqli_close($connection);