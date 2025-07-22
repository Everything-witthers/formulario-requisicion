const productos = [];

function agregarProducto() {
  const producto = document.getElementById("producto").value;
  const cantidad = document.getElementById("cantidad").value;
  const nota = document.getElementById("nota").value;

  if (!producto || !cantidad) return alert("Completa todos los campos");

  productos.push({ producto, cantidad, nota });
  renderizarTabla();
  limpiarFormulario();
}

function renderizarTabla() {
  const tbody = document.querySelector("#tabla-productos tbody");
  tbody.innerHTML = "";

  productos.forEach((item, index) => {
    const fila = `
      <tr>
        <td>${item.producto}</td>
        <td>${item.cantidad}</td>
        <td>${item.nota || ""}</td>
        <td><button onclick="eliminarProducto(${index})">Eliminar</button></td>
      </tr>`;
    tbody.innerHTML += fila;
  });
}

function eliminarProducto(index) {
  productos.splice(index, 1);
  renderizarTabla();
}

function limpiarFormulario() {
  document.getElementById("producto").value = "";
  document.getElementById("cantidad").value = "";
  document.getElementById("nota").value = "";
}

function enviarFormulario() {
  if (productos.length === 0) return alert("Agrega al menos un producto");

  const datos = {
    destinatario: "logistica@elarriero.cl",
    productos
  };

  fetch("https://script.google.com/a/macros/elarriero.cl/s/AKfycbztmo4H5J6vKYPeQwtNNew9kU1yh1QjWYFbMWqVDae3I0nkovX6jW8wTzGqite6T_FF2g/exec", {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(datos)
  });

  document.getElementById("mensaje").innerText = "¡Requisición enviada!";
  productos.length = 0;
  renderizarTabla();
}
