let acceptedItems = [];
let postCodeDates = [];
let urbanFSAAreas = [];
let dropOffItems = [];
let noItems = [];

function setGlobalVariables(data,variable) {
    switch (variable) {
        case 'items':
            acceptedItems = data.split(/\r\n|\n/);
            break;
        case 'post':
            lines = data.split(/\r\n|\n/);
            for (let i = 0; i < lines.length; i++) {
                postCodeDates.push(lines[i].split(','));
            }
            break;
        case 'fsa':
            lines = data.split(/\r\n|\n/);
            for (let i = 0; i < lines.length; i++) {
                urbanFSAAreas.push(lines[i].split(','));
            }
            break;
        case 'drop':
            dropOffItems = data.split(/\r\n|\n/);
            break;
        case 'no':
            noItems = data.split(/\r\n|\n/);
            break;
    }
}

function itemLookup() {
    $("#itemText").fadeOut('slow', function() {
        let searchItem = $("#itemToSearch").val().toLowerCase();
        isAccepted = false;
        for (i = 0; i < acceptedItems.length; i++) {
            if (searchItem === acceptedItems[i]) {
                isAccepted = 'pickup';
                break;
            }
        }
        for (i = 0; i < dropOffItems.length && isAccepted === false; i++) {
            if (searchItem === dropOffItems[i]) {
                isAccepted = 'dropoff';
                break;
            }
        }
        for (i = 0; i < noItems.length && isAccepted === false; i++) {
            if (searchItem === noItems[i]) {
                isAccepted = 'no';
                break;
            }
        }

        if (isAccepted) {
            switch (isAccepted) {
                case 'pickup':
                    $("#postCodeSubtitle").html("We accept donations of " + searchItem + "! Please schedule a pick up time and we can pick it up, or you can drop it off to any of our many donation locations.");
                    $("#itemSearchForm").fadeOut('slow', function() {
                        $("#postCodeSearchForm").fadeIn('slow');
                    });
                    break;
                case 'dropoff':
                    $("#valueVillageSubtitle").html("If you want to donate " + searchItem + ", we ask that you drop it off at Value Village Bayer's Lake.");
                    $("#itemSearchForm").fadeOut('slow', function() {
                        $("#valueVillageLocation").fadeIn('slow');
                    });
                    break;
                case 'no':
                    $("#itemText").html("I am sorry, but we cannot accept donations of " + searchItem + " at this time.");
                    //TODO: maybe link recycling?
                    break;
            }
        }
        else {
            $("#itemText").html("Sorry, I could not find any mention of " + searchItem + ", I do not believe we accept it!");
        }
        $("#itemText").fadeIn('slow');
    });
}

function schedulePickup(pickupDate) {
    $("#pickupDate").html(new Date(pickupDate).toLocaleDateString("en-us",{weekday:'long',year:'numeric',month:'long',day:'numeric'}));
    $("#scheduleSubmit").click(function() {
        if ($("#scheduleName").val()==="") {
            // TODO: show name not filled in
        }
        else if ($("#scheduleAddress").val()==="") {
            // TODO: show address not filled in
        }
        else {
            // TODO: send pickup request and send confirmation
            alert("Pickup confirmed");
        }
    });
    $("#postCodeSearchForm").fadeOut('slow', function() {
        $("#schedulePickup").fadeIn('slow');
    });
}

