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

const app = angular.module("fApp", []);

app.controller("fControler", [
  "$scope",
  "$timeout",
  function ($scope, $timeout) {
    const db = getFirestore();
    var correlativo = 0;
    $scope.resultados = [];
    $scope.aportadores = [];
    $scope.totalFrame = 0;
    $scope.totalAhorro = 0;

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
            console.log(data);
            $scope.aportadores.push(data);
          });
          $scope.$apply();
        }
      } catch (error) {
        console.error("Error al obtener el código: ", error);
      }
    };

    obtenerAportadores();

    $scope.$watch("resultados", function () {});

    $scope.consultarAportes = async () => {
      try {
        if ($scope.aportadores.length === 0) {
          await obtenerAportadores();
        }

        const aportesRef = collection(db, "tblAporte");
        let conditions = [];
        conditions.push(where("estado", "!=", 2));
        if ($scope.idAfiliado) {
          conditions.push(
            where("idAfiliado", "==", parseInt($scope.idAfiliado))
          );
        }
        if ($scope.fechaInicio) {
          const fechaInicio = new Date($scope.fechaInicio);
          fechaInicio.setHours(0, 0, 0, 0); // Ajusta la hora a 00:00:00.000
          conditions.push(where("fecha", ">=", fechaInicio));
        }
        if ($scope.fechaFin) {
          const fechaFin = new Date($scope.fechaFin);
          fechaFin.setHours(23, 59, 59, 999); // Ajusta la hora a 23:59:59.999
          conditions.push(where("fecha", "<=", fechaFin));
        }
        if (conditions.length === 0) {
          alert("Debe ingresar al menos un criterio de búsqueda.");
          return;
        }
        let q = query(
          aportesRef,
          ...conditions,
          orderBy("estado"),
          orderBy("fecha", "asc"),
          orderBy("correlativo", "desc")
        );
        console.log(q);
        const querySnapshot = await getDocs(q);
        $scope.resultados = [];
        console.log(querySnapshot);
        querySnapshot.forEach(doc => {
          console.log(doc);
          const data = doc.data();
          if (data.fecha && data.fecha.seconds) {
            data.fecha = new Date(
              data.fecha.seconds * 1000
            ).toLocaleDateString();
          } else {
            data.fecha = "Fecha no disponible";
          }
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
          console.log(data);
          $scope.resultados.push({
            id: doc.id,
            ...data,
          });
          console.log($scope.resultados);
        });

        // Convertir aportadores a un mapa para búsquedas eficientes
        const aportadoresMap = {};
        $scope.aportadores.forEach(ap => {
          aportadoresMap[ap.codigo] = ap;
        });

        $scope.totalAhorro = 0;
        $scope.totalFrame = 0;

        $scope.resultados.forEach(element => {
          element.usuario = aportadoresMap[element.idAfiliado];
          if (element.usuario) {
            element.dpi = element.usuario.dpi;
            element.nombre = element.usuario.nombre;
            element.usuario =
              element.usuario.dpi + " " + element.usuario.nombre;
          } else {
            element.usuario = "No encontrado";
          }
          element.mes2 = element.mes;
          element.mes = element.mes + " " + element.ano;
          $scope.totalAhorro += parseFloat(element.ahorro) || 0;
          $scope.totalFrame += parseFloat(element.frame) || 0;
        });

        $scope.$applyAsync();
      } catch (error) {
        console.error("Error al obtener los datos:", error);
        alert(
          "Ocurrió un error al obtener los datos. Por favor, inténtalo de nuevo."
        );
      }
    };

    $scope.edit = function (identificador) {
      sessionStorage.setItem("idAporte", identificador);
      var arreglo = $scope.resultados.find(
        element => element.id == identificador
      );
      sessionStorage.setItem("obAportes", JSON.stringify(arreglo));
      window.location.href = "aportes.html";
    };

    $scope.ver = function (identificador) {
      $scope.aporteF = $scope.resultados.find(
        element => element.id == identificador
      );
      var elm = {
        correlativo: $scope.aporteF.correlativo,
        token: $scope.aporteF.id,
        aportador: $scope.aportadores.find(
          element => element.codigo == $scope.aporteF.idAfiliado
        ),
        fecha: $scope.aporteF.fecha,
        mes: $scope.aporteF.mes2,
        ano: $scope.aporteF.ano,
        frame: $scope.aporteF.frame,
        ahorro: $scope.aporteF.ahorro,
      };
      correlativo = elm.correlativo;
      $scope.aporteF = elm;
      $("#comprobante").click();
    };

    $scope.descargar = function () {
      var arreglo = [];

      $scope.resultados.forEach(element => {
        var elm = {
          Correlativo: element.correlativo,
          Usuario: element.usuario,
          DPI: element.dpi,
          Nombre: element.nombre,
          Fecha: element.fecha,
          Mes: element.mes2,
          Año: element.ano,
          Frame: element.frame,
          Ahorro: element.ahorro,
          Creador: element.creador,
        };
        arreglo.push(elm);
      });
      var elm = {
        Correlativo: "",
        Usuario: "",
        DPI: "",
        Nombre: "",
        Fecha: "",
        Mes: "",
        Año: "",
        Frame: $scope.totalFrame,
        Ahorro: $scope.totalAhorro,
        Creador: "",
      };
      arreglo.push(elm);
      var title = [
        "Correlativo",
        "Usuario",
        "Dpi",
        "Nombre",
        "Fecha",
        "Mes",
        "Año",
        "Frame",
        "Ahorro",
        "Creador",
      ];

      exportJsonToExcel(arreglo, title, "Aportes.xlsx");
    };

    $scope.descargar2 = function () {
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

    $scope.delete = async idAporte => {
      try {
        if (confirm("¿Estás seguro de que deseas eliminar este Aporte?")) {
          const userRef = doc(db, "tblAporte", idAporte.toString());
          const aporte = $scope.resultados.find(
            element => element.id == idAporte
          );
          if (aporte.creador) {
            aporte.creador +=
              "\n, " +
              new Date().toISOString() +
              " " +
              localStorage.getItem("userFrame");
          } else {
            aporte.creador =
              new Date().toISOString() +
              " " +
              localStorage.getItem("userFrame");
          }
          console.log(aporte);
          const nuevosDatos = {
            correlativo: parseInt(aporte.correlativo),
            idAfiliado: parseInt(aporte.idAfiliado),
            fecha: aporte.fecha,
            mes: aporte.mes,
            ano: aporte.ano,
            frame: aporte.frame,
            ahorro: aporte.ahorro,
            creador: aporte.creador,
            estado: 2,
          };
          await updateDoc(userRef, nuevosDatos);
          alert("Aporte eliminado correctamente.");
          window.location.reload();
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
