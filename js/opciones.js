

// Definir el módulo de AngularJS
var Frame = angular.module('fApp', []);

// Definir el controlador de AngularJS
Frame.controller('fControler', function ($scope) {
    // Función para manejar la opción de ingresar un usuario
    $scope.ingresarUsuario = function () {
        window.location.href="usuario.html"
        // Lógica para ingresar usuario (puedes agregar más detalles aquí)
    };

    // Función para manejar la opción de ingresar un aporte
    $scope.ingresarAporte = function () {
        window.location.href="aportes.html"
        // Lógica para ingresar un aporte (puedes agregar más detalles aquí)
    };

    // Función para generar el reporte de usuarios
    $scope.reporteUsuario = function () {
        alert("Generar Reporte de Usuario");
        // Lógica para generar reporte de usuario (puedes agregar más detalles aquí)
    };

    // Función para generar el reporte de aportes
    $scope.reporteAportes = function () {
        alert("Generar Reporte de Aportes");
        // Lógica para generar reporte de aportes (puedes agregar más detalles aquí)
    };
});
