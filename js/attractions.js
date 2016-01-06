/* jshint jquery: true, browser: true */
/* globals Materialize, makeBase64String */

function fetchAttractions() {
    var container = "#container-attractions";
    
    Materialize.toast('Lijst met attracties verversen...', 2000);
    $(container + " > .row").empty();
    addSpinner(container);
    
    $.ajax({
        url: window.APIurl + "/attractions/list",
        dataType: 'jsonp',
        success: function (json) {
            for (var i = 0; i < json.length; i++) {
                var desc = json[i].description,
                    name = json[i].name,
                    queue = json[i].queuetime,
                    img = makeBase64String(json[i].img),
                    loc_lat = json[i].lat,
                    loc_long = json[i].lon,
                    attraction_id = json[i].id,
                    attraction_path = "#attraction" + attraction_id,
                    loc_path = '#' + "loc-attraction" + attraction_id;

                var str = "<div class='col s12 m6 l4'><div class='card attraction-card small' id='attraction" + attraction_id + "'><div class='card-image waves-effect waves-block waves-light'><img class='activator' src='" + img + "'></div><div class='card-content'>";
                str += "<span class='card-title activator grey-text text-darken-4'>" + name + "<i class='material-icons right'>edit</i></span>";
                str += "<p class='truncate'>" + desc + "</p>";
                str += "</div><div class='card-reveal'><span class='cardtitle grey-text text-darken-4'>" + name + "<i class='material-icons card-title right' style='display: inline'>close</i></span>" + "<div class='reveal-content'>";
                
                str += "<div class='file-field input-field col s12'><div class='btn btn-small red'><span>Foto kiezen</span><input type='file' class='input-file'></div><div class='file-path-wrapper'><input class='file-path validate' type='text'></div></div>";
                str += "<div class='input-field col s12'><input value='" + name + "' type='text' class='validate input-name'><label class='active' for='first_name2'>Naam</label></div>";
                str += "<div class='input-field col s12'><textarea class='materialize-textarea input-desc'>" + desc + "</textarea><label class='active' for='textarea1'>Omschrijving</label></div>";
                str += "<div class='row margin-auto'><div class='input-field col s6'><input value='" + queue + "' type='number' min='0' class='validate input-time'><label class='active' for='first_name2'>Wachttijd</label></div><div class='col s6'><p class='time-input-label'> minuten</p></div></div>";
                str += "<div class='location-picker' id='loc-attraction" + attraction_id + "'></div>";
                str += "<a class='waves-effect waves-light btn btn-delete card-title'><i class='material-icons left'>delete</i>Verwijderen</a>";
                str += "<a class='waves-effect waves-light btn btn-submit card-title'><i class='material-icons left'>save</i>Opslaan</a>";
                str += "</div></div></div></div>";
                
                $(container + " > .row").append(str);
                $(loc_path).locationpicker({
                    location: {
                        latitude: loc_lat === undefined ? 51.081248 : loc_lat,
                        longitude: loc_long === undefined ? 2.597926 : loc_long,
                        enableReverseGeocode: false
                    },
                    radius: 0,
                    zoom: 14,
                    onchanged: function(currentLocation, radius, isMarkerDropped) {
                        $(this).attr("long", currentLocation.longitude);
                        $(this).attr("lat", currentLocation.latitude);
                    }	
                });
                $(loc_path).attr("long", loc_long);
                $(loc_path).attr("lat", loc_lat);
                $(attraction_path + " span.card-title .material-icons").on("click", {loc_path: loc_path}, autosize);
            }
            removeSpinner(container);
        },
        error: function (data) {
            Materialize.toast("Fout bij het ophalen van de attractie: " + data.status + " " + data.statusText, 2000);
            console.error(data);
            removeSpinner(container);
        }
    });
}

function submitAttractionChange(e) {
    var attraction_path = "#" + $(e.target).parents(".card").attr('id'),
        attraction_id = attraction_path.replace("#attraction", ""),
        desc = $(attraction_path + " .input-desc").val(),
        name = $(attraction_path + " .input-name").val(),
        queue = $(attraction_path + " .input-time").val(),
        loc_lat = $(attraction_path + " .location-picker").attr("lat"),
        loc_long = $(attraction_path + " .location-picker").attr("long"),
        file = $(attraction_path + " .input-file").prop("files"),
        data = {
            id: attraction_id,
            queuetime: queue,
            name: name, 
            description: desc,
            lat: loc_lat === undefined ? 51.081248 : loc_lat,
            long: loc_long === undefined ? 2.597926 : loc_long
        };
    convertImageToBase64(file, submit);
    
    function submit(img) {
        if(img) {
            data.img = img;
        }
        
        Materialize.toast('Data naar de server versturen...', 2000);
        $.ajax({
            type: "POST",
            url: window.APIurl + "/attractions/update",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(data),
            success: function () {
                Materialize.toast('Data succesvol bijgewerkt.', 2000);
                fetchAttractions();
            },
            error: function (data) {
                Materialize.toast("Fout bij het updaten van de attractie: " + data.status + " " + data.statusText, 2000);
                console.error(data);
            }
        });
    }
}

function submitAttractionNew() {
    var desc = $("#input-attraction-desc").val(),
        name = $("#input-attraction-name").val(),
        queue = $("#input-attraction-queue").val(),
        loc_lat = $("#input-attraction-location").attr("lat"),
        loc_long = $("#input-attraction-location").attr("long"),
        file = $("#input-attraction-img").prop("files"),
        data = {
            queuetime: queue,
            name: name, 
            description: desc,
            lat: loc_lat === undefined ? 51.081248 : loc_lat,
            lon: loc_long === undefined ? 2.597926 : loc_long
        };
    
    convertImageToBase64(file, submit);
    
    function submit(img) {
        if(img) {
            data.img = img;
        }
        
        Materialize.toast('Nieuw spel naar de server versturen...', 2000);
        $.ajax({
            type: "POST",
            url: window.APIurl + "/attractions/create",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(data),
            success: function () {
                Materialize.toast('Attractie succesvol toegevoegd.', 2000);
                Materialize.toast('Lijst met attracties verversen...', 2000);
                fetchAttractions();
            },
            error: function (data) {
                Materialize.toast("Fout bij het indienen van de nieuwe attractie: " + data.status + " " + data.statusText, 2000);
                console.error(data);
            }
        });
    }
}

function submitAttractionDestroy(e) {
    var attraction_path = "#" + $(e.target).parents(".card").attr('id'),
        attraction_id = attraction_path.replace("#attraction", ""),
        data = {
            attraction_id: attraction_id
        };
    
    Materialize.toast('Attractie verwijderen...', 2000);
    $.ajax({
        type: "GET",
        url: window.APIurl + "/attractions/destroy",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: data,
        success: function () {
            Materialize.toast('Attractie succesvol verwijderd.', 2000);
            fetchAttractions();
        },
        error: function (data) {
            Materialize.toast("Fout bij het verwijderen van de attractie: " + data.status + " " + data.statusText, 2000);
            console.error(data);
        }
    });
}

function autosize(e) {
    setTimeout(function () {
        $(e.data.loc_path).locationpicker('autosize');
    }, 1000);
}