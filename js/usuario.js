var app = angular.module('fApp', []);

// Importa las funciones necesarias desde Firebase
import {
    getFirestore,
    collection,
    getDocs,
    query,
    orderBy,
    limit,
    addDoc,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import {
    auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from "./firebase.js";

// Inicializa Firestore
const db = getFirestore();

function convertirFecha(fechaStr) {
    if (fechaStr!=null) {
        var partes = fechaStr.split('/');
        return new Date(partes[2], partes[1] - 1, partes[0]); // Asegúrate de restar 1 al mes            
    }else{
        return null;
    }
}

// Controlador de AngularJS
angular.module('fApp').controller('fControler', ['$scope', function ($scope) {
    $scope.usuario = {};

    // Función para obtener el código máximo
    const obtenerCodigoMaximo = async () => {
        try {
            const q = query(collection(db, "tblAportadores"), orderBy("codigo", "desc"), limit(1));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                $scope.usuario.codigo = parseFloat(querySnapshot.docs[0].data().codigo) + 1; // Incrementa en 1
                $scope.$apply();
            } else {
                $scope.usuario.codigo = 1; // Si no hay códigos, inicia en 1
            }
        } catch (error) {
            console.error("Error al obtener el código: ", error);
        }
    };
    if (sessionStorage.getItem("obUsuario")) {
        $scope.type = "edit";
        $scope.idUsuario = sessionStorage.getItem("idUsuario");
        $scope.usuario = JSON.parse(sessionStorage.getItem("obUsuario"));
        $scope.usuario.nacimiento = convertirFecha($scope.usuario.nacimiento);
        $scope.usuario.ingresoFrame = convertirFecha($scope.usuario.ingresoFrame)
        $scope.usuario.ingresoMinisterio = convertirFecha($scope.usuario.ingresoMinisterio)
        $scope.usuario.perdidaAfiliacion = convertirFecha($scope.usuario.perdidaAfiliacion)
        $scope.usuario.reingresoFrame = convertirFecha($scope.usuario.reingresoFrame)

        sessionStorage.removeItem('obUsuario');
        sessionStorage.removeItem('idUsuario');

    } else {
        $scope.type = "new";

        obtenerCodigoMaximo();
    }

    // Función para enviar el formulario
    $scope.newForm = async () => {
        try {
            // Agrega el usuario a la colección 'usuarios'
            const docRef = await addDoc(collection(db, "tblAportadores"), {
                codigo: $scope.usuario.codigo,
                nombre: $scope.usuario.nombre,
                dpi: $scope.usuario.dpi,
                correo: $scope.usuario.correo,
                direccion: $scope.usuario.direccion,
                distrito: $scope.usuario.distrito,
                telefono: $scope.usuario.telefono,
                esposa: $scope.usuario.esposa,
                hijos: $scope.usuario.hijos,
                fraternidad: $scope.usuario.fraternidad,
                nacimiento: $scope.usuario.nacimiento,
                ingresoFrame: $scope.usuario.ingresoFrame,
                ingresoMinisterio: $scope.usuario.ingresoMinisterio,
                perdidaAfiliacion: $scope.usuario.perdidaAfiliacion,
                reingresoFrame: $scope.usuario.reingresoFrame,
                beneficiarioGratificacion: $scope.usuario.beneficiarioGratificacion,
                dpiGratificacion: $scope.usuario.dpiGratificacion,
                beneficiarioAhorro: $scope.usuario.beneficiarioAhorro,
                dpiAhorro: $scope.usuario.dpiAhorro,
                notas: $scope.usuario.notas,
                otros: $scope.usuario.otros
            });

            // Aquí puedes agregar lógica adicional, como limpiar el formulario o mostrar un mensaje de éxito
            $scope.usuario = {}; // Limpiar el formulario
            $scope.usuario.codigo = 1; // Reiniciar el código para el siguiente usuario
            obtenerCodigoMaximo(); // Volver a obtener el código máximo

            // Para que AngularJS sepa que hubo un cambio
            $scope.$apply();
        } catch (error) {
            console.error("Error al guardar el usuario: ", error);
        }
    };

    $scope.editForm = async () => {
        try {
            const userRef = doc(db, "tblAportadores", $scope.usuario.id.toString());
            const nuevosDatos = {
                codigo: parseInt($scope.usuario.codigo),
                nombre: $scope.usuario.nombre,
                dpi: $scope.usuario.dpi,
                correo: $scope.usuario.correo,
                direccion: $scope.usuario.direccion,
                distrito: $scope.usuario.distrito,
                telefono: $scope.usuario.telefono,
                esposa: $scope.usuario.esposa,
                hijos: $scope.usuario.hijos,
                fraternidad: $scope.usuario.fraternidad,
                nacimiento: $scope.usuario.nacimiento,
                ingresoFrame: $scope.usuario.ingresoFrame,
                ingresoMinisterio: $scope.usuario.ingresoMinisterio,
                perdidaAfiliacion: $scope.usuario.perdidaAfiliacion,
                reingresoFrame: $scope.usuario.reingresoFrame,
                beneficiarioGratificacion: $scope.usuario.beneficiarioGratificacion,
                dpiGratificacion: $scope.usuario.dpiGratificacion,
                beneficiarioAhorro: $scope.usuario.beneficiarioAhorro,
                dpiAhorro: $scope.usuario.dpiAhorro,
                notas: $scope.usuario.notas,
                otros: $scope.usuario.otros
            };

            // Actualiza el documento en Firestore
            await updateDoc(userRef, nuevosDatos);
            alert("Usuario actualizado correctamente.");
            window.location.href = "repusuarios.html"
        } catch (error) {
            console.error("Error al actualizar el usuario:", error);
            alert("Hubo un error al actualizar el usuario.");
        }
    };
}]);