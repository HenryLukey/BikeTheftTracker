// Create a global variable called imageList and set it to be an empty array
var imageList = [];

// Defines a function used to change the text below the form title (it is blank by default)
function setFormMessage(formElement, type, message)
{
    // Use the querySelector get get the form__message element from the passed formElement
    const messageElement = formElement.querySelector(".form__message");

    // Set the messageElements text to be equal to the passed message
    messageElement.textContent = message;
    // Remove the form__message--success and form__message--error classes from the element, thus resetting it
    // then use the passed type to add a new form__message--type which will be either error or success
    messageElement.classList.remove("form__message--success", "form__message--error");
    messageElement.classList.add(`form__message--${type}`);
}

// Defines a function that is used to change the text of the error messages below form input fields
function setInputError(inputElement, message)
{
    // Associate the given inputElement with the form__input--error class so it gets the relevant formatting
    inputElement.classList.add("form__input--error");
    // Use the querySelector to get the error message element and change its content to the passed message
    inputElement.parentElement.querySelector(".form__input-error-message").textContent = message;
}

// Define a function that is used to reset error messages below input fields to be blank
function clearInputError(inputElement)
{
    // Remove the "form__input--error" class from the input field to reset its formatting to normal
    inputElement.classList.remove("form__input--error");
    // Use the querySelector to get the error message element and change its text to be blank
    inputElement.parentElement.querySelector(".form__input-error-message").textContent = "";
}

// Defines a function to check if a string meets the password requirements of having at least:
// 8 characters, 1 number, 1 uppercase letter, 1 lowercase letter
function checkPasswordStrength(password)
{
    // Makes a new Regex pattern which checks if there is 1 or more lowercase letter, 1 or more uppercase letter,
    // and 1 or more digit
    const regexPattern = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)");

    // Tests the passed password value against the previously defined regular expression pattern and returns true
    // or false respectively to the result
    if (regexPattern.test(password)){
        return true;
    } else {
        return false;
    }
}

// Define a function to log out of the currently logged in account by ending the session
function logout()
{
    // Perform an ajax request to the logout.php file
    $.ajax({
        type: "POST",
        url: "logout.php",
        // If the request is successful then redirect to the index (login / register) page
        success: function(msg){
            window.location.href = "index.html";
        },
        // If there's an error then print the response message to the console
        error: function(msg){
            console.log(msg);
        }
    })
}

// Defines a function to handle the displaying and (temporary local) storage of uploaded images
function imagesUploaded(inputElement)
{
    // Make an array of all the uploaded images
    const images = [...inputElement.files];
    // Make an array of the img elements on the form
    const imgElementsCollection = inputElement.parentElement.getElementsByTagName("img");
    const imgElements = [...imgElementsCollection];
    // If more than 3 images have been selected to upload then alert the user they can only select up to 3
    if (images.length > 3){
        alert("You can only select up to 3 images");
        // Reset the value of the inputElement to be nothing
        inputElement.value = "";
        // Exit out of the function
        return;
    }
    // For all the selected images
    images.forEach( (image) => {
        if (image) {
            // If the global image list isn't full then add the image to it
            if (imageList.length < 3){
                imageList.push(image);
            // Otherwise if the global image list IS full then remove the first element from it and add the new image
            } else if (imageList.length === 3){
                imageList.shift();
                imageList.push(image);
            }
        }
    });

    // Remove all the img elements from the image input form if there are any
    if (imgElements.length > 0){
        imgElements.forEach( (imgElement) => {
            imgElement.remove();
        });
    }

    // Display every image in the global image list variable on the form by creating and display new img elements for each one
    imageList.forEach( (i) => {
        const img = document.createElement("img");
        img.classList.add("form__image")
        var reader = new FileReader();

        reader.onloadend = function () {
            img.src = reader.result;
            const tempImage = reader.result;
        }

        reader.readAsDataURL(i);

        inputElement.parentElement.appendChild(img);
    });
}

// Defines a function to check if a given value meets the criteria for a valid wheelsize
function validWheelSize(val)
{
    // If val is a number
    if (!isNaN(val)){
        // If val is between 12 and 36
        if (val >= 12 && val <= 36){
            // If val is a decimal
            if ((val % 1) != 0){
                // If val has only 1 decimal place and that decimal place is .5
                if (val.toString().split(".")[1].length === 1 && val.toString().split(".")[1] === "5"){
                    // Then return true
                    return true;
                }
                // If not, then return false
                return false;
            }
            // Return true (if is between 12 and 36 but not a decimal)
            return true;
        }
    }
    // If not a number or between 12 and 36 then return false
    return false;
}

// Defines a function to determine whether a given value meets the criteria for a valid number of gears
function validGearsNumber(val)
{
    // If val is a number
    if (!isNaN(val)){
        // If val is between 1 and 30
        if (val >= 1 && val <= 30){
            // If value is a whole number
            if ((val % 1) === 0){
                // Then return true
                return true;
            }
        }
    }
    // Otherwise return false
    return false;
}

// Defines a function used to initialise the google maps heatmap
function initMap()
{
    // Define the location the map be focused on by default (Cheltenham)
    var mapCenter = new google.maps.LatLng(51.8979988098144,-2.0838599205017);
    // Create a map options variable to pass to the map object when it's created        
    var mapOptions = {
        // Set the level of zoom to 15
        zoom: 15,
        center: mapCenter
    };
    // Create the map object and place it on the div with the id "heatmap"
    map = new google.maps.Map(document.getElementById("heatmap"), mapOptions);

    // Create an empty array to hold the location data of each stolen bike
    gLocations = [];

    // Make an ajax request to get all the stolen bikes locations
    $.ajax({
        type: "POST",
        url: "bikelocations.php",
        success: function(msg){
            // If the request is successful and the file returns some locations then:
            if (msg != "none"){
                // Parse the data returned into json format
                dataJson = JSON.parse(msg);
                // For each bike get the lat and lng values and use them to create a new location object
                // then add that to the gLocations array created earlier
                for (i= 0; i < dataJson.length; i++){
                    latitude = dataJson[i].lat;
                    longitude = dataJson[i].lng;
                    locObj = new google.maps.LatLng(latitude, longitude);
                    gLocations.push(locObj);
                }
            
                // Create a new heatmap layer using the gLocations array and put it on the map object created earlier
                var heatmap = new google.maps.visualization.HeatmapLayer({
                    data:gLocations,
                    map:map
                });
            } 
        }
    })
}

