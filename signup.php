<?php
    //If the $_POST global contains a key value pair of phpFunction:create then call the create() function
    if($_POST['phpFunction'] == 'create')
        create();
    
    //Defines a function used to add an account into the database
    function create() {
        //Get the account info from the $_POST global
        $firstname = $_POST["first_name"];
        $lastname = $_POST["last_name"];
        $email = $_POST["email"];
        $accountpassword = $_POST["password"];
        $type = $_POST["type"];
        $forceid = $_POST["force_id"];

        //Create a sql statement to check if table already contains row with given email then 
        $sqlcheck = "SELECT * FROM `tbl_user` WHERE email='".$email."'";
        //Get access to the code in the config.php file (used to access the database)
        include "config.php";
        //Get the result of the sql query being executed
        $res = mysqli_query($connection, $sqlcheck);
        //Get the number of rows in the the $res variable
        $num_row = mysqli_num_rows($res);
        //If there is 1 or more rows then echo "account with that email already exists" and return
        if ($num_row >= 1){
            echo "An account with this email already exists";
            return;
        }
        // Create a new sql statement to add the account information to the table
        $sql = "INSERT INTO tbl_user(first_name, last_name, email, password, account_type, force_id)".
               " values ".
               "('$firstname', '$lastname', '$email', '$accountpassword', '$type', '$forceid')";

        //If the query executes successfully then echo back "successfully registered
        if(mysqli_query($connection, $sql)) {
            echo "Successfully registered";
        //Otherwise, echo back the error and return
        } else {
            echo mysqli_error($connection);
            return;
        }
        //Close the connection
        mysqli_close($connection);     
    }
        