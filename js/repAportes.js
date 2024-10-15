import {
    getFirestore,
    collection,
    query,
    where,
    orderBy,
    getDocs,
    limit
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";


const app = angular.module('fApp', []);

app.controller('fControler', ['$scope', '$timeout', function ($scope, $timeout) {
    const db = getFirestore();
    var correlativo=0;
    $scope.resultados = [];
    $scope.aportadores = [];
    $scope.totalFrame = 0;
    $scope.totalAhorro = 0;

    const obtenerAportadores = async () => {
        try {
            const q = query(collection(db, "tblAportadores"), orderBy("codigo", "desc"));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                querySnapshot.docs.forEach(element => {
                    let data = element.data();
                    if (data.nacimiento && data.nacimiento.seconds) {
                        data.nacimiento = new Date(data.nacimiento.seconds * 1000).toLocaleDateString();
                    }
                    $scope.aportadores.push(data);
                });
                $scope.$apply();
            }
        } catch (error) {
            console.error("Error al obtener el código: ", error);
        }
    };

    obtenerAportadores();

    $scope.$watch('resultados', function () {
    });

    $scope.consultarAportes = async () => {
        try {

            if ($scope.aportadores.length === 0) {
                // Esperar a que los aportadores se carguen
                await obtenerAportadores();
            }

            const aportesRef = collection(db, "tblAporte");
            let conditions = [];

            if ($scope.idAfiliado) {
                conditions.push(where("idAfiliado", "==", parseInt($scope.idAfiliado)));
            }
            if ($scope.fechaInicio) {
                conditions.push(where("fecha", ">=", new Date($scope.fechaInicio)));
            }
            if ($scope.fechaFin) {
                conditions.push(where("fecha", "<=", new Date($scope.fechaFin)));
            }
            if (conditions.length === 0) {
                alert("Debe ingresar al menos un criterio de búsqueda.");
                return;
            }

            let q = query(aportesRef, ...conditions, orderBy("fecha", "asc"), orderBy("correlativo", "desc"));

            const querySnapshot = await getDocs(q);
            $scope.resultados = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.fecha && data.fecha.seconds) {
                    data.fecha = new Date(data.fecha.seconds * 1000).toLocaleDateString();
                }
                $scope.resultados.push({
                    id: doc.id,
                    ...data
                });
            });

            $scope.resultados.forEach(element => {
                // Emparejar el ID del afiliado con los datos del aportador
                element.usuario = $scope.aportadores.find(elm => elm.codigo == element.idAfiliado);
                element.dpi = element.usuario.dpi;
                element.nombre = element.usuario.nombre;
                element.usuario = element.usuario.dpi + " " + element.usuario.nombre;
                element.mes2 = element.mes;
                element.mes = element.mes + " " + element.ano;
                $scope.totalAhorro += parseFloat(element.ahorro);
                $scope.totalFrame += parseFloat(element.frame);

            });

            $scope.$apply();

        } catch (error) {
            console.error("Error al obtener los datos:", error);
        }
    };

    $scope.edit = function (identificador) {
        sessionStorage.setItem("idAporte", identificador);
        var arreglo = $scope.resultados.find(element => element.id = identificador)
        sessionStorage.setItem("obAportes", JSON.stringify(arreglo));
        window.location.href = "aportes.html";
    }

    $scope.ver =function(identificador){
        $scope.aporteF= $scope.resultados.find(element => element.id = identificador)
        var elm = {
            correlativo:$scope.aporteF.correlativo,
            token:$scope.aporteF.id,
            aportador:$scope.aportadores.find(element => element.idAfiliado==$scope.aporteF.idAfiliado),
            fecha:$scope.aporteF.fecha,
            mes:$scope.aporteF.mes2,
            ano:$scope.aporteF.ano,
            frame:$scope.aporteF.frame,
            ahorro:$scope.aporteF.ahorro
        };
        correlativo=elm.correlativo;
        $scope.aportef=elm;
        $("#comprobante").click();
    }

    $scope.descargar = function () {
        var arreglo = [];

        $scope.resultados.forEach(element => {
            var elm = {
                "Correlativo": element.correlativo,
                "Usuario": element.usuario,
                "DPI": element.dpi,
                "Nombre": element.nombre,
                "Fecha": element.fecha,
                "Mes": element.mes2,
                "Año": element.ano,
                "Frame": element.frame,
                "Ahorro": element.ahorro,
            }
            arreglo.push(elm);
        });
        var elm = {
            "Correlativo": "",
            "Usuario": "",
            "DPI": "",
            "Nombre": "",
            "Fecha": "",
            "Mes": "",
            "Año": "",
            "Frame": $scope.totalFrame,
            "Ahorro": $scope.totalAhorro,
        };
        arreglo.push(elm)
        var title = ["Correlativo", "Usuario", "Dpi", "Nombre", "Fecha", "Mes", "Año", "Frame", "Ahorro"];

        exportJsonToExcel(arreglo, title, 'Aportes.xlsx');
    };

    $scope.descargar2 = function () {
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