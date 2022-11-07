<?php
    //Open the session
    session_start();

    //If the session has an account_type value then echo that account_type back (essentially used to see if a user is logged in)
    if(isset($_SESSION["account_type"]))
    {
        echo $_SESSION["account_type"];
    }
    //If not, echo back "index.html" (the file to be redirected to, because users must be logged in to use the site)
    else
    {
        echo "index.html";
    }