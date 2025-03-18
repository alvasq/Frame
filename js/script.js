import {
    auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from './firebase.js';


var Frame = angular.module('fApp', []);

Frame.controller('fControler', function ($scope) {

    $scope.registro = async function () {
        const email = document.getElementById("registerEmail").value;
        const password = document.getElementById("registerPassword").value;
        console.log(email)
        console.log(password)
        try {
            if (email != "" && password != "") {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                alert("Registro exitoso!");
                window.location.href = "index.html";
            }else{
                alert("todos los campos deben estar llenos")
            }
        } catch (error) {
            console.error("Error en el registro: ", error);
            alert(error.message);
        }
    }


    $scope.login = async function () {
        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            localStorage.setItem("userFrame", userCredential.user.email);
            const idToken = await userCredential.user.getIdToken();
            localStorage.setItem("tokenFrame", idToken);
            window.location.href = "opciones.html";
        } catch (error) {
            console.error("Error en el inicio de sesión: ", error);
            alert(error.message);
        }
    };
});