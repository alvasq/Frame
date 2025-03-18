

// Definir el módulo de AngularJS
var Frame = angular.module('fApp', []);

// Definir el controlador de AngularJS
Frame.controller('fControler', function ($scope) {
    // Función para manejar la opción de ingresar un usuario
    $scope.ingresarUsuario = function () {
        window.location.href="usuario.html"
        // Lógica para ingresar usuario (puedes agregar más detalles aquí)
    };
    $scope.registro=false;
    if (localStorage.getItem("authChecked")=="true" && (localStorage.getItem("userFrame")=="controlframe2024@gmail.com" || localStorage.getItem("userFrame")=="25896541alan@gmail.com")) {
        $scope.registro=true;
    }
    // Función para manejar la opción de ingresar un aporte
    $scope.ingresarAporte = function () {
        window.location.href="aportes.html"
        // Lógica para ingresar un aporte (puedes agregar más detalles aquí)
    };

    // Función para generar el reporte de usuarios
    $scope.reporteUsuario = function () {
        window.location.href="repusuarios.html"
        // Lógica para generar reporte de usuario (puedes agregar más detalles aquí)
    };

    // Función para generar el reporte de aportes
    $scope.reporteAportes = function () {
        window.location.href="repAportes.html"
        // Lógica para generar reporte de aportes (puedes agregar más detalles aquí)
    };

    $scope.registrar = function () {
        window.location.href="registro.html"
        // Lógica para generar reporte de aportes (puedes agregar más detalles aquí)
    };

    $scope.logout=function(){
        localStorage.removeItem("authChecked");
        localStorage.removeItem("tokenFrame");
        localStorage.removeItem("userFrame");
        window.location.href="index.html";
    }
});