// Define a function to be called when the report stolen button for a bike is clicked
function reportStolenClicked(bike_id)
{
    // Make an ajax request to the bikesession.php file (which will set the bike_id value in the current session)
    $.ajax({
        type: "POST",
        url: "bikesession.php",
        data: "bike_id="+bike_id,
        success: function(msg){
            // If setting the bike_id value in the session was successful then redirect to the report-stolen page
            if (msg == "success"){
                window.location.href = "report-stolen.html";
            }
        }
    })
}

// Define a function to be called when the view inquiry or update inquiry button for a bike is clicked
function inquiryClicked(bike_id)
{
    // Make an ajax request to the bikesession.php file (which will set the bike_id value in the current session)
    $.ajax({
        type: "POST",
        url: "bikesession.php",
        data: "bike_id="+bike_id,
        success: function(msg){
            if (msg == "success"){
                // If setting the bike_id value in the session was successful then redirect to the investigation page
                window.location.href = "investigation.html";
            }
        },
        // If there's an error then log it to the console
        error: function(msg){
            console.log("Error: " + msg);
        }
    })
}

// Create a function used to display a panel showing updates from police on a current stolen bike investigation
function displayUpdate(update)
{
    // Get the scroll container object of the page
    scrollContainer = document.getElementById("investigationScrollContainer");
    // Create the panel that will contain the update info
    const updatePanel = document.createElement("div");
    updatePanel.classList.add("bike__container");

    // Create a text container to hold the text (mostly just for formatting)
    textContainer = document.createElement("div");
    textContainer.classList.add("panel__text__container");
    // Add the text container to the panel so it will be displayed
    updatePanel.appendChild(textContainer);
    
    // Create the text element
    updateText = document.createElement("h2");
    // Set the content of the element to be the given update
    updateText.textContent = update;
    // If the update is more than 1000 characters long then cut off anything over the 1000 character mark and add "..."
    // this is to prevent overflow into other panels
    if (updateText.innerHTML.length > 1000){
        updateText.innerHTML = updateText.innerHTML.substr(0, 1000)+"...";
    }
    // Append the text element to the container element so it will be displayed
    textContainer.appendChild(updateText);
    // Append the panel element to the scroll container so it will be displayed
    scrollContainer.appendChild(updatePanel);
}

// Define a function to navigate to the last-location page
function lastLocationClicked()
{
    window.location.href="last-location.html";
}

// Define a function to get input from police officers about investigation updates for a bike
function investigationUpdate(bike_id)
{
    // If the officer hasn't already opened an input panel then:
    if (!document.getElementById("updateInputPanel")){
        // Display an alert telling the officer how to close the investigation
        alert('To close this investigation and remove this bike from the stolen register type "investigation closed" and click submit');
        // Get the scroll container element
        scrollContainer = document.getElementById("investigationScrollContainer");
        // Create the input panel which will contain the input field and submit button
        const inputPanel = document.createElement("div");
        inputPanel.id = "updateInputPanel";
        inputPanel.classList.add("bike__container");
        
        // Create the text input element
        textArea = document.createElement("textarea")
        textArea.setAttribute("cols", 100);
        textArea.setAttribute("rows", 10);
        // Append it to the panel so it's displayed
        inputPanel.appendChild(textArea);
        // Create the submit button
        submitButton = document.createElement("button");
        submitButton.classList.add("update__button");
        submitButton.textContent = "Submit";
        // When the button is clicked have it call the submitUpdate function with the text input as an argument
        submitButton.onclick = function () { submitUpdate(textArea.value); };
        // Append the button to the panel so it's displayed
        inputPanel.appendChild(submitButton);
        // Append the panel to the scroll container so it's displayed
        scrollContainer.appendChild(inputPanel);
    }
}

// Define a function used to submit investigation updates to the SQL server and check if the investigation should be closed
function submitUpdate(update)
{
    //If the update is "investigation closed" then:
    if (update.toLowerCase() == "investigation closed"){
        // Mark the bike as not stolen, remove all the investigation updates, and redirect to view-bikes.html
        $.ajax({
            type: "POST",
            url: "recovered.php",
            success: function(msg){
                if (msg == "success"){
                    window.location.href = "view-bikes.html";
                // If there's a problem then log the message to the console
                } else {
                    console.log(msg);
                }
            }
        });
    // Otherwise:
    } else {
        // Add the investigation update to table and refresh the page so the update is shown and the update input field is closed
        $.ajax({
            type: "POST",
            url: "addupdate.php",
            data: "update="+update,
            success: function(msg){
                if (msg == "success"){
                    // Reload the page
                    location.reload();
                // If there's a problem then log the message to the console
                } else {
                    console.log(msg);
                }
            }
        });
    }
}

// Define a function to direct to the investigation page
function redirectInvestigation()
{
    window.location.href = "investigation.html";
}

