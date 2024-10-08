var app = angular.module('fApp', []);
var correlativo = 0;
import {
    getFirestore,
    collection,
    getDocs,
    query,
    orderBy,
    limit,
    addDoc
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import {
    auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from "./firebase.js";
const db = getFirestore();
angular.module('fApp').controller('fControler', ['$scope', function ($scope) {
    $scope.aporte = {};
    $scope.meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    $scope.aportadores = [];
    const obtenerCodigoMaximo = async () => {
        try {
            const q = query(collection(db, "tblAporte"), orderBy("correlativo", "desc"), limit(1));
            const querySnapshot = await getDocs(q);
            console.log(querySnapshot)
            if (!querySnapshot.empty) {
                $scope.aporte.correlativo = parseFloat(querySnapshot.docs[0].data().correlativo) + 1; 
                $scope.$apply();
            } else {
                $scope.aporte.correlativo = 1; 
            }
        } catch (error) {
            alert("Error al obtener el código: ", error);
        }
    };
    const obtenerAportadores = async () => {
        try {
            const q = query(collection(db, "tblAportadores"), orderBy("codigo", "desc"), limit(1));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                querySnapshot.docs.forEach(element => {
                    let data = element.data();
                    if (data.nacimiento && data.nacimiento.seconds) {
                        data.nacimiento = new Date(data.nacimiento.seconds * 1000).toLocaleDateString();
                    }
                    $scope.aportadores.push(data);
                });
                console.log($scope.aportadores);
                $scope.$apply();
            }
        } catch (error) {
            console.error("Error al obtener el código: ", error);
        }
    };
    obtenerCodigoMaximo();
    obtenerAportadores();
    $scope.submitForm = async () => {
        try {
            const docRef = await addDoc(collection(db, "tblAporte"), {
                correlativo: $scope.aporte.correlativo,
                idAfiliado: $scope.aporte.id_afiliado,
                fecha: $scope.aporte.fecha,
                mes: $scope.aporte.mes,
                ano: $scope.aporte.ano,
                frame: $scope.aporte.frame,
                ahorro: $scope.aporte.ahorro,
            });
            $scope.aporteF = $scope.aporte;
            $scope.aporteF.token =  docRef.id;
            $scope.aporteF.aportador = $scope.aportadores.find(element => element.codigo == $scope.aporteF.id_afiliado)
            correlativo = $scope.aporteF.correlativo;
            $scope.aporte = {};
            $scope.aporte.correlativo = 1;
            obtenerCodigoMaximo(); 
            $("#comprobante").click();
            $scope.$apply();
        } catch (error) {
            alert("Error al guardar el usuario: ", error);
        }
    };

    $scope.descargar = function () {
        var element = document.getElementById('dwpdf'); 
        html2pdf()
            .set({
                margin: 1, 
                filename: 'aporte_' + correlativo + '.pdf', 
                image: {
                    type: 'jpeg',
                    quality: 0.98
                }, 
                html2canvas: {
                    scale: 2,
                    logging: true
                }, 
                jsPDF: {
                    unit: 'in',
                    format: 'letter',
                    orientation: 'portrait'
                } 
            })
            .from(element)
            .save();
    }
}]);

