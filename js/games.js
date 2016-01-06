/* jshint jquery: true, browser: true */
/* globals Materialize */

function fetchGames() {
    var container = "#container-games";
    
    Materialize.toast('Lijst met spellen verversen...', 2000);
    $("main > .container > .row").empty();
    addSpinner(container);
    
    $.ajax({
        url: window.APIurl + "/games/list",
        dataType: 'jsonp',
        success: function (json) {
            for (var i = 0; i < json.length; i++) {
                var desc = json[i].description,
                    name = json[i].name,
                    game_id = json[i].id,
                    img = new Image().src = "data:image/png;base64," + json[i].icon;

                var str = "<div class='col s12 m6 l4'><div class='card game-card small' id='game" + game_id + "'><div class='card-image waves-effect waves-block waves-light'><img class='activator' src='" + img + "'></div><div class='card-content'>";
                str += "<span class='card-title activator grey-text text-darken-4'>" + name + "<i class='material-icons right'>edit</i></span>";
                str += "<p class='truncate'>" + desc + "</p>";
                str += "</div><div class='card-reveal'><span class='cardtitle grey-text text-darken-4'>" + name + "<i class='material-icons card-title right' style='display: inline'>close</i></span>";
                str += "<div class='reveal-content'>";
                str += "<div class='file-field input-field col s12'><div class='btn btn-small red'><span>Icon kiezen</span><input type='file' class='input-file'></div><div class='file-path-wrapper'><input class='file-path validate' type='text'></div></div>";
                str += "<div class='input-field col s12'><input value='" + name + "' type='text' class='validate input-name'><label class='active' for='first_name2'>Naam</label></div>" + "<div class='input-field col s12'><textarea class='materialize-textarea input-desc'>" + desc + "</textarea><label class='active' for='textarea1'>Omschrijving</label></div>";
                str += "<a class='waves-effect waves-light btn btn-delete card-title'><i class='material-icons left'>save</i>Verwijderen</a>";
                str += "<a class='waves-effect waves-light btn btn-submit card-title'><i class='material-icons left'>save</i>Opslaan</a>" + "</div></div></div></div>";
                $(container + " > .row").append(str);
            }
            removeSpinner(container);
        },
        error: function (data) {
            Materialize.toast("Fout bij het ophalen van de spellen: " + data.status + " " + data.statusText, 2000);
            console.error(data);
            removeSpinner(container);
        }
    });
}

function submitGameChange(e) {
    var game_path = "#" + $(e.target).parents(".card").attr('id'),
        game_id = game_path.replace("#game", ""),
        desc = $(game_path + " .input-desc").val(),
        name = $(game_path + " .input-name").val(),
        file = $(game_path + " .input-file").prop("files"),
        data = {
            id: game_id,
            name: name, 
            description: desc
        };
    
    convertImageToBase64(file, submit);
    
    function submit(img) {
        if(img) {
            data.icon = img;
        }
        
        Materialize.toast('Data naar de server versturen...', 2000);
        $.ajax({
            type: "POST",
            url: window.APIurl + "/games/update",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(data),
            success: function () {
                Materialize.toast('Data succesvol bijgewerkt.', 2000);
                fetchGames();
            },
            error: function (data) {
                Materialize.toast("Fout bij het updaten van het spel: " + data.status + " " + data.statusText, 2000);
                console.error(data);
            }
        });
    }
}

function submitGameNew() {
    var desc = $("#input-game-desc").val(),
        name = $("#input-game-name").val(),
        file = $("#input-game-img").prop("files"),
        data = {
            name: name, 
            description: desc
        };
    
    Materialize.toast('Nieuw spel naar de server versturen...', 2000);
    
    convertImageToBase64(file, submit);
    
    function submit(img) {
        if(img) {
            data.icon = img;
        }
        console.log(data);
        Materialize.toast('Data naar de server versturen...', 2000);
        $.ajax({
            type: "POST",
            url: window.APIurl + "/games/create",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(data),
            success: function () {
                Materialize.toast('Spel succesvol toegevoegd.', 2000);
                fetchGames();
            },
            error: function (data) {
                Materialize.toast("Fout bij het indienen van het nieuwe spel: " + data.status + " " + data.statusText, 2000);
                console.error(data);
            }
        });
    }
}

function submitGameDestroy(e) {
    var game_path = "#" + $(e.target).parents(".card").attr('id'),
        game_id = game_path.replace("#game", ""),
        data = {
            game_id: game_id
        };
    
    Materialize.toast('Spel verwijderen...', 2000);
    $.ajax({
        type: "GET",
        url: window.APIurl + "/games/destroy",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: data,
        success: function () {
            Materialize.toast('Spel succesvol verwijderd.', 2000);
            fetchGames();
        },
        error: function (data) {
            Materialize.toast("Fout bij het verwijderen van het spel: " + data.status + " " + data.statusText, 2000);
            console.error(data);
        }
    });
}

function autosize(e) {
    setTimeout(function () {
        $(e.data.loc_path).locationpicker('autosize');
    }, 1000);
}