// Define a function to display the images and information about a bike as well as some navigation buttons
function displayInvestigation(images, title, type, size, colour, account, bike_id)
{
    // Get the scroll container element
    scrollContainer = document.getElementById("investigationScrollContainer");
    // Create a panel used to hold the images and "last known location" button
    const imagesPanel = document.createElement("div");
    imagesPanel.classList.add("bike__container");

    // For all the given images, create an img element on the images panel and use it to display the passed image
    for (var i = 0; i < images.length; i++){
        bikeImage = document.createElement("img");
        bikeImage.src = images[i];
        bikeImage.classList.add("form__image");
        bikeImage.style.cssText += "float:left";
        imagesPanel.appendChild(bikeImage);
    }
    // Create a button with the text "last location"
    locationButton = document.createElement("button");
    locationButton.classList.add("report__button");
    locationButton.textContent = "Last Location";
    // When it's clicked call the "lastLocationClicked" function
    locationButton.setAttribute("onclick", "lastLocationClicked();")
    // Append it to the images panel so it's displayed
    imagesPanel.appendChild(locationButton);

    // Create a new panel to display information about the bike
    const infoPanel = document.createElement("div");
    infoPanel.classList.add("bike__container");
    infoPanel.id = bike_id;

    // If the currently logged in account is a police or admin account then create a button to give updates on the investigation
    if (account == "admin" || account == "police"){
        giveUpdateButton = document.createElement("button");
        giveUpdateButton.classList.add("report__button");
        giveUpdateButton.textContent = "Give Update";
        giveUpdateButton.setAttribute("onclick", "investigationUpdate("+infoPanel.id+");")
        infoPanel.appendChild(giveUpdateButton);
    }

    // Create a text container element to hold the information about the bike
    textContainer = document.createElement("div");
    textContainer.classList.add("panel__text__container");
    // Append it to the infoPanel so it's displayed
    infoPanel.appendChild(textContainer);

    // Create a text element for the bikes title
    bikeTitle = document.createElement("h1");
    bikeTitle.classList.add("panel__text");
    bikeTitle.textContent = title;
    // Append it to the text container so it's displayed
    textContainer.appendChild(bikeTitle);

    // Create a text element for the bikes type
    bikeType = document.createElement("h2");
    bikeType.classList.add("panel__text");
    bikeType.textContent = type;
    // Append it to the text container so it's displayed
    textContainer.appendChild(bikeType);

    // Create a text element for the bikes wheelsize
    wheelSize = document.createElement("h2");
    wheelSize.classList.add("panel__text");
    // Add '" wheels' to the end of the size text
    wheelSize.textContent = size + '" wheels';
    // Append it to the text container so it's displayed
    textContainer.appendChild(wheelSize);

    // Create a text element for the bikes colour
    bikeColour = document.createElement("h2");
    bikeColour.classList.add("panel__text");
    bikeColour.textContent = colour;
    // Append it to the text container so it's displayed
    textContainer.appendChild(bikeColour);

    // Append both the images and info panels to the scroll container so they're displayed
    scrollContainer.appendChild(imagesPanel);
    scrollContainer.appendChild(infoPanel);
}

// Define a function to display a panel containing an image and details about a bike
function displayBikePanel(imageSource, title, type, size, colour, stolen, account, bike_id)
{
    // Get the scroll container element 
    scrollContainer = document.getElementById("viewBikesContainer");
    // Create a div element to be the panel containing the images, details and button
    const newPanel = document.createElement("div");
    newPanel.classList.add("bike__container");
    newPanel.id = bike_id;

    // Create an img element using the passed imageSource variable as the source
    bikeImage = document.createElement("img");
    bikeImage.src = imageSource;
    bikeImage.classList.add("form__image");
    bikeImage.style.cssText += "float:left";
    // Append the img element to the panel so it's displayed
    newPanel.appendChild(bikeImage);
    // If the passed stolen value is false then:
    if (stolen == false){
        // Create a button element which has the text "report as stolen"
        reportButton = document.createElement("button");
        reportButton.classList.add("report__button");
        reportButton.textContent = "Report as stolen";
        // When clicked call the reportStolenClicked function with the panel's id (the bike id) as the argument
        reportButton.onclick = function () { reportStolenClicked(newPanel.id); }
        // Append the button to the panel so it's displayed
        newPanel.appendChild(reportButton);
    // If the passed stolen value is true,
    } else if (stolen == true){
        // If the logged in account is a user
        if (account == "user"){
            // Create a button element which has the text "View inquiry"
            viewButton = document.createElement("button");
            viewButton.classList.add("inquiry__button");
            viewButton.textContent = "View inquiry";
            // When clicked call the inquiryClicked function with the panel's id (the bike id) as the argument
            viewButton.setAttribute("onclick", "inquiryClicked("+newPanel.id+");")
            // Append the button to the panel so it's displayed
            newPanel.appendChild(viewButton);
        }
        // If the logged in account is an admin or police account then:
        else if (account == "admin" || account == "police"){
            // Create a button element which has the text "Update inquiry"
            updateButton = document.createElement("button");
            updateButton.classList.add("update__button");
            updateButton.textContent = "Update inquiry";
            // When clicked call the inquiryClicked function with the panel's id (the bike id) as the argument
            updateButton.setAttribute("onclick", "inquiryClicked("+newPanel.id+");")
            // Append the button to the panel so it's displayed
            newPanel.appendChild(updateButton);
        }
    }

    // Create div element with the class "panel__text__container" to hold the text elements of details about the bike
    textContainer = document.createElement("div");
    textContainer.classList.add("panel__text__container");
    // Append the text container to the panel so it's displayed
    newPanel.appendChild(textContainer);

    // Create an element for the bike title
    bikeTitle = document.createElement("h1");
    bikeTitle.classList.add("panel__text");
    bikeTitle.textContent = title;
    // Append the element to the text container so it's displayed
    textContainer.appendChild(bikeTitle);

    // Create an element for the bikes type
    bikeType = document.createElement("h2");
    bikeType.classList.add("panel__text");
    bikeType.textContent = type;
    // Append the element to the text container so it's displayed
    textContainer.appendChild(bikeType);

    // Create an element for the bike's wheel size
    wheelSize = document.createElement("h2");
    wheelSize.classList.add("panel__text");
    wheelSize.textContent = size + '" wheels';
    // Append the element to the text container so it's displayed
    textContainer.appendChild(wheelSize);

    // Create a text element for the bikes colour
    bikeColour = document.createElement("h2");
    bikeColour.classList.add("panel__text");
    bikeColour.textContent = colour;
    // Append the element to the text container so it's displayed
    textContainer.appendChild(bikeColour);

    // Append the panel to the scroll container so it's displayed
    scrollContainer.appendChild(newPanel);
}

