var app = angular.module("fApp", []);
var correlativo = 0;
import {
  addDoc,
  collection,
  doc,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
const db = getFirestore();

function convertirFecha(fechaStr) {
  var partes = fechaStr.split("/");
  return new Date(partes[2], partes[1] - 1, partes[0]); // Asegúrate de restar 1 al mes
}
angular.module("fApp").controller("fControler", [
  "$scope",
  function ($scope) {
    $scope.aporte = {};
    $scope.meses = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];
    $scope.aportadores = [];
    const obtenerCodigoMaximo = async () => {
      try {
        const q = query(
          collection(db, "tblAporte"),
          orderBy("correlativo", "desc"),
          limit(1)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          $scope.aporte.correlativo =
            parseFloat(querySnapshot.docs[0].data().correlativo) + 1;
          $scope.$apply();
        } else {
          $scope.aporte.correlativo = 1;
        }
        $scope.aporte.fecha = new Date();
      } catch (error) {
        alert("Error al obtener el código: ", error);
      }
    };
    const obtenerAportadores = async () => {
      try {
        const q = query(
          collection(db, "tblAportadores"),
          orderBy("codigo", "desc")
        );

        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          querySnapshot.docs.forEach(element => {
            let data = element.data();
            if (data.nacimiento && data.nacimiento.seconds) {
              data.nacimiento = new Date(
                data.nacimiento.seconds * 1000
              ).toLocaleDateString();
            }
            if (data.estado!=2) {
              $scope.aportadores.push(data);
            }
            
          });
          $scope.$apply();
          if (sessionStorage.getItem("obAportes")) {
            $scope.type = "edit";
            $scope.idAporte = sessionStorage.getItem("idAporte");
            $scope.aporte = JSON.parse(sessionStorage.getItem("obAportes"));
            $scope.aporte.mes = $scope.aporte.mes.split(" ")[0];
            $scope.aporte.fecha = convertirFecha($scope.aporte.fecha);
            $scope.aporte.idAfiliado = $scope.aportadores.find(
              element => element.dpi === $scope.aporte.usuario.split(" ")[0]
            );
            $scope.aporte.creador = sessionStorage.getItem("userFrame");
            $scope.$apply();
            sessionStorage.removeItem("obAportes");
            sessionStorage.removeItem("idAporte");
          } else {
            $scope.type = "new";

            obtenerCodigoMaximo();
          }
        }
      } catch (error) {
        console.error("Error al obtener el código: ", error);
      }
    };
    obtenerAportadores();

    $scope.submitForm = async () => {
      try {
        const docRef = await addDoc(collection(db, "tblAporte"), {
          correlativo: $scope.aporte.correlativo,
          idAfiliado: $scope.aporte.idAfiliado.codigo,
          fecha: $scope.aporte.fecha,
          mes: $scope.aporte.mes,
          ano: $scope.aporte.ano,
          frame: $scope.aporte.frame,
          ahorro: $scope.aporte.ahorro,
          creador: localStorage.getItem("userFrame"),
          estado: 0,
        });
        $scope.aporteF = $scope.aporte;
        $scope.aporteF.token = docRef.id;
        $scope.aporteF.aportador = $scope.aportadores.find(
          element => element.codigo == $scope.aporte.idAfiliado.codigo
        );
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

    $scope.editForm = async () => {
      try {
        const userRef = doc(db, "tblAporte", $scope.idAporte.toString());
        if ($scope.aporte.creador) {
          $scope.aporte.creador +=
            "\n, " +
            new Date().toISOString() +
            " " +
            localStorage.getItem("userFrame");
        } else {
          $scope.aporte.creador = 
          new Date().toISOString() +
          " " +
          localStorage.getItem("userFrame");
        }
        const nuevosDatos = {
          correlativo: parseInt($scope.aporte.correlativo),
          idAfiliado: parseInt($scope.aporte.idAfiliado.codigo),
          fecha: $scope.aporte.fecha,
          mes: $scope.aporte.mes,
          ano: $scope.aporte.ano,
          frame: $scope.aporte.frame,
          ahorro: $scope.aporte.ahorro,
          creado: $scope.aporte.creador,
          estado: 1,
        };
        await updateDoc(userRef, nuevosDatos);
        alert("aporte actualizado correctamente.");
        window.location.href = "repAportes.html";
      } catch (error) {
        console.error("Error al actualizar el aporte:", error);
        alert("Hubo un error al actualizar el aporte.");
      }
    };

    $scope.descargar = function () {
      var element = document.getElementById("dwpdf");
      html2pdf()
        .set({
          margin: 1,
          filename: "aporte_" + correlativo + ".pdf",
          image: {
            type: "jpeg",
            quality: 0.98,
          },
          html2canvas: {
            scale: 2,
            logging: true,
          },
          jsPDF: {
            unit: "in",
            format: "letter",
            orientation: "portrait",
          },
        })
        .from(element)
        .save();
    };
  },
]);
