import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from './firebase.js';


var Frame = angular.module('fApp', []);

Frame.controller('fControler', function ($scope) {
    $scope.login = async function () {
        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            localStorage.setItem("userFrame", userCredential.user.email);
            const idToken = await userCredential.user.getIdToken();
            localStorage.setItem("tokenFrame", idToken);
            window.location.href = "opciones";
        } catch (error) {
            console.error("Error en el inicio de sesión: ", error);
            alert(error.message);
        }
    };
});
