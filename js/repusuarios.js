var app = angular.module("fApp", []);
var correlativo = 0;
import {
    collection,
    doc,
    getDocs,
    getFirestore,
    orderBy,
    query,
    updateDoc,
    where,
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
function formatFirestoreDate(timestamp) {
  return timestamp?.seconds != null
    ? new Date(timestamp.seconds * 1000).toLocaleDateString()
    : null;
}
const db = getFirestore();
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

    const obtenerAportadores = async () => {
      try {
        const aportesRef = collection(db, "tblAportadores");
        let conditions = [];
        conditions.push(where("estado", "!=", 2));
        let q = query(
          aportesRef,
          ...conditions,
          orderBy("estado"),
          orderBy("codigo", "desc")
        );
        const querySnapshot = await getDocs(q);
        console.log(querySnapshot.empty)
        if (!querySnapshot.empty) {
          querySnapshot.docs.forEach(element => {

            let data = element.data();
            console.log(data)
            data.id = element.id;
            data.nacimiento = formatFirestoreDate(data.nacimiento);
            data.ingresoFrame = formatFirestoreDate(data.ingresoFrame);
            data.ingresoMinisterio = formatFirestoreDate(
              data.ingresoMinisterio
            );
            data.perdidaAfiliacion = formatFirestoreDate(
              data.perdidaAfiliacion
            );
            data.reingresoFrame = formatFirestoreDate(data.reingresoFrame);
            console.log(data);
            switch (data.estado) {
              case 0:
                data.estado = "nuevo";
                break;
              case 1:
                data.estado = "editado";
                break;
              case 2:
                data.estado = "Eliminado";
                break;
              default:
                data.estado = "";
                break;
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

    $scope.descargar = function () {
      var arreglo = [];

      $scope.aportadores.forEach(element => {
        var elm = {
          Codigo: element.codigo,
          Nombre: element.nombre,
          DPI: element.dpi,
          Correo: element.correo,
          Dirección: element.direccion,
          Distrito: element.distrito,
          Teléfono: element.telefono,
          Esposa: element.esposa,
          Hijos: element.hijos,
          Fraternidad: element.fraternidad,
          Nacimiento: element.nacimiento,
          "Ingreso Frame": element.ingresoFrame,
          "Ingreso Ministerio": element.ingresoMinisterio,
          "Pérdida Afiliación": element.perdidaAfiliacion,
          "Reingreso Frame": element.reingresoFrame,
          "Beneficiario Gratificación": element.beneficiarioGratificacion,
          "DPI Gratificación": element.dpiGratificacion,
          "Beneficiario Ahorro": element.beneficiarioAhorro,
          "DPI Ahorro": element.dpiAhorro,
          Notas: element.notas,
          Otros: element.otros,
          Creador: element.creador,
          Estado: element.estado,
        };
        arreglo.push(elm);
      });

      var title = [
        "Codigo",
        "Nombre",
        "DPI",
        "Correo",
        "Dirección",
        "Distrito",
        "Teléfono",
        "Esposa",
        "Hijos",
        "Fraternidad",
        "Nacimiento",
        "Ingreso Frame",
        "Ingreso Ministerio",
        "Pérdida Afiliación",
        "Reingreso Frame",
        "Beneficiario Gratificación",
        "DPI Gratificación",
        "Beneficiario Ahorro",
        "DPI Ahorro",
        "Notas",
        "Otros",
        "creador",
        "estado",
      ];

      exportJsonToExcel(arreglo, title, "Usuarios.xlsx");
    };

    $scope.edit = function (identificador) {
      sessionStorage.setItem("idUsuario", identificador);
      var arreglo = $scope.aportadores.find(
        element => element.id == identificador
      );
      sessionStorage.setItem("obUsuario", JSON.stringify(arreglo));
      window.location.href = "usuario.html";
    };

    $scope.deleteUsuario = async idUsuario => {
      console.log(idUsuario);
      try {
        if (confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
          const userRef = doc(db, "tblAportadores", idUsuario.toString());
          const usuario = $scope.aportadores.find(
            element => element.id == idUsuario
          );
          if (usuario.creador) {
            usuario.creador +=
              "\n, " +
              new Date().toISOString() +
              " " +
              localStorage.getItem("userFrame");
          } else {
            usuario.creador =
              new Date().toISOString() +
              " " +
              localStorage.getItem("userFrame");
          }
          console.log(usuario);
          try {
            const nuevosDatos = {
              codigo: parseInt(usuario.codigo),
              nombre: usuario.nombre,
              dpi: usuario.dpi,
              correo: usuario.correo,
              direccion: usuario.direccion,
              distrito: usuario.distrito,
              telefono: usuario.telefono,
              esposa: usuario.esposa,
              hijos: usuario.hijos,
              fraternidad: usuario.fraternidad,
              nacimiento: usuario.nacimiento,
              ingresoFrame: usuario.ingresoFrame,
              ingresoMinisterio: usuario.ingresoMinisterio,
              perdidaAfiliacion: usuario.perdidaAfiliacion,
              reingresoFrame: usuario.reingresoFrame,
              beneficiarioGratificacion: usuario.beneficiarioGratificacion,
              dpiGratificacion: usuario.dpiGratificacion,
              beneficiarioAhorro: usuario.beneficiarioAhorro,
              dpiAhorro: usuario.dpiAhorro,
              notas: usuario.notas,
              otros: usuario.otros,
              creador: usuario.creador,
              estado: 2,
            };

            // Actualiza el documento en Firestore
            await updateDoc(userRef, nuevosDatos);
            alert("Usuario eliminado correctamente.");
            obtenerAportadores();
          } catch (error) {
            console.error("Error al actualizar el usuario:", error);
            alert("Hubo un error al actualizar el usuario.");
          }
          // Recargar la lista después de eliminar
        }
      } catch (error) {
        console.error("Error al eliminar el usuario:", error);
        alert("Hubo un error al eliminar el usuario.");
      }
    };
  },
]);

function exportJsonToExcel(jsonData, title, filename = "") {
  var downloadLink;
  var dataType = "application/vnd.ms-excel";

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
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

  var wbout = XLSX.write(wb, {
    bookType: "xlsx",
    type: "binary",
  });

  filename = filename || "export.xlsx";

  downloadLink = document.createElement("a");

  document.body.appendChild(downloadLink);

  if (navigator.msSaveOrOpenBlob) {
    var blob = new Blob([s2ab(wbout)], {
      type: dataType,
    });
    navigator.msSaveOrOpenBlob(blob, filename);
  } else {
    // Creamos un enlace para descargar el archivo
    downloadLink.href = window.URL.createObjectURL(
      new Blob([s2ab(wbout)], {
        type: dataType,
      })
    );

    // Configuramos el nombre del archivo
    downloadLink.setAttribute("download", filename);

    // Disparamos el evento de descarga
    downloadLink.click();
  }
}

function s2ab(s) {
  var buf = new ArrayBuffer(s.length);
  var view = new Uint8Array(buf);
  for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
  return buf;
}
