<?php
    //Open the session so $_SESSION can be accessed
    session_start();

    //Check if there is a bike id in the session global variable, if there is then echo it back
    if(isset($_SESSION["bike_id"]))
    {
        echo $_SESSION["bike_id"];
    }
    //Otherwise respond with the view-bikes html file (so the javascript can redirect to this file)
    else
    {
        echo "view-bikes.html";
    }