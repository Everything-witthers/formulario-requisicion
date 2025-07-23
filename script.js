let listaProductos = [];
const productos = [];

const URL_SCRIPT = "https://script.google.com/macros/s/AKfycbyZpM544UgkXCuWAyn1fTCxT45EYO33dE1iaihFTNXi1XSefaArV5ybiy_HS8C5Nc6CGA/exec";

// Cargar datos desde la hoja de Google
fetch(URL_SCRIPT)
  .then(res => res.json())
  .then(data => {
    listaProductos = data.map(p => ({
      sku: p.sku.trim(),
      nombre: p.nombre.trim(),
      unidad: p.unidad.trim()
    }));
  });

// Buscador único para SKU o nombre
document.getElementById("buscador").addEventListener("input", function () {
  const texto = this.value.trim().toLowerCase();

  const encontrado = listaProductos.find(p =>
    p.nombre.toLowerCase().includes(texto) || p.sku.toLowerCase().includes(texto)
  );

  if (encontrado) {
    document.getElementById("sku").value = encontrado.sku;
    document.getElementById("producto").value = encontrado.nombre;
    document.getElementById("unidad").value = encontrado.unidad;
  } else {
    // Si no hay coincidencia, limpiar campos relacionados
    document.getElementById("sku").value = "";
    document.getElementById("producto").value = "";
    document.getElementById("unidad").value = "";
  }
});

function agregarProducto() {
  const sku = document.getElementById("sku").value;
  const producto = document.getElementById("producto").value;
  const cantidad = document.getElementById("cantidad").value;
  const unidad = document.getElementById("unidad").value;
  const nota = document.getElementById("nota").value;

  if (!producto || !cantidad) {
    alert("Completa al menos el producto y la cantidad.");
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
    alert("No hay productos para enviar.");
    return;
  }

  const resumen = productos.map(p =>
    `• ${p.cantidad} ${p.unidad} de ${p.producto} (${p.sku}) ${p.nota ? '- ' + p.nota : ''}`
  ).join('\n');

  alert("Formulario listo para enviar:\n\n" + resumen);
  productos.length = 0;
  renderizarTabla();
}
