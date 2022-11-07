<?php
    //If the $_POST global has a phpFunction key that is "login" then call the login() function
    if(isset($_POST["phpFunction"])) {
        if($_POST["phpFunction"]=="login"){
            login();
        }
    }

    //Defines a function used to check if given login details match those existing in the database
    function login(){
        //Get the email and password values from the $_POST global and assign them to their own variables
        $email = $_POST["email"];
        $password = $_POST["password"];

        //Create a sql statement that gets the id, firstname, lastname and account type details from the user table
        //based on a given email and password
        $sql = "SELECT `user_id`, `first_name`, `last_name`, `account_type` FROM `tbl_user` WHERE email='".$email."' AND password='".$password."'";
        //Get access to the code in the config.php file (used to access the database)
        include "config.php";

        //Get the result of the sql query being executed
        $res = mysqli_query($connection, $sql);
        //Get the number of rows in the result of the query
        $num_row = mysqli_num_rows($res);
        //Get the row from the result of the query
        $row = mysqli_fetch_assoc($res);
        
        //If there's one row in the result then:
        if($num_row == 1){
            //Start a session
            session_start();
            //Encode the row and echo it back
            echo json_encode($row);
            //Create key value pairs for the user_id, account_type, email, firstname, and lastname in the $_SESSION global
            $_SESSION["user_id"] = $row["user_id"];
            $_SESSION["account_type"] = $row["account_type"];
            $_SESSION["email"] = $email;
            $_SESSION["firstname"] = $row["first_name"];
            $_SESSION["lastname"] = $row["last_name"];
        //If there isn't 1 row then echo back result = false in json format
        } else {
            echo '{"result": "false"}';
        }
    }