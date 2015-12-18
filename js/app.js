/*jshint jquery: true, browser: true*/

$(document).ready( function() {
    
    $(".button-collapse").sideNav();
    
    $("#nav-dashboard").on("click", function() {
        $("main").load("dashboard.html");
        $(".button-collapse").sideNav('hide');
    });
    
    $("#nav-attractions").on("click", function() {
        $("main").load("attractions.html");
        $(".button-collapse").sideNav('hide');
    });
    
    $("#nav-games").on("click", function() {
        $("#container-games").show();
        $(".button-collapse").sideNav('hide');        
    });
    
    $("#nav-qr").on("click", function() {
        $("main").load("qr.html");
        $(".button-collapse").sideNav('hide');
    });
    
    $("#nav-avatars").on("click", function() {
        $("main").load("avatars.html");
        $(".button-collapse").sideNav('hide');
    });
    
    $("#nav-users").on("click", function () {
        $("main").load("users.html");
        $(".button-collapse").sideNav('hide');
        $.getJSON("localhost:8080/users/list", function (data) {
            var items = [];
            $.each(data, function (key, val) {
                items.push("<li id='" + key + "'>" + val + "</li>");
            });

            $("<ul/>", {
                "class": "my-new-list",
                html: items.join("")
            }).appendTo("body");
        });
    });
});