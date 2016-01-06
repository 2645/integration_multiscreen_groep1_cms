/* jshint jquery: true, browser: true */
/* globals Materialize */

function fetchUsers() {
    var container = "#container-users";
    
    Materialize.toast('Lijst met gebruikers verversen...', 2000);
    $(container + " > .row").empty();
    addSpinner(container);
    
    $.ajax({
        url: window.APIurl + "/users/list",
        dataType: 'jsonp',
        success: function (json) {
            for (var i = 0; i < json.length; i++) {
                var user_id = json[i].id,
                    firstname = json[i].fname,
                    lastname = json[i].lname,
                    name = firstname + " " + lastname,
                    mail = json[i].mail,
                    balance = json[i].balance,
                    avatar_id = json[i].avatarId,
                    img;
                
                $.ajax({
                    url: window.APIurl + "/avatars/lookup",
                    dataType: 'json',
                    async: false,
                    data: {
                        avatar_id: avatar_id
                    },
                    success: function (json) {
                        if(json !== null) {
                            img = makeBase64String(json.img);
                            
                            var str = "<div class='col s12 m6 l4'><div class='card user-card small' id='user" + user_id + "'><div class='card-image waves-effect waves-block waves-light'><img class='activator' src='" + img + "'></div><div class='card-content'>";
                            str += "<span class='card-title activator grey-text text-darken-4'>" + name + "<i class='material-icons right'>edit</i></span>";
                            str += "<p class='truncate'>" + "<b>E-mailadres:</b> " + mail + "</p>";
                            str += "</div><div class='card-reveal'><span class='cardtitle grey-text text-darken-4'>" + name + "<i class='material-icons card-title right' style='display: inline'>close</i></span>" + "<div class='reveal-content'>";

                            str += "<div class='input-field col s12'><input value='" + firstname + "' type='text' class='validate input-firstname'><label class='active' for='first_name2'>Voornaam</label></div>";
                            str += "<div class='input-field col s12'><input value='" + lastname + "' type='text' class='validate input-lastname'><label class='active' for='first_name2'>Achternaam</label></div>";
                            str += "<div class='input-field col s12'><input value='" + mail + "' type='email' class='validate input-mail'><label class='active' for='first_name2'>E-mailadres</label></div>";
                            str += "<div class='row margin-auto'><div class='input-field col s6'><input value='" + balance + "' type='number' min='0' class='validate input-balance'><label class='active' for='first_name2'>Aantal cocacoins</label></div><div class='col s6'><p class='balance-input-label'> coca coins</p></div></div>";
                            str += "<div class='input-field col s12'><input value='" + avatar_id + "' type='text' class='validate input-avatar-id'><label class='active' for='first_name2'>Avatar ID</label></div>";
                            str += "<a class='waves-effect waves-light btn btn-delete card-title'><i class='material-icons left'>save</i>Verwijderen</a>";
                            str += "<a class='waves-effect waves-light btn btn-submit card-title'><i class='material-icons left'>save</i>Opslaan</a>";
                            str += "</div></div></div></div>";

                            $(container + " > .row").append(str);
                        }
                    },
                    error: function (data) {
                        Materialize.toast("Fout bij het ophalen van de avatar: " + data.status + " " + data.statusText, 2000);
                        console.error(data);
                    }
                });
            }
            removeSpinner(container);
        },
        error: function (data) {
            Materialize.toast("Fout bij het ophalen van de gebruikers: " + data.status + " " + data.statusText, 2000);
            console.error(data);
            removeSpinner(container);
        }
    });
}

function submitUserChange(e) {
    var user_path = "#" + $(e.target).parents(".card").attr('id'),
        user_id = user_path.replace("#user", ""),
        firstname = $(user_path + " .input-firstname").val(),
        lastname = $(user_path + " .input-lastname").val(),
        mail = $(user_path + " .input-mail").val(),
        balance = $(user_path + " .input-balance").val(),
        file = $(user_path + " .input-file").prop("files"),
        data = {
            id: user_id,
            balance: balance,
            avatarId: name, 
        };
    
    convertImageToBase64(file, submit);
    
    function submit(img) {
        if(img) {
            data.img = img;
        }
        
        Materialize.toast('Data naar de server versturen...', 2000);
        $.ajax({
            type: "POST",
            url: window.APIurl + "/users/update",
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

function submitUserNew() {
    
}

function submitUserDestroy(e) {
    var user_path = "#" + $(e.target).parents(".card").attr('id'),
        user_id = user_path.replace("#user", ""),
        data = {
            id: user_id
        };
    
    Materialize.toast('Gebruiker verwijderen...', 2000);
    $.ajax({
        type: "GET",
        url: window.APIurl + "/users/destroy",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: data,
        success: function () {
            Materialize.toast('Gebruiker succesvol verwijderd.', 2000);
            fetchUsers();
        },
        error: function (data) {
            Materialize.toast("Fout bij het verwijderen van de gebruiker: " + data.status + " " + data.statusText, 2000);
            console.error(data);
        }
    });
}