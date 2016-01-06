/* jshint jquery: true, browser: true */
/* globals Materialize, convertImageToBase64 */

function getAvatarByID(avatarID, userID) {
    $.ajax({
        url: window.APIurl + "/avatars/lookup",
        dataType: 'json',
        data: {
            avatar_id: avatarID
        },
        success: function (json) {
            if(json !== null) {
                $("#user" + userID + " img.activator").src = "data:image/png;base64," + json.img;
            }
        },
        error: function (data) {
            Materialize.toast("Fout bij het ophalen van de avatar: " + data.status + " " + data.statusText, 2000);
            console.error(data);
        }
    });
}

function fetchAvatars() {
    var container = "#container-avatars";
    
    Materialize.toast('Lijst met avatars verversen...', 2000);
    $(container + " > .row").empty();
    addSpinner(container);
    
    $.ajax({
        url: window.APIurl + "/avatars/list",
        dataType: 'jsonp',
        success: function (json) {
            for (var i = 0; i < json.length; i++) {
                var avatar_id = json[i].id,
                    name = json[i].name,
                    price = json[i].price,
                    img = "data:image/png;base64," + json[i].img;
                
                var str = "<div class='col s12 m6 l4'><div class='card avatar-card small' id='avatar" + avatar_id + "'><div class='card-image waves-effect waves-block waves-light'><img class='activator' src='" + img + "'></div><div class='card-content'>";
                str += "<span class='card-title activator grey-text text-darken-4'>" + name + "<i class='material-icons right'>edit</i></span>";
                str += "<p class='truncate'>" + "<b>Prijs:</b> " + price + " cocacoins" + "</p>";
                str += "</div><div class='card-reveal'><span class='cardtitle grey-text text-darken-4'>" + name + "<i class='material-icons card-title right' style='display: inline'>close</i></span>" + "<div class='reveal-content'>";
                
                str += "<div class='file-field input-field col s12'><div class='btn btn-small red'><span>Icon kiezen</span><input type='file' class='input-file'></div><div class='file-path-wrapper'><input class='file-path validate' type='text'></div></div>";    
                str += "<div class='input-field col s12'><input value='" + name + "' type='text' class='validate input-name'><label class='active' for='first_name2'>Naam</label></div>";
                str += "<div class='row margin-auto'><div class='input-field col s6'><input value='" + price + "' type='number' min='0' class='validate input-price'><label class='active' for='first_name2'>Prijs</label></div><div class='col s6'><p class='price-input-label'> coca coins</p></div></div>";
                str += "<a class='waves-effect waves-light btn btn-delete card-title'><i class='material-icons left'>save</i>Verwijderen</a>";
                str += "<a class='waves-effect waves-light btn btn-submit card-title' id='btn-avatar-submit'><i class='material-icons left'>save</i>Opslaan</a>";
                str += "</div></div></div></div>";

                $(container + " > .row").append(str);
            }
            removeSpinner(container);
        },
        error: function (data) {
            Materialize.toast("Fout bij het ophalen van de avatars: " + data.status + " " + data.statusText, 2000);
            console.error(data);
            removeSpinner(container);
        }
    });
}

function submitAvatarChange(e) {
    var avatar_path = "#" + $(e.target).parents(".card").attr('id'),
        avatar_id = avatar_path.replace("#avatar", ""),
        name = $(avatar_path + " .input-name").val(),
        price = $(avatar_path + " .input-price").val(),
        file = $(avatar_path + " .input-file").prop("files"),
        data = {
            id: avatar_id,
            price: price,
            name: name, 
        };
    
    convertImageToBase64(file, submit);
    
    function submit(img) {
        if(img) {
            data.img = img;
        }
        
        Materialize.toast('Data naar de server versturen...', 2000);
        $.ajax({
            type: "POST",
            url: window.APIurl + "/avatars/update",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(data),
            success: function () {
                Materialize.toast('Data succesvol bijgewerkt.', 2000);
                fetchAvatars();
            },
            error: function (data) {
                Materialize.toast("Fout bij het updaten van de avatar: " + data.status + " " + data.statusText, 2000);
                console.error(data);
            }
        });
    }
}

function submitAvatarNew() {
    var name = $("#input-avatar-name").val(),
        price = $("#input-avatar-price").val(),
        file = $("#input-avatar-img").prop("files"),
        data = {
            price: price,
            name: name, 
        };
    
    convertImageToBase64(file, submit);
    
    function submit(img) {
        if(img) {
            data.img = img;
        }
        
        Materialize.toast('Nieuwe avatar naar de server versturen...', 2000);
        $.ajax({
            type: "POST",
            url: window.APIurl + "/avatars/create",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(data),
            success: function () {
                Materialize.toast('Avatar succesvol toegevoegd.', 2000);
                fetchAvatars();
            },
            error: function (data) {
                Materialize.toast("Fout bij het indienen van de nieuwe avatar: " + data.status + " " + data.statusText, 2000);
                console.error(data);
            }
        });
    }
}

function submitAvatarDestroy(e) {
    var avatar_path = "#" + $(e.target).parents(".card").attr('id'),
        avatar_id = avatar_path.replace("#avatar", ""),
        data = {
            avatar_id: avatar_id
        };
    
    Materialize.toast('Avatar verwijderen...', 2000);
    $.ajax({
        type: "GET",
        url: window.APIurl + "/avatars/destroy",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: data,
        success: function () {
            Materialize.toast('Avatar succesvol verwijderd.', 2000);
            fetchAvatars();
        },
        error: function (data) {
            Materialize.toast("Fout bij het verwijderen van de avatar: " + data.status + " " + data.statusText, 2000);
            console.error(data);
        }
    });
}