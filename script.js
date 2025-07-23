let listaProductos = [];
const productos = [];

// Cargar datos desde la Google Sheet
fetch("https://script.google.com/macros/s/AKfycbyQXQFVgl-FH-3C_vZ3M601wYBBzdQhOS2TGytfyNBe-G8cbo02GIxmcJYwjCqdBPx-/exec")
  .then(res => res.json())
  .then(data => {
    listaProductos = data.map(p => ({
      sku: p.sku,
      nombre: p.nombre,
      unidad: p.unidad
    }));
    console.log("Productos cargados:", listaProductos);
  });

// Buscador auxiliar
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

// Autocompletado por nombre
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

// Autocompletado por SKU
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
