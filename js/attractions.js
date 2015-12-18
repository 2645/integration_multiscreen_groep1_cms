/* jshint jquery: true, browser: true */
/* globals Materialize */

$(document).ready(function () {
    $(document).on("click", "#btn-attraction-submit", submitAttractionChange);
    $(document).on("click", "#btn-new-attraction", submitAttractionNew);
    $('#fab-attractions').leanModal();
    fetchAttractions();
});

function fetchAttractions() {
    $("main > .container > .row").empty();
    $.ajax({
        url: "http://localhost:8080/attractions/list",
        dataType: 'jsonp',
        success: function (json) {
            for (var i = 0; i < json.length; i++) {
                var desc = json[i].description,
                    name = json[i].name,
                    queue = json[i].queuetime,
                    img = json[i].img,
                    loc_lat = json[i].lat,
                    loc_long = json[i].lon,
                    attraction_id = json[i].id,
                    attraction_path = "#attraction" + attraction_id,
                    loc_path = '#' + "loc-attraction" + attraction_id;

                var str = "<div class='col s12 m6 l4'><div class='card small' id='attraction" + attraction_id + "'><div class='card-image waves-effect waves-block waves-light'><img class='activator' src='img/sample.jpg'></div><div class='card-content'>";
                str += "<span class='card-title activator grey-text text-darken-4'>" + name + "<i class='material-icons right'>edit</i></span>";
                str += "<p class='truncate'>" + desc + "</p>";
                str += "</div><div class='card-reveal'><span class='cardtitle grey-text text-darken-4'>" + name + "<i class='material-icons card-title right' style='display: inline'>close</i></span>" + "<div class='reveal-content'>";

                str += "<div class='input-field col s12'><input value='" + name + "' type='text' class='validate input-name'><label class='active' for='first_name2'>Naam</label></div>";
                str += "<div class='input-field col s12'><textarea class='materialize-textarea input-desc'>" + desc + "</textarea><label class='active' for='textarea1'>Omschrijving</label></div>";
                str += "<div class='row'><div class='input-field col s6'><input value='" + queue + "' type='number' min='0' class='validate input-time'><label class='active' for='first_name2'>Wachttijd</label></div><div class='col s6'><p class='time-input-label'> minuten</p></div></div>";
                str += "<div class='location-picker' id='loc-attraction" + attraction_id + "'></div>";
                str += "<a class='waves-effect waves-light btn btn-submit right card-title' id='btn-attraction-submit'><i class='material-icons left'>save</i>Opslaan</a>";

                str += "</div></div></div></div>";
                $("#container-attractions > .row").append(str);
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
        },
        error: function (data) {
            console.error("Error retrieving data");
            console.error(data);
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
        loc_long = $(attraction_path + " .location-picker").attr("long");

    Materialize.toast('Data naar de server versturen...', 2000);

    console.log("ID: " + attraction_id);
    console.log("Path: " + attraction_path);
    console.log("Description: " + desc);
    console.log("Name: " + name);
    console.log("Queue: " + queue);
    console.log("Lat: " + loc_lat);
    console.log("Long: " + loc_long);

    $.ajax({
        method: "POST",
        url: "http://localhost:8080/attractions/update",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
            id: attraction_id,
            name: name,
            description: desc,
            queuetime: queue,
            lat: loc_lat,
            lon: loc_long
        }),
        success: function () {
            $(attraction_path + " .card-content p").text(desc);
            $(attraction_path + " .card-content .card-title").contents()[0].textContent = name;
            $(attraction_path + " .card-reveal .cardtitle").text(name);
            Materialize.toast('Data succesvol bijgewerkt.', 2000);
        },
        error: function (data) {
            console.error("Error retrieving data");
            console.error(data);
        }
    });
}

function submitAttractionNew() {
    var desc = $("#input-attraction-desc").val(),
        name = $("#input-attraction-name").val(),
        queue = $("#input-attraction-queue").val();

    Materialize.toast('Nieuw spel naar de server versturen...', 2000);

    $.ajax({
        url: "http://localhost:8080/attractions/create",
        dataType: 'jsonp',
        data: {
            attraction_name: name,
            attraction_description: desc,
            attraction_queuetime: queue
        },
        success: function () {
            Materialize.toast('Spel succesvol toegevoegd.', 2000);
            Materialize.toast('Lijst met spellen verversen...', 2000);
            fetchAttractions();
        },
        error: function (data) {
            console.error("Error retrieving data");
            console.error(data);
        }
    });
}

function autosize(e) {
    setTimeout(function () {
        $(e.data.loc_path).locationpicker('autosize');
    }, 1000);
}