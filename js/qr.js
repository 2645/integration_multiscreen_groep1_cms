/* jshint jquery: true, browser: true */
/* globals Materialize, convertImageToBase64 */

function fetchBarcodes() {
    var container = "#container-qr";
    
    Materialize.toast('Lijst met QR-codes verversen...', 2000);
    $(container + " > .row").empty();
    addSpinner(container);
    
    $.ajax({
        url: window.APIurl + "/barcode/list",
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (json) {
            for (var i = 0; i < json.length; i++) {
                var barcode_id = json[i].id,
                    scanned = json[i].scanned,
                    date = json[i].date,
                    title = "Barcode #" + i,
                    reward = json[i].reward,
                    status = scanned ? "Gescand op " + date : "Nog niet gescand";

                var str = "<div class='col s12 m6 l4'><div class='card qr-card small' id='qr" + barcode_id + "'><div class='card-image waves-effect waves-block waves-light'></div><div class='card-content'>";
                str += "<span class='card-title activator grey-text text-darken-4'>" + title + "<i class='material-icons right'>edit</i></span>";
                str += "<p class='truncate'><b>Beloning:</b> " + reward + " cocacoins" + "</p>";
                str += "</div><div class='card-reveal'><span class='cardtitle grey-text text-darken-4'>" + title + "<i class='material-icons card-title right' style='display: inline'>close</i></span>" + "<div class='reveal-content'>";
  
                str += "<div class='row margin-auto'><div class='col s12' style='margin-top: 15px;'><input type='checkbox' " + (scanned ? "checked='checked' " : "") + "class='validate input-scanned filled-in' id='input-qr-scanned-" + i + "'><label class='active' for='input-qr-scanned-" + i + "'>Is de barcode gescand?</label></div></div>";
                str += "<div class='row margin-auto'><div class='input-field col s6'><input value='" + reward + "' type='number' min='0' class='validate input-reward'><label class='active' for='first_name2'>Beloning</label></div><div class='col s6'><p class='price-input-label'> coca coins</p></div></div>";
                str += "<a class='waves-effect waves-light btn btn-delete card-title'><i class='material-icons left'>save</i>Verwijderen</a>";
                str += "<a class='waves-effect waves-light btn btn-submit card-title' id='btn-avatar-submit'><i class='material-icons left'>save</i>Opslaan</a>";
                str += "</div></div></div></div>";

                $(container + " > .row").append(str);
                $("#qr" + barcode_id + " .card-image").qrcode({
                    size: 150,
                    color: "#3a3",
                    text: barcode_id
                });
                $("#qr" + barcode_id + " .card-image canvas").addClass("activator");
            }
            removeSpinner(container);
        },
        error: function (data) {
            Materialize.toast("Fout bij het ophalen van de QR-codes: " + data.status + " " + data.statusText, 2000);
            console.error(data);
            removeSpinner(container);
        }
    });
}

function submitBarcodeChange(e) {
    var qr_path = "#" + $(e.target).parents(".card").attr('id'),
        qr_id = qr_path.replace("#qr", ""),
        scanned = $(qr_path + " .input-scanned").prop("checked"),
        reward = $(qr_path + " .input-reward").val(),
        data = {
            id: qr_id,
            reward: reward,
            scanned: scanned, 
        };
    
    Materialize.toast('Data naar de server versturen...', 2000);
    
    $.ajax({
        type: "POST",
        url: window.APIurl + "/barcode/update",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: data,
        success: function () {
            Materialize.toast('Data succesvol bijgewerkt.', 2000);
            fetchBarcodes();
        },
        error: function (data) {
            Materialize.toast("Fout bij het updaten van de QR-code: " + data.status + " " + data.statusText, 2000);
            console.error(data);
        }
    });
}

function submitBarcodeNew() {
    var scanned = $("#input-qr-scanned").prop("checked"),
        reward = $("#input-qr-reward").val(),
        data = {
            reward: reward,
            scanned: scanned, 
        };
    
    Materialize.toast('Data naar de server versturen...', 2000);
    
    $.ajax({
        type: "GET",
        url: window.APIurl + "/barcode/create",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: data,
        success: function () {
            Materialize.toast('Data succesvol bijgewerkt.', 2000);
            fetchBarcodes();
        },
        error: function (data) {
            Materialize.toast("Fout bij het updaten van de QR-code: " + data.status + " " + data.statusText, 2000);
            console.error(data);
        }
    });
}

function submitBarcodeDestroy(e) {
    var qr_path = "#" + $(e.target).parents(".card").attr('id'),
        qr_id = qr_path.replace("#qr", ""),
        data = {
            id: qr_id
        };
    
    Materialize.toast('QR-code verwijderen...', 2000);
    
    $.ajax({
        type: "GET",
        url: window.APIurl + "/barcode/destroy",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: data,
        success: function () {
            Materialize.toast('QR-code succesvol verwijderd.', 2000);
            fetchBarcodes();
        },
        error: function (data) {
            Materialize.toast("Fout bij het verwijderen van de QR-code: " + data.status + " " + data.statusText, 2000);
            console.error(data);
        }
    });
}