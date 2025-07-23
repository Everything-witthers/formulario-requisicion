const token = 'patNDDZVUwKy2W1Xh.c6a4b1a797e167a6ad2d31422b8b19e021cce2e08ce5296968a2569988fadca7';
const baseId = 'app9HBi9ATwzif4cm';
const tableName = 'Productos';

async function obtenerProductos() {
  const res = await fetch(`https://api.airtable.com/v0/${baseId}/${tableName}?maxRecords=100`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  const data = await res.json();
  return data.records.map(r => ({
    sku: r.fields['SKU'] || '',
    nombre: r.fields['Nombre del producto'] || '',
    unidad: r.fields['Unidad'] || ''
  }));
}

let listaProductos = [];

document.addEventListener("DOMContentLoaded", async () => {
  listaProductos = await obtenerProductos();
  console.log("Productos cargados:", listaProductos);

  document.getElementById("busqueda").addEventListener("input", function () {
    const texto = this.value.trim().toLowerCase();
    const encontrado = listaProductos.find(p =>
      p.sku.toLowerCase().includes(texto) || p.nombre.toLowerCase().includes(texto)
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
  });
});
