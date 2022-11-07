<?php
    //Open the session (the session can't be destroyed if it isn't active)
    session_start();
    //Destroy the session (this removes all the variables in the $_SESSION variable, therefore logging out the user)
    session_destroy();

    //Echo back with a message saying "logged out"
    echo "logged out";