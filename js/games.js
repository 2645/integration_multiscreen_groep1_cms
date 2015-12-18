/* jshint jquery: true, browser: true */
/* globals Materialize */

var url = "10.3.50.220:8080";

$(document).ready(function() {
    $(document).on("click", "#btn-game-submit", submitGameChange);
    $(document).on("click", "#btn-new-game", submitGameNew);
    $('#fab-games').leanModal();
    fetchGames();
});

function fetchGames() {
    $("main > .container > .row").empty();
    $.ajax({
        url: url + "/games/list",
        dataType: 'jsonp',
        success: function (json) {
            for (var i = 0; i < json.length; i++) {
                var desc = json[i].description,
                    name = json[i].name,
                    game_id = json[i].id;

                var str = "<div class='col s12 m6 l4'><div class='card small' id='game" + game_id + "'><div class='card-image waves-effect waves-block waves-light'><img class='activator' src='img/sample.jpg'></div><div class='card-content'>";
                str += "<span class='card-title activator grey-text text-darken-4'>" + name + "<i class='material-icons right'>edit</i></span>";
                str += "<p class='truncate'>" + desc + "</p>";
                str += "</div><div class='card-reveal'><span class='cardtitle grey-text text-darken-4'>" + name + "<i class='material-icons card-title right' style='display: inline'>close</i></span>" + "<div class='reveal-content'>" + "<div class='input-field col s12'><input value='" + name + "' type='text' class='validate input-name'><label class='active' for='first_name2'>Naam</label></div>" + "<div class='input-field col s12'><textarea class='materialize-textarea input-desc'>" + desc + "</textarea><label class='active' for='textarea1'>Omschrijving</label></div>" + "<a class='waves-effect waves-light btn btn-submit right card-title' id='btn-game-submit'><i class='material-icons left'>save</i>Opslaan</a>" + "</div></div></div></div>";
                $("#container-games > .row").append(str);
            }
        },
        error: function (data) {
            console.error("Error retrieving data");
            console.error(data);
        }
    });
}

function submitGameChange(e) {
    var game_path = "#" + $(e.target).parents(".card").attr('id'),
        game_id = game_path.replace("#game", ""),
        desc = $(game_path + " .input-desc").val(),
        name = $(game_path + " .input-name").val();

    Materialize.toast('Data naar de server versturen...', 2000);

    console.log("ID: " + game_id);
    console.log("Path: " + game_path);
    console.log("Description: " + desc);
    console.log("Name: " + name);

    $.ajax({
        url: url + "/games/update",
        dataType: 'jsonp',
        data: {
            id: game_id,
            name: name,
            description: desc
        },
        success: function () {
            $(game_path + " .card-content p").text(desc);
            $(game_path + " .card-content .card-title").contents()[0].textContent = name;
            $(game_path + " .card-reveal .cardtitle").text(name);
            Materialize.toast('Data succesvol bijgewerkt.', 2000);
        },
        error: function (data) {
            console.error("Error retrieving data");
            console.error(data);
        }
    });
}

function submitGameNew() {
    var desc = $("#input-game-desc").val(),
        name = $("#input-game-name").val();

    Materialize.toast('Nieuw spel naar de server versturen...', 2000);

    $.ajax({
        url: url + "/games/create",
        dataType: 'jsonp',
        data: {
            name: name,
            description: desc
        },
        success: function () {
            Materialize.toast('Spel succesvol toegevoegd.', 2000);
            Materialize.toast('Lijst met spellen verversen...', 2000);
            fetchGames();
        },
        error: function (data) {
            console.error("Error retrieving data");
            console.error(data);
        }
    });
}