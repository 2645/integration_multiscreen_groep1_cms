/*jshint jquery: true, browser: true*/
/* globals Materialize */

$(document).ready( function() {
    window.APIurl = "http://10.3.50.220:8080";
    
    showContainer("dashboard");
    
    $("#nav-dashboard").on("click", function() {
        showContainer("dashboard");
    });
    
    $("#nav-attractions").on("click", function() {
        showContainer("attractions");
    });
    
    $("#nav-games").on("click", function() {
        showContainer("games");       
    });
    
    $("#nav-qr").on("click", function() {
        showContainer("qr");
    });
    
    $("#nav-avatars").on("click", function() {
        showContainer("avatars");
    });
    
    $("#nav-users").on("click", function () {
        showContainer("users");
    });
    
    $(document).on("click", ".game-card .btn-submit", submitGameChange);
    $(document).on("click", ".attraction-card .btn-submit", submitAttractionChange);
    $(document).on("click", ".user-card .btn-submit", submitUserChange);
    $(document).on("click", ".avatar-card .btn-submit", submitAvatarChange);
    $(document).on("click", ".barcode-card .btn-submit", submitBarcodeChange);
    
    $(document).on("click", ".game-card .btn-delete", submitGameDestroy);
    $(document).on("click", ".attraction-card .btn-delete", submitAttractionDestroy);
    $(document).on("click", ".user-card .btn-delete", submitUserDestroy);
    $(document).on("click", ".avatar-card .btn-delete", submitAvatarDestroy);
    $(document).on("click", ".barcode-card .btn-delete", submitBarcodeDestroy);
    
    $(document).on("click", "#btn-new-game", submitGameNew);
    $(document).on("click", "#btn-new-attraction", submitAttractionNew);
    $(document).on("click", "#btn-new-user", submitUserNew);
    $(document).on("click", "#btn-new-avatar", submitAvatarNew);
    $(document).on("click", "#btn-new-qr", submitBarcodeNew);
    
    $('#fab-games .modal-trigger').leanModal();
    $('#fab-attractions .modal-trigger').leanModal();
    $('#fab-users .modal-trigger').leanModal();
    $('#fab-avatars .modal-trigger').leanModal();
    $('#fab-qr .modal-trigger').leanModal();
    
    $(document).on("click", "#fab-games .btn-reload", fetchGames);
    $(document).on("click", "#fab-attractions .btn-reload", fetchAttractions);
    $(document).on("click", "#fab-users .btn-reload", fetchUsers);
    $(document).on("click", "#fab-avatars .btn-reload", fetchAvatars);
    $(document).on("click", "#fab-qr .btn-reload", fetchBarcodes);
    
    $("#input-attraction-location").locationpicker({
        location: {
            latitude: 51.081248,
            longitude: 2.597926,
            enableReverseGeocode: false
        },
        radius: 0,
        zoom: 14,
        onchanged: function(currentLocation, radius, isMarkerDropped) {
            $(this).attr("long", currentLocation.longitude);
            $(this).attr("lat", currentLocation.latitude);
        }	
    });
    $('#fab-attractions').on("click", {loc_path: "#input-attraction-location"}, autosize);
});

function showContainer(name) {
    var text = "",
        containsData = $("#container-" + name + " > .row > div").length >= 1;
    
    $("main > .container").hide();
    $("#container-" + name).show();
    $(".button-collapse").sideNav('hide');
    
    switch(name) {
        case "attractions":
            text = "Attracties";
            if(!containsData) {
                fetchAttractions();
            }
            
            break;
            
        case "games":
            text = "Games";
            if(!containsData) {
                fetchGames();
            }
            break;
            
        case "qr":
            text = "QR-codes";
            if(!containsData) {
                fetchBarcodes();
            }
            break;
            
        case "avatars":
            text = "Avatars";
            if(!containsData) {
                fetchAvatars();
            }
            break;
            
        case "users":
            text = "Gebruikers";
            if(!containsData) {
                fetchUsers();
            }
            break;
            
        default:
            text = name.capitalize();
    }
    
    $("#topnav .page-title").text(text);
}

String.prototype.capitalize = function() {
    return (this + '').replace(/^([a-z])|\s+([a-z])/g, function ($1) {
        return $1.toUpperCase();
    });
};

function convertImageToBase64(file, callback) {
    var img,
        reader = new FileReader();
    
    if (file) {
        if(file[0]) {
            reader.readAsDataURL(file[0]);
            reader.onload = function (encodedFile) {            
                var result = encodedFile.srcElement.result;

                if(result !== undefined && result !== null) {
                    img = result;
                    callback(img);

                } else {
                    console.log("Error reading file");
                    Materialize.toast('Fout bij het inlezen van de afbeelding', 5000);
                    callback(null);
                }
            };
            
        } else {
            console.log("No file selected");
            callback(null);
        }
        
    } else {
        Materialize.toast('De browser biedt geen ondersteuning voor het opsturen van afbeeldingen.', 5000);
        callback(null);
    }
}

function makeBase64String(base64) {
    return "data:image/png;base64," + base64;
}