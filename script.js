const airtableToken = "patNDDZVUwKy2W1Xh.c6a4b1a797e167a6ad2d31422b8b19e021cce2e08ce5296968a2569988fadca";
const baseId = "app9HBi9ATwzif4cm";
const tableName = "Productos";

let listaProductos = [];

async function cargarProductos() {
  const url = `https://api.airtable.com/v0/${baseId}/${tableName}?pageSize=100`;
  const respuesta = await fetch(url, {
    headers: {
      Authorization: `Bearer ${airtableToken}`
    }
  });

  const data = await respuesta.json();
  listaProductos = data.records.map(record => ({
    sku: record.fields["SKU"] || "",
    nombre: record.fields["Nombre del producto"] || "",
    unidad: record.fields["Unidad"] || ""
  }));

  console.log("Productos cargados:", listaProductos);
}

function agregarProducto() {
  const texto = document.getElementById("buscador").value.trim().toLowerCase();
  const producto = listaProductos.find(p =>
    p.sku.toLowerCase().includes(texto) ||
    p.nombre.toLowerCase().includes(texto)
  );

  if (!producto) {
    alert("Producto no encontrado.");
    return;
  }

  const fila = document.createElement("tr");
  fila.innerHTML = `
    <td>${producto.sku}</td>
    <td>${producto.nombre}</td>
    <td>${producto.unidad}</td>
    <td><input type="number" min="1" value="1"></td>
  `;

  document.querySelector("#tabla-productos tbody").appendChild(fila);
}

document.addEventListener("DOMContentLoaded", cargarProductos);
