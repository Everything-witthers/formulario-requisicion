let listaProductos = [];

document.addEventListener("DOMContentLoaded", async () => {
  await obtenerProductos();
  console.log("Productos cargados:", listaProductos);

  const buscador = document.getElementById("buscador");
  if (buscador) {
    buscador.addEventListener("input", autocompletar);
  }
});

async function obtenerProductos() {
  const apiKey = "patNDDZVUwKy2W1Xh.c6a4b1a797e167a6ad2d31422b8b19e021cce2e08ce5296968a2569988fadca7";
  const baseId = "app9HBi9ATwzif4cm";
  const tableName = "Productos";

  const url = `https://api.airtable.com/v0/${baseId}/${tableName}?maxRecords=100&view=Grid%20view`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    });
    const data = await response.json();
    listaProductos = data.records.map(record => ({
      sku: record.fields["SKU"] || "",
      nombre: record.fields["Nombre del producto"] || "",
      unidad: record.fields["Unidad"] || ""
    }));
  } catch (error) {
    console.error("Error al obtener los productos:", error);
  }
}

function autocompletar(e) {
  const texto = e.target.value.toLowerCase();
  const resultado = listaProductos.find(producto =>
    producto.nombre.toLowerCase().includes(texto) ||
    producto.sku.toLowerCase().includes(texto)
  );

  if (resultado) {
    document.getElementById("sku").value = resultado.sku;
    document.getElementById("nombre").value = resultado.nombre;
    document.getElementById("unidad").value = resultado.unidad;
  }
}

// Evita error por botón aún no funcional
function agregarProducto() {
  alert("Función agregarProducto aún no implementada.");
}