function postCodeLookup() {
    $("#postalCodeText").fadeOut('slow', function() {
        let postalCode = $("#postalCode").val().toUpperCase();
        if (postalCode.length === 6) {
            postalCode = postalCode.substring(0,3) + " " + postalCode.substring(3,6);
        }
        if (!postalCode.match(/^[A-z][0-9][A-z] [0-9][A-z][0-9]$/)) {
            filltext = "<p style='color:red;background-color:gold;'>Please enter a valid postal code (example: H0H 0H0)</p>"
        }
        else {
            isScheduled = false;
            scheduledTimes = [];
            for (i = 0; i < postCodeDates.length; i++) {
                if (postalCode === postCodeDates[i][0]) {
                    isScheduled = true;
                    scheduledTimes.push(postCodeDates[i][1]);
                }
            }
            options = {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            };
            neighbourhood = getNeighbourhood(postalCode);
            filltext = "";
            if (isScheduled) {
                filltext = "Yes, we will be in "
                    + (neighbourhood ? neighbourhood : "your neighbourhood")
                    + " on the following date"
                    + (scheduledTimes.length > 1 ? "s:<br/>" : ":<br/>")
                    + "Click on the calendar on any date to schedule a pickup.<ul>";
                for (i = 0; i < scheduledTimes.length; i++) {
                    console.log(scheduledTimes[i]);
                    filltext = filltext + "<li>" + new Date(scheduledTimes[i]).toLocaleDateString('en-us', options) + " <a href='#' onclick='schedulePickup(\""+scheduledTimes[i]+"\")'><i class='fas fa-calendar'></i></a></li>";
                }

                filltext = filltext + "</ul>";
            }
            else {
                options = {
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                };
                filltext = "Sorry, we do not have any pickups scheduled in "
                    + (neighbourhood ? neighbourhood : "your neighbourhood");
            }
        }
        $("#postalCodeText").html(filltext);
        $("#postalCodeText").fadeIn('slow');
    });
}

function getNeighbourhood(postalCode) {
    let fsa = postalCode.substring(0,3).toUpperCase();
    neighbourhood = false;
    for (i = 0; i < urbanFSAAreas.length; i++) {
        if (urbanFSAAreas[i][0]===fsa) {
            neighbourhood = urbanFSAAreas[i][1];
            break;
        }
    }
    return neighbourhood;
}

$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "csv/accepted-items.csv",
        success: function(response) { setGlobalVariables(response,'items'); },
        error: function(request, status, error) {},
    });

    $.ajax({
        type: "GET",
        url: "csv/post-code-dates.csv",
        success: function(response) {setGlobalVariables(response,'post');},
        error: function(request, status, error) {},
    });

    $.ajax({
        type: "GET",
        url: "csv/urban-fsa-areas.csv",
        success: function(response) {setGlobalVariables(response,'fsa');},
        error: function(request, status, error) {},
    });

    $.ajax({
        type: "GET",
        url: "csv/no-items.csv",
        success: function(response) {setGlobalVariables(response,'no');},
        error: function(request, status, error) {},
    });

    $.ajax({
        type: "GET",
        url: "csv/drop-off-items.csv",
        success: function(response) {setGlobalVariables(response,'drop');},
        error: function(request, status, error) {},
    });

    /** Page functions */

    $("#showItems").click(function() {
        $("#buttons").fadeOut('slow', function() {
            $("#itemSearchForm").fadeIn('slow');
            $("#backButton").fadeIn('slow');
        });

    });

    $("#showPostCodeDates").click(function() {
        $("#buttons").fadeOut('slow', function() {
            $("#postCodeSearchForm").fadeIn('slow');
            $("#backButton").fadeIn('slow');
        });
    });

    $("#backButton").click(function() {
        $("#itemSearchForm").fadeOut('slow');
        $("#postCodeSearchForm").fadeOut('slow');
        $("#valueVillageLocation").fadeOut('slow');
        $("#schedulePickup").fadeOut('slow');
        $("#backButton").fadeOut('slow', function() {
            $("#buttons").fadeIn('slow');
        });
    });

    $("#itemSearchSubmit").click(function(){
        itemLookup();
    });
    $("#itemToSearch").on('keyup', function(e) {
        if (e.keyCode == 13) {
            itemLookup();
        }
    });

    $("#postCodeSubmit").click(function(){
        postCodeLookup();
    });
    $("#postalCode").on('keyup', function(e) {
        if (e.keyCode == 13) {
            postCodeLookup();
        }
    });
});