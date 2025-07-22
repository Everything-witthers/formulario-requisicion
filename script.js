const productos = [];

const listaProductos = [
  {
    sku: "LIQ-1-07-02",
    nombre: "Aloe OKF durazno 500 ml",
    unidad: "Pack de 20 unidades"
  },
  {
    sku: "MAN-K-01-25",
    nombre: "Maní Salado 22 gr",
    unidad: "Caja de 100"
  },
  {
    sku: "JOJO-AC-15",
    nombre: "JOJO Cereza Ácida",
    unidad: "Paquete de 50"
  }
];

// Autocompletado desde campo buscador auxiliar
document.getElementById("buscador").addEventListener("input", function () {
  const texto = this.value.trim().toLowerCase();

  const encontrado = listaProductos.find(p =>
    p.nombre.toLowerCase().includes(texto) || p.sku.toLowerCase().includes(texto)
  );

  if (encontrado) {
    document.getElementById("sku").value = encontrado.sku;
    document.getElementById("producto").value = encontrado.nombre;
    document.getElementById("unidad").value = encontrado.unidad;
  }
});

// Autocompletado directo desde campo producto
document.getElementById("producto").addEventListener("input", function () {
  const nombre = this.value.toLowerCase().trim();
  const encontrado = listaProductos.find(p =>
    p.nombre.toLowerCase().includes(nombre)
  );
  if (encontrado) {
    document.getElementById("sku").value = encontrado.sku;
    document.getElementById("unidad").value = encontrado.unidad;
  }
});

// Autocompletado directo desde campo SKU
document.getElementById("sku").addEventListener("input", function () {
  const sku = this.value.toUpperCase().trim();
  const encontrado = listaProductos.find(p =>
    p.sku.toUpperCase().includes(sku)
  );
  if (encontrado) {
    document.getElementById("producto").value = encontrado.nombre;
    document.getElementById("unidad").value = encontrado.unidad;
  }
});

function agregarProducto() {
  const sku = document.getElementById("sku").value;
  const producto = document.getElementById("producto").value;
  const cantidad = document.getElementById("cantidad").value;
  const unidad = document.getElementById("unidad").value;
  const nota = document.getElementById("nota").value;

  if (!producto || !cantidad) {
    alert("Por favor completa al menos producto y cantidad");
    return;
  }

  productos.push({ sku, producto, cantidad, unidad, nota });
  renderizarTabla();
  limpiarFormulario();
}

function renderizarTabla() {
  const tbody = document.querySelector("#tabla-productos tbody");
  tbody.innerHTML = "";

  productos.forEach((item, index) => {
    const fila = `
      <tr>
        <td>${item.sku}</td>
        <td>${item.producto}</td>
        <td>${item.cantidad}</td>
        <td>${item.unidad}</td>
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
  document.getElementById("sku").value = "";
  document.getElementById("producto").value = "";
  document.getElementById("cantidad").value = "";
  document.getElementById("unidad").value = "";
  document.getElementById("nota").value = "";
  document.getElementById("buscador").value = "";
}

function enviarFormulario() {
  if (productos.length === 0) {
    alert("Agrega al menos un producto antes de enviar");
    return;
  }

  alert("Requisición enviada (modo demo)");
  productos.length = 0;
  renderizarTabla();
}
