"use strict";

function setCookie(cname, cvalue, exdays) {

    if (!exdays) {
        document.cookie = cname + "=" + cvalue + ";path=/";
    } else {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkCookie() {
    var username = getCookie("username");
    var password = getCookie("password");

    if (username === "prueba" && password === "prueba") {
        webAccess(false, username, password);
    }
}

function webAccess(mostrarConfirmacion, user, passwd) {
    if (!user && !passwd) {

        var username = document.forms["myAccess"]["username"].value;
        var password = document.forms["myAccess"]["psw"].value;
    } else {
        var username = user;
        var password = passwd;
    }
    var _mostrarConfirmacion = mostrarConfirmacion;
    var i;
    if (username === "prueba" && password === "prueba") {
        setCookie("username", username,10);
        setCookie("password", password,10);

        var logName = document.getElementsByClassName("logName");
        var buttonsSesion = document.getElementsByClassName("btn-sesion");
        var i;

        if (logName[0] !== null) {
            for (i = 0; i < logName.length; i++) {
                logName[i].remove();
                buttonsSesion[i].remove();
            }
        }

        var loggin = document.getElementsByClassName("loggin");
        var contenedorLoggin = document.createElement("div");
        contenedorLoggin.setAttribute("id", "contenedorLoggin");
        var loggin2 = document.getElementById("loggin2");
        var buttonAccess1 = document.getElementById("buttonAccess1");
        var buttonAccess2 = document.getElementById("buttonAccess2");

        var logName = document.createElement("span");
        logName.setAttribute("class", "logName");
        logName.appendChild(document.createTextNode(" "+username + " "));
        loggin[0].appendChild(logName);

        var buttonSesion = document.createElement("button");
        buttonSesion.setAttribute("class", "btn btn-md btn-sesion");
        buttonSesion.setAttribute("type", "button");

        var spanSesion = document.createElement("span");
        spanSesion.setAttribute("class", "glyphicon glyphicon-log-out");
        buttonSesion.appendChild(spanSesion);
        buttonSesion.appendChild(document.createTextNode(" Cerrar Sesión"));
        buttonSesion.addEventListener("click", logOut);
        loggin[0].appendChild(buttonSesion);


        buttonAccess1.style.display = "none";
        buttonAccess2.style.display = "none";

        for (i = 0; i < loggin.length; i++) {
            loggin[i].style.display = "inline-block";
        }

    } else {
        if (_mostrarConfirmacion) {
            $("#modalAccessDenied").modal("show");
        }
    }
}


function logOut() {

    setCookie("username", "", -1);
    setCookie("password", "", -1);
    var loggin = document.getElementsByClassName("loggin");
    var buttonAccess1 = document.getElementById("buttonAccess1");
    var buttonAccess2 = document.getElementById("buttonAccess2");
    var logName = document.getElementsByClassName("logName");
    var buttonsSesion = document.getElementsByClassName("btn-sesion");
    var i;

    for (i = 0; i < logName.length; i++) {
        logName[i].remove();
        buttonsSesion[i].remove();
    }
    buttonAccess1.style.display = "";
    buttonAccess2.style.display = "";

    for (i = 0; i < loggin.length; i++) {
        loggin[i].style.display = "none";
    }

}

