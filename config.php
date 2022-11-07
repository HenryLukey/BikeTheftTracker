<?php
    //Set the details used to access the database
    $servername = "localhost";
    $username = "s4105645_user";
    $password = "~9vV09jy";
    $dbname = "s4105645_bike_theft_db";

    //Create a connection to the mysql database
    $connection = new mysqli($servername, $username, $password, $dbname);

    //If the connection fails to be created then echo that there's a problem
    if (!$connection)
    {
        echo "Error: Could not access the database";
    }
