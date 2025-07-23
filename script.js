const token = 'patNDDZVUwKy2W1Xh.c6a4b1a797e167a6ad2d31422b8b19e021cce2e08ce5296968a2569988fadca7';
const baseId = 'TU_BASE_ID'; // Reemplaza con tu baseId real
const tableName = 'Productos';

let listaProductos = [];
let pedidos = [];

async function obtenerProductos() {
  const url = `https://api.airtable.com/v0/${baseId}/${tableName}?maxRecords=500`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  const data = await res.json();
  listaProductos = data.records.map(r => ({
    sku: r.fields['SKU'],
    nombre: r.fields['Nombre del producto'],
    unidad: r.fields['Unidad']
  }));
}

document.addEventListener("DOMContentLoaded", async () => {
  await obtenerProductos();
  document.getElementById("buscador").addEventListener("input", autocompletar);
});

function autocompletar() {
  const texto = this.value.toLowerCase();
  const encontrado = listaProductos.find(p =>
    p.nombre.toLowerCase().includes(texto) || p.sku.toLowerCase().includes(texto)
  );

  if (encontrado) {
    document.getElementById("sku").value = encontrado.sku;
    document.getElementById("nombre").value = encontrado.nombre;
    document.getElementById("unidad").value = encontrado.unidad;
  } else {
    document.getElementById("sku").value = "";
    document.getElementById("nombre").value = "";
    document.getElementById("unidad").value = "";
  }
}

function agregarProducto() {
  const sku = document.getElementById("sku").value;
  const nombre = document.getElementById("nombre").value;
  const unidad = document.getElementById("unidad").value;
  const cantidad = document.getElementById("cantidad").value;
  const nota = document.getElementById("nota").value;

  if (!sku || !nombre || !cantidad) {
    alert("Debes seleccionar un producto y cantidad.");
    return;
  }

  pedidos.push({ sku, nombre, unidad, cantidad, nota });
  renderTabla();
  limpiarCampos();
}

function renderTabla() {
  const tbody = document.querySelector("#tabla-productos tbody");
  tbody.innerHTML = "";
  pedidos.forEach((item, i) => {
    const fila = `
      <tr>
        <td>${item.sku}</td>
        <td>${item.nombre}</td>
        <td>${item.unidad}</td>
        <td>${item.cantidad}</td>
        <td>${item.nota || ""}</td>
        <td><button onclick="eliminar(${i})">Eliminar</button></td>
      </tr>`;
    tbody.innerHTML += fila;
  });
}

function eliminar(index) {
  pedidos.splice(index, 1);
  renderTabla();
}

function limpiarCampos() {
  document.getElementById("buscador").value = "";
  document.getElementById("sku").value = "";
  document.getElementById("nombre").value = "";
  document.getElementById("unidad").value = "";
  document.getElementById("cantidad").value = "";
  document.getElementById("nota").value = "";
}

function enviarPedido() {
  if (pedidos.length === 0) {
    alert("No hay productos en el pedido.");
    return;
  }

  let resumen = pedidos.map(p =>
    `• ${p.cantidad} x ${p.nombre} (${p.sku}) [${p.unidad}]${p.nota ? ' - ' + p.nota : ''}`
  ).join('\n');

  alert("Pedido listo para enviar:\n\n" + resumen);

  // Aquí podrías hacer un POST a la tabla "Pedidos" de Airtable en el siguiente paso
  pedidos = [];
  renderTabla();
}