// Gets called when the page is loaded
document.addEventListener("DOMContentLoaded", () => {
    // Gets elements by their IDs and ties them to variables
    const loginForm = document.querySelector("#login");
    const createAccountForm = document.querySelector("#createAccount");
    const registerBikeForm = document.querySelector("#registerBike");
    const createPoliceAccountForm = document.querySelector("#createPoliceAccount")
    const viewBikesContainer = document.querySelector("#viewBikesContainer");
    const locationMapDiv = document.querySelector("#locationMap");
    const adminBar = document.getElementsByClassName("admin__nav__bar")[0];
    const policeBar = document.getElementsByClassName("police__nav__bar")[0];

    // Set errorCount to be 0
    errorCount = 0;
    // Set imageList to be empty
    imageList = []

    // If the loginForm and createAccountForm elements don't exist (so if not on the index page):
    if (!loginForm && !createAccountForm){
        // Make an ajax request to the sessioncheck.php file to see if an account is currently logged in
        $.ajax({
            url: "sessioncheck.php",
            method: "POST",
            success:function(msg) {
                // If the response is "index.html" then no account is logged in and need to redirect to index (log in) page
                if (msg == "index.html"){
                    window.location.href = msg;
                // Otherwise an account is logged and the type of account is returned
                // If the logged in account is a police account then:
                } else if (msg == "police"){
                    if (policeBar){
                        // Display the police navigation hotbar
                        policeBar.classList.remove("form--hidden");
                        // Hide the user navigation hotbar
                        if (document.getElementsByClassName("user__nav__bar")){
                            userBar = document.getElementsByClassName("user__nav__bar")[0];
                            userBar.classList.add("form--hidden");
                        }
                    }
                // If the logged in account is an admin account then: 
                } else if (msg == "admin"){
                    if (adminBar){
                        // Display the admin navigation hotbar
                        adminBar.classList.remove("form--hidden");
                        // Hide the user navigation hotbar
                        if (document.getElementsByClassName("user__nav__bar")){
                            userBar = document.getElementsByClassName("user__nav__bar")[0];
                            userBar.classList.add("form--hidden");
                        }
                    }
                }
            },
            // If there's an error with the request then log it to the console
            error: function(msg){
                console.log(msg);
            }
        })
    }

    // If the investigationScrollContainer element exists (so if on the investigation page) then:
    if (document.getElementById("investigationScrollContainer")){
        // Make an ajax request to the bikesessioncheck.php file to get the bike_id value of the bike currently in the session
        $.ajax({
            type: "POST",
            url: "bikesessioncheck.php",
            success: function(msg){
                // If the request returns "view-bikes.html" then no bike_id is currently in the session
                // Therefore must redirect to the view-bikes page
                if (msg == "view-bikes.html"){
                    window.location.href = msg;
                // Otherwise make a local variable called bike_id and set it to the message that was returned
                } else {
                    bike_id = msg;
                    // Make another ajax request, this time to the getbike.php file to get the bike associated with the bike_id value
                    $.ajax({
                        type: "POST",
                        url: "getbike.php",
                        data: "bike_id="+bike_id,
                        async: false,
                        datatype: 'json',
                        success: function(msg){
                            // If no bike could be found then return to the view-bikes page
                            if (msg == "none"){
                                window.location.href = "view-bikes.html";
                            // Otherwise:
                            } else {
                                // Parse the message into JSON format
                                dataJson = JSON.parse(msg);
                                // Create a bike variable using the json data
                                bike = dataJson;
                                // Create the title of the bike by combining it's brand and model values
                                bikeTitle = bike["brand"] + " " + bike["model"];
                                // Get the type of the bike
                                bikeType = bike["type"];
                                // Get the wheelsize of the bike
                                wheelSize = bike["wheel_size"];
                                // Get the colour of the bike
                                bikeColour = bike["colour"];
                                // Create an images array and fill it with the address to a blank bike icon image
                                images = ["../Bikes/1.png", "../Bikes/1.png", "../Bikes/1.png"];
                                // Create an account type variable
                                var accountType;
                                // Make an ajax request to the getimages.php file to get the images associated with the given bike id
                                $.ajax({
                                    type: "POST",
                                    url: "getimages.php",
                                    data: "bike_id="+bike_id,
                                    async: false,
                                    datatype: 'json',
                                    success: function(img_msg){
                                        // If the message returned isn't 1.png then loop through all the returned addresses and
                                        // add them to the images array
                                        if (img_msg != "1.png"){
                                            imageJson = JSON.parse(img_msg);
                                            for (var i = 0; i < imageJson.length; i++){
                                                images[i] = "../Bikes/"+imageJson[i]["image_name"];
                                            }
                                        }
                                    },
                                    // If theres an error with the request then log it to the console
                                    error: function(img_msg){
                                        console.log("error:" + img_msg);
                                    }
                                });
                                // Make an ajax request to the sessioncheck.php file to get the account type of the currently
                                // logged in account
                                $.ajax({
                                    type: "POST",
                                    url: "sessioncheck.php",
                                    async: false,
                                    success: function(acc_msg){
                                        // If the message isn't "index.html" then set the account type variable to be the message
                                        if (acc_msg != "index.html"){
                                            accountType = acc_msg;
                                        } else {
                                            console.log(acc_msg);
                                        }
                                    },
                                    // If theres an error with the requst then log it to the console
                                    error: function(acc_msg){
                                        console.log("Error: "+acc_msg);
                                    }
                                });
                                // Create an empty array to store the investigation updates
                                updatesArray = [];
                                // Make an ajax request to the getupdates.php file to get the investigation updates for the bike
                                $.ajax({
                                    type: "POST",
                                    url: "getupdates.php",
                                    async: false,
                                    datatype: 'json',
                                    success: function(msg){
                                        // If response contains updates then loop through them all and add them to the updatesArray
                                        if (msg != "none"){
                                            updatesJson = JSON.parse(msg);
                                            for (var i = 0; i < updatesJson.length; i++){
                                                updatesArray.push(updatesJson[i]["investigation_update"]);
                                            }
                                        }
                                    },
                                    // If there's an error, log it into the console
                                    error: function(msg){
                                        console.log("error:" + msg);
                                    }
                                });
                                // Call the displayInvestigation function with all of the bike info and images as arguements
                                displayInvestigation(images, bikeTitle, bikeType, wheelSize, bikeColour, accountType, bike_id);
                                // For every update in the updatesArray, call the displayUpdate function
                                for (var i = 0; i < updatesArray.length; i++){
                                    displayUpdate(updatesArray[i]);
                                }
                            }
                        }
                    });
                }
            }
        });
    }

    // If the locationMapDiv element exists (so if on the last-location page) then:
    if (locationMapDiv){
        // Make an ajax request to the bikesessioncheck.php file to check if there is currently a bike id in the session
        $.ajax({
            url: "bikesessioncheck.php",
            method: "POST",
            async: false,
            success:function(msg) {
                // If there isn't a bike in the session then redirect to view-bikes
                if (msg == "view-bikes.html"){
                    window.location.href = msg;
                // Otherwise:
                } else {
                    // Create a new geocoder object
                    var geocoder = new google.maps.Geocoder();

                    //Make an ajax request to get the lat and lng values of the bike in the current session
                    $.ajax({
                        url: "bikelocation.php",
                        method: "POST",
                        success:function(msg) {
                            // If there's none then log to the console that there's an error
                            if (msg == "none"){
                                console.log("Error")
                            // Otherwise:
                            } else {
                                // Parse the response into json format
                                dataJson = JSON.parse(msg);
                                // Get the lat and lng values from the dataJson variable
                                lat = dataJson["lat"];
                                lng = dataJson["lng"];
                                // Create a marker position varible using the lat and lng values
                                markerPos = new google.maps.LatLng(lat, lng);
                                // Create a variable called mapCenter using the lat and lng values this will be the location that
                                // the map focuses on by default
                                var mapCenter = new google.maps.LatLng(lat, lng);        
                                // Create a mapOptions variable from the mapCenter and a zoom value of 15
                                var mapOptions = {
                                    zoom: 15,
                                    center: mapCenter
                                };
                                // Create a map object that will be placed on the locationMapDiv element
                                map = new google.maps.Map(locationMapDiv, mapOptions);
                                // Create a new marker on the map and set it's position to the markerPos variable defined earlier
                                marker = new google.maps.Marker({
                                    map: map,
                                    position: markerPos,
                                    draggable: false
                                });
                            }
                        }
                    });
                }
            }
        });
    }

    // If the report__map element exists (so if on the report-stolen page) then:
    if (document.getElementById("report__map")){
        // Define the location the map be focused on by default (Cheltenham)
        var mapCenter = new google.maps.LatLng(51.8979988098144,-2.0838599205017);
        // Create new geocoder object
        var geocoder = new google.maps.Geocoder();
        
        // Create a mapOptions variable using the the mapCenter variable and a zoom of 15
        var mapOptions = {
            zoom: 15,
            center: mapCenter
        };
        // Create a new map object to be placed on the report__map element
        map = new google.maps.Map(document.getElementById("report__map"), mapOptions);
        // Create a draggable marker on the map and set it's position to the center
        marker = new google.maps.Marker({
            map: map,
            position: mapCenter,
            draggable: true
        });

        // Make an ajax requqest to the bikesessioncheck.php file to check if theres a bike id in the current session
        $.ajax({
            url: "bikesessioncheck.php",
            method: "POST",
            success:function(msg) {
                // If the request responds with "view-bikes.html" then redirect to the view bikes page
                if (msg == "view-bikes.html"){
                    window.location.href = msg;
                //Otherwise:
                } else {
                    // Get the reportStolenForm element and add an event listener for when the submit button is clicked
                    document.getElementById("reportStolenForm").addEventListener("submit", e => {
                        // Prevent the default functionality
                        e.preventDefault();
                        
                        //Create latitude and longitude values based on the location of the draggable pointer
                        latitude = marker.getPosition().lat();
                        longitude = marker.getPosition().lng();
                        
                        // Make an ajax request to the updatebike.php file to mark the bike as stolen and set it's lat and lng values
                        $.ajax({
                            url: "updatebike.php",
                            method: "POST",
                            // Use the previously created latitude and longitude variables for the data
                            data: "lat="+latitude+"&lng="+longitude,
                            success:function(msg){
                                // If successful then redirect back to the view-bikes page
                                if (msg == "success"){
                                    window.location.href = "view-bikes.html";
                                }
                            }
                        })
                    });
                }
            },
            // If there is an error with the request then log it to the console
            error: function(msg){
                console.log(msg);
            }
        })
    }

    // If the heatmap element exists (so if on the heatmap page) call the initMap() function
    if (document.getElementById("heatmap")){
        initMap();
    }

    // If the linkCreateAccount element can be found then: Add an event listener to the "create account" hyperlink
    if (document.querySelector("#linkCreateAccount")){
        document.querySelector("#linkCreateAccount").addEventListener("click", e => {
            // Prevents the default functionality of the link to replace it with custom functionality
            e.preventDefault();
            // Adds the "form--hidden" class to the loginForm meaning it becomes hidden
            loginForm.classList.add("form--hidden");
            // Removes the "form--hidden" class from the createAccountForm so it is shown
            createAccountForm.classList.remove("form--hidden");
        });
    }
    
    // If the linkCreateAccount element can be found then: Add an event listener to the "log in" hyperlink
    if (document.querySelector("#linkLogin")){
        document.querySelector("#linkLogin").addEventListener("click", e => {
            // Prevents the default functionality of the link to replace it with custom functionality
            e.preventDefault();
            // Adds the "form--hidden" class to the createAccountForm meaning it becomes hidden
            createAccountForm.classList.add("form--hidden");
            // Removes the "form--hidden" class from the loginForm so it is shown
            loginForm.classList.remove("form--hidden");
        });
    }
    
    // Creates an event listener for when the Log-in button is clicked if the log-in form exists
    if (loginForm){
        loginForm.addEventListener("submit", e => {
            // Convert the inputs of the login form into a URL encoded string
            formData = $('#login').serialize();

            // Prevent the original functionality that reloads the page
            e.preventDefault();
            
            // Make an ajax request to the login.php file to attempt a login
            $.ajax({
                type: "POST",
                url: "login.php",
                data: formData+"&phpFunction=login",
                datatype: 'json',
                success: function(msg){
                    // Parse the response into json format
                    dataJson = JSON.parse(msg);
                    // If the query returns a key value pair of result = false then:
                    if(dataJson["result"]=="false"){
                        // Displays the error message near the top of the form just below the title
                        setFormMessage(loginForm, "error", "Incorrect log-in details");
                    // Otherwise
                    } else {
                        // Navigate to the view-bikes page
                        window.location="view-bikes.html";
                    }
                }
            })
        });
    }
    
    // Creates an event listener for when the Register button is clicked if create account form exists
    if (createAccountForm){
        createAccountForm.addEventListener("submit", e => {
            // Prevent original functionality of the submit button
            e.preventDefault();

            // Set empty values to 0 and errors to false
            emptyValues = 0;
            errors = false;

            // If any elements are currently selected then unselect them
            if ("activeElement" in document){
                document.activeElement.blur();
            }

            // For every input element currently loaded, check if it's empty, if it is then add 1 to emptyValues variable
            $("input").each(function(){
                var element = $(this);
                if (element.val() == ""){
                    emptyValues = emptyValues+1;
                }
            })
            // Get a list of all the form__input-error-message elements
            var errorMessages = document.getElementsByClassName('form__input-error-message');
            // Loop through all the message elements and see if any have a text content set, if they do set errors variable to true
            for (var i = 0; i < errorMessages.length; ++i) {
                if (errorMessages[i].textContent != ""){
                    errors = true;
                }
            }

            // If empty values is 2 or less (because the login inputs are included in the count despite not being visible)
            // and errors is false then:
            if (emptyValues <= 2 && errors == false){
                // Convert the inputs of the login form into a URL encoded string
                formData = $('#createAccount').serialize() + "&type=user&force_id=0";
                // Make an ajax request to the signup.php file to attempt to register the account in the server
                $.ajax({
                    type: "POST",
                    url: "signup.php",
                    data: formData+"&phpFunction=create",
                    success: function(msg){
                        // If the response is "Successfuly registered" then:
                        if (msg == "Successfully registered"){
                            // Set the message at the top to display "Successfully registered" in green
                            setFormMessage(createAccountForm, "success", msg);
                            // Make an ajax request to the login.php file to attempt to login to the account that was just created
                            $.ajax({
                                type: "POST",
                                url: "login.php",
                                data: formData+"&phpFunction=login",
                                datatype: 'json',
                                success: function(msg){
                                    // Parse the response into json format
                                    dataJson = JSON.parse(msg);
                                    // If the login attempt responds with result = false then:
                                    if(dataJson["result"]=="false"){
                                        // Displays the error message near the top of the form just below the title
                                        setFormMessage(createAccountForm, "error", "Something went wrong");
                                    // Otherwise, redirect to the view-bikes page
                                    } else {
                                        window.location.href="view-bikes.html";
                                    }
                                }
                            })
                        }
                    },
                    // If there's an error with the request then:
                    error: function(msg){
                        // Displays the error message near the top of the form just below the title
                        setFormMessage(createAccountForm, "error", "Sign-up failed");
                    }
                });
            } else {
                // Displays the error message near the top of the form just below the title
                setFormMessage(createAccountForm, "error", "Invalid account information");
            }
  
        });
    }

    // If the viewBikesContainer element exists (so if on the view-bikes page) then:
    if (viewBikesContainer){
        // Make an ajax request to the getbikes.php file which responds with a list of bikes based on the account type of the
        // currently logged in account
        $.ajax({
            type: "POST",
            url: "getbikes.php",
            datatype: 'json',
            success: function(msg){
                // If the response is "none" then display a panel which says "This is where bikes will be displayed"
                if (msg == "none"){
                    //
                    scrollContainer = document.getElementById("viewBikesContainer");
                    const newPanel = document.createElement("div");
                    newPanel.classList.add("bike__container");
                    newPanel.classList.add("user__container");

                    textContainer = document.createElement("div");
                    textContainer.classList.add("panel__text__container");
                    newPanel.appendChild(textContainer);

                    displayMessage = document.createElement("h1");
                    displayMessage.classList.add("panel__text");
                    displayMessage.textContent = "This is where bikes will be displayed";
                    textContainer.appendChild(displayMessage);

                    scrollContainer.appendChild(newPanel);
                //Otherwise:
                } else {
                    // Parse the response message into json format
                    dataJson = JSON.parse(msg);
                    // Loop through all the bikes in the response data
                    for(var i = 0; i < dataJson["num_of_bikes"]; i++){
                        // Create a bikeObj variable to store the bike object of this iteration
                        var bikeObj = dataJson[i];
                        // Set imageSrc variable to be blank
                        imageSrc = "";
                        // Make an ajax request to the getimages.php file to get the images corresponding to the current bike object
                        $.ajax({
                            type: "POST",
                            url: "getimages.php",
                            data: "bike_id="+bikeObj["bike_id"],
                            async: false,
                            datatype: 'json',
                            success: function(img_msg){
                                // If the response is "1.png" then set the source to the address of the blank bike icon image
                                if (img_msg == "1.png"){
                                    imageSrc = "../Bikes/1.png";
                                // Otherwise parse the response into json format and use that to access the first bike image address
                                // and set the imageSrc variable to that address
                                } else {
                                    imageJson = JSON.parse(img_msg);
                                    imageSrc = "../Bikes/" + imageJson[0]["image_name"];
                                }
                            },
                            // If there's an error with the request then set the imageSrc to be to the blank bike icon image address
                            error: function(img_msg){
                                imageSrc = "../Bikes/1.png";
                            }
                        })
                        // Get the title of the bike object by combining its brand and model
                        bikeTitle = bikeObj["brand"] + " " + bikeObj["model"];
                        // Get the type of the bike
                        bikeType = bikeObj["type"];
                        // Get the wheel size of the bike
                        bikeWheelSize = bikeObj["wheel_size"];
                        // Get the colour of the bike
                        bikeColour = bikeObj["colour"];

                        // Call the displayBikePanel function with the previously gathered imageSrc and bike infromation, as well as 
                        // the type of account that's logged in, whether the bike is stolen or not, and the bike_id
                        displayBikePanel(imageSrc, bikeTitle, bikeType, bikeWheelSize, bikeColour, bikeObj["stolen"], dataJson["account_type"], bikeObj["bike_id"]);
                    }
                }
            }
        })
    }

    // Creates an event listener for when the Register button is clicked if the create police account form exists
    if (createPoliceAccountForm){
        createPoliceAccountForm.addEventListener("submit", e => {
            // Prevent original functionality of the submit button
            e.preventDefault();

            // Set empty values to 0 and errors to false
            emptyValues = 0;
            errors = false;

            // If there are any elements that are currently focused then unfocus them
            if ("activeElement" in document){
                document.activeElement.blur();
            }

            // For all the input elements, check if the input is empty, if it is add 1 to the emptyValues variable
            $("input").each(function(){
                var element = $(this);
                if (element.val() == ""){
                    emptyValues = emptyValues+1;
                }
            })

            // Get a list of all the form__input-error-message elements
            var errorMessages = document.getElementsByClassName('form__input-error-message');
            // For each message element if it has a text content set (so if it's showing), set errors variable to be true
            for (var i = 0; i < errorMessages.length; ++i) {
                if (errorMessages[i].textContent != ""){
                    errors = true;
                }
            }

            // Create an accountType variable and set it to police by default
            var accountType = "police";

            // If the "Admin account?" check box is ticked then set the accountType variable to admin
            if (document.getElementById("policeAdmin").checked == true){
                accountType = "admin";
            }

            // If empty values are 0 or less and errors is false then:
            if (emptyValues <= 0 && errors == false){
                // Convert the inputs of the createPoliceAccount form into a URL encoded string
                formData = $('#createPoliceAccount').serialize() + "&type="+accountType;
                // Make an ajax request to the signup.php file to attempt to register an account to the database
                $.ajax({
                    type: "POST",
                    url: "signup.php",
                    data: formData+"&phpFunction=create",
                    success: function(msg){
                        // If the response message is "Successfully registered" then redirect to the view-bikes page
                        if (msg == "Successfully registered"){
                            window.location="view-bikes.html";
                        // Otherwise log the response message to the console
                        } else {
                            console.log(msg);
                        }
                    },
                    // If there was an error with the request then:
                    error: function(msg){
                        // Display an error message near the top of the form just below the title
                        setFormMessage(createAccountForm, "error", "Sign-up failed");
                    }
                });
            } else {
                // Displays an error message near the top of the form just below the title
                setFormMessage(createPoliceAccountForm, "error", "Invalid account information");
            }
        });
    }

    // If the registerBikeForm element exists (so if on the register-bike page) then:
    if (registerBikeForm){
        // Add a listener for the click of a submit button
        registerBikeForm.addEventListener("submit", e => {
            // Prevent the original functionality that reloads the page
            e.preventDefault();

            // Create an emptyValues variable and an errors variable and set them both to false
            emptyValues = false;
            errors = false;

            // If any elements are currently focused then unfocus them
            if ("activeElement" in document){
                document.activeElement.blur();
            }

            // For each input element check if it's empty and if it is, set emptyValues to true
            $("input").each(function(){
                var element = $(this);
                if (element.val() == ""){
                    emptyValues = true;
                }
            })
            // Because the following are "select" elements rather than input elements they must be checked individually.
            // Check to see if any have a selected value that's empty (meaning the default is left selected), and if they do
            // set emptyValues to true
            if (document.querySelector("#infoType").value == ""){
                emptyValues = true;
            }
            if (document.querySelector("#infoBrakes").value == ""){
                emptyValues = true;
            }
            if (document.querySelector("#infoSuspension").value == ""){
                emptyValues = true;
            }
            if (document.querySelector("#infoGender").value == ""){
                emptyValues = true;
            }
            if (document.querySelector("#infoAge").value == ""){
                emptyValues = true;
            }

            // Get a list of the form__input-error-message elements
            var errorMessages = document.getElementsByClassName('form__input-error-message');
            // Loop through all these elements and check if they have content set (are active) and if they do, set errors to true
            for (var i = 0; i < errorMessages.length; ++i) {
                if (errorMessages[i].textContent != ""){
                    errors = true;
                }
            }

            // If both emptyValues and errors are false then:
            if (emptyValues == false && errors == false){
                //Create a new FormData object
                var formData = new FormData();

                // For every image in the imageList global variable, add a key value pair containing that image to the formData object
                for(var i = 0; i<imageList.length;i++){
                    formData.append("images[]", imageList[i]);
                }
    
                // Convert the inputs of the bikeInfo form into a URL encoded string
                var bike_info = $('#bikeInfo').serializeArray();
                // For each key value pair in bike_info append that key value pair to the formData object
                $.each(bike_info,function(key,input){
                    formData.append(input.name,input.value);
                });
    
                // Make an ajax request to the register.php file to attempt to add the bike to the database
                $.ajax({
                    url: "register.php",
                    method: "POST",
                    data: formData,
                    //These must all be set to false because images are being passed
                    contentType: false,
                    processData: false,
                    cache: false,
                    success:function(msg) {
                        // If the request is successful then redirect to the view-bikes page
                        window.location.href = "view-bikes.html";
                    }
                })
            // If errors or emptyValus are true then:
            } else {
                // Display an error message near the top of the form just below the title
                setFormMessage(registerBikeForm, "error", "Could not register your bike");
            }   
        });
    }
    // Select all form__input elements on the page and loop through each of them
    document.querySelectorAll(".form__input").forEach(inputElement =>{
        // Add a listener for a "blur", meaning when the user unfocuses from the element (clicks off it or on another element)
        inputElement.addEventListener("blur", e =>{
            // If it's the registerFirstname element and there is something entered in the input but less than 2 characters
            // then display an error telling the user the name is too short
            if (e.target.id === "registerFirstname" && e.target.value.length > 0 && e.target.value.length < 2){
                setInputError(inputElement, "First name must be at least 2 letters long");
            }
            // If it's the registerLastname element and there is something entered in the input but less than 2 characters
            // then display an error telling the user the name is too short
            if (e.target.id === "registerLastname" && e.target.value.length > 0 && e.target.value.length < 2){
                setInputError(inputElement, "Last name must be at least 2 letters long");
            }
            // If it's the registerEmail element and there is something entered in the input but doesn't contain an @ symbol or
            // has less than 6 characters then display an error telling the user the email entered is invalid
            if (e.target.id === "registerEmail" && e.target.value.length > 0 && (e.target.value.length < 6 || !e.target.value.includes("@"))){
                setInputError(inputElement, "Invalid email address");
            }
            // If it's the registerPassword element and there is something entered in the input but it doesn't meet the password
            // criteria then display an error telling the user the password criteria
            if (e.target.id === "registerPassword" && e.target.value.length > 0 && !checkPasswordStrength(e.target.value)){
                setInputError(inputElement, "Password must contain at least: 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number");
            }
            // If it's the registerConfirmPasswordelement and there is something entered in the input and it isn't equal to the
            // password input field's value then display an error telling the user that the password fields much match
            if (e.target.id === "registerConfirmPassword" && e.target.value.length > 0 && !(e.target.value === document.getElementById("registerPassword").value)){
                setInputError(inputElement, "Passwords must match");
            }
            // If it's the infoMPN element and there is something entered in the input but less than 5 characters
            // then display an error telling the user the MPN is too short
            if (e.target.id === "infoMPN" && e.target.value.length > 0 && e.target.value.length < 5){
                setInputError(inputElement, "MPN must be at least 5 characters long");
            }
            // If it's the infoBrand element and there is something entered in the input but less than 2 characters
            // then display an error telling the user the brand is too short
            if (e.target.id === "infoBrand" && e.target.value.length > 0 && e.target.value.length < 2){
                setInputError(inputElement, "Brand must be at least 2 characters long");
            }
            // If it's the infoModel element and there is something entered in the input but less than 2 characters
            // then display an error telling the user the model is too short
            if (e.target.id === "infoModel" && e.target.value.length > 0 && e.target.value.length < 2){
                setInputError(inputElement, "Model must be at least 2 characters long");
            }
            // If it's the infoWheelSize element and there is something entered in the input and validWheelSize returns false
            // then display an error telling the user the wheel size is invalid
            if (e.target.id === "infoWheelSize" && e.target.value.length > 0 && !validWheelSize(e.target.value)){
                setInputError(inputElement, "Invalid wheel size");
            }
            // If it's the infoColour element and there is something entered in the input but less than 3 characters
            // then display an error telling the user the colour is too short
            if (e.target.id === "infoColour" && e.target.value.length > 0 && e.target.value.length < 3){
                setInputError(inputElement, "");
            }
            // If it's the infoGears element and there is something entered in the input and validGearsNumber returns false
            // then display an error telling the user the number of gears is invalid
            if (e.target.id === "infoGears" && e.target.value.length > 0 && !validGearsNumber(e.target.value)){
                setInputError(inputElement, "Invalid number of gears");
            }
            // If it's the policeFirstname element and there is something entered in the input but less than 2 characters
            // then display an error telling the user the name is too short
            if (e.target.id === "policeFirstname" && e.target.value.length > 0 && e.target.value.length < 2){
                setInputError(inputElement, "First name must be at least 2 letters long");
            }
            // If it's the policeLastname element and there is something entered in the input but less than 2 characters
            // then display an error telling the user the name is too short
            if (e.target.id === "policeLastname" && e.target.value.length > 0 && e.target.value.length < 2){
                setInputError(inputElement, "Last name must be at least 2 letters long");
            }
            // If it's the policeEmail element and there is something entered in the input but doesn't contain an @ symbol or
            // has less than 6 characters then display an error telling the user the email entered is invalid
            if (e.target.id === "policeEmail" && e.target.value.length > 0 && (e.target.value.length < 6 || !e.target.value.includes("@"))){
                setInputError(inputElement, "Invalid email address");
            }
            // If it's the policePassword element and there is something entered in the input but it doesn't meet the password
            // criteria then display an error telling the user the password criteria
            if (e.target.id === "policePassword" && e.target.value.length > 0 && !checkPasswordStrength(e.target.value)){
                setInputError(inputElement, "Password must contain at least: 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number");
            }
            // If it's the policeConfirmPassword and there is something entered in the input and it isn't equal to the
            // password input field's value then display an error telling the user that the password fields much match
            if (e.target.id === "policeConfirmPassword" && e.target.value.length > 0 && !(e.target.value === document.getElementById("policePassword").value)){
                setInputError(inputElement, "Passwords must match");
            }
            // If it's the policeFin element and there is something entered in the input but less than 2 characters
            // then display an error telling the user the force identification number is too short
            if (e.target.id === "policeFin" && e.target.value.length > 0 && e.target.value.length < 2){
                setInputError(inputElement, "Force identification number must be at least 2 letters long");
            }
        });

        // Add an event listener that will call the clearInputError function when the user inputs data anywhere on the form
        inputElement.addEventListener("input", e =>{
            clearInputError(inputElement);
        });
    });
});