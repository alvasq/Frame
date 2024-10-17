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
function formatFirestoreDate(timestamp) {
    return timestamp?.seconds != null ? new Date(timestamp.seconds * 1000).toLocaleDateString() : null;
}
const db = getFirestore();
angular.module('fApp').controller('fControler', ['$scope', function ($scope) {
    $scope.aporte = {};
    $scope.meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    $scope.aportadores = [];

    const obtenerAportadores = async () => {
        try {
            const q = query(collection(db, "tblAportadores"), orderBy("codigo", "desc"));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                
                
                querySnapshot.docs.forEach(element => {
                    let data = element.data();
                    data.id = element.id;
                
                    data.nacimiento = formatFirestoreDate(data.nacimiento);
                    data.ingresoFrame = formatFirestoreDate(data.ingresoFrame);
                    data.ingresoMinisterio = formatFirestoreDate(data.ingresoMinisterio);
                    data.perdidaAfiliacion = formatFirestoreDate(data.perdidaAfiliacion);
                    data.reingresoFrame = formatFirestoreDate(data.reingresoFrame);
                
                    $scope.aportadores.push(data);
                });
                
                $scope.$apply();
            }
        } catch (error) {
            console.error("Error al obtener el código: ", error);
        }
    };
    obtenerAportadores();

    $scope.descargar = function () {
        var arreglo = [];

        $scope.aportadores.forEach(element => {
            var elm = {
                "Codigo": element.codigo,
                "Nombre": element.nombre,
                "DPI": element.dpi,
                "Correo": element.correo,
                "Dirección": element.direccion,
                "Distrito": element.distrito,
                "Teléfono": element.telefono,
                "Esposa": element.esposa,
                "Hijos": element.hijos,
                "Fraternidad": element.fraternidad,
                "Nacimiento": element.nacimiento,
                "Ingreso Frame": element.ingresoFrame,
                "Ingreso Ministerio": element.ingresoMinisterio,
                "Pérdida Afiliación": element.perdidaAfiliacion,
                "Reingreso Frame": element.reingresoFrame,
                "Beneficiario Gratificación": element.beneficiarioGratificacion,
                "DPI Gratificación": element.dpiGratificacion,
                "Beneficiario Ahorro": element.beneficiarioAhorro,
                "DPI Ahorro": element.dpiAhorro,
                "Notas": element.notas,
                "Otros": element.otros
            }
            arreglo.push(elm);
        });

        var title = ["Codigo", "Nombre", "DPI", "Correo", "Dirección", "Distrito", "Teléfono", "Esposa", "Hijos", "Fraternidad", "Nacimiento", "Ingreso Frame", "Ingreso Ministerio", "Pérdida Afiliación", "Reingreso Frame", "Beneficiario Gratificación", "DPI Gratificación", "Beneficiario Ahorro", "DPI Ahorro", "Notas", "Otros"];

        exportJsonToExcel(arreglo, title, 'Usuarios.xlsx');
    };

    $scope.edit = function (identificador) {
        sessionStorage.setItem("idUsuario", identificador);
        var arreglo = $scope.aportadores.find(element => element.id ==identificador)
        sessionStorage.setItem("obUsuario", JSON.stringify(arreglo));
        window.location.href = "usuario.html";
    }



}]);


function exportJsonToExcel(jsonData, title, filename = '') {
    var downloadLink;
    var dataType = 'application/vnd.ms-excel';

    // Convertimos el objeto JSON a una matriz
    var dataArray = [];
    jsonData.forEach(function (object) {
        var data = [];
        for (var prop in object) {
            data.push(object[prop]);
        }
        dataArray.push(data);
    });

    // Agregamos los tÃ­tulos a la matriz
    dataArray.unshift(title);

    // Creamos un libro y agregamos una hoja con los datos de la matriz
    var ws = XLSX.utils.aoa_to_sheet(dataArray);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    var wbout = XLSX.write(wb, {
        bookType: 'xlsx',
        type: 'binary'
    });

    filename = filename || 'export.xlsx';

    downloadLink = document.createElement("a");

    document.body.appendChild(downloadLink);

    if (navigator.msSaveOrOpenBlob) {
        var blob = new Blob([s2ab(wbout)], {
            type: dataType
        });
        navigator.msSaveOrOpenBlob(blob, filename);
    } else {
        // Creamos un enlace para descargar el archivo
        downloadLink.href = window.URL.createObjectURL(new Blob([s2ab(wbout)], {
            type: dataType
        }));

        // Configuramos el nombre del archivo
        downloadLink.setAttribute('download', filename);

        // Disparamos el evento de descarga
        downloadLink.click();
    }
}

function s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
}