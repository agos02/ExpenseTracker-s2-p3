// Datos sintéticos, deterministas, solo para comparar map() y TanStack Virtual.
// No se mezclan con los gastos reales ni se guardan.
const tipos = [
  ['Supermercado', 'Comida'],
  ['Combustible', 'Transporte'],
  ['Internet', 'Servicios'],
  ['Varios', 'Otros'],
]

export const demoExpenses = Array.from({ length: 800 }, (_, indice) => {
  const i = indice + 1
  const [descripcion, categoria] = tipos[indice % tipos.length]
  return {
    id: `demo-${i}`,
    descripcion: `${descripcion} (prueba ${i})`,
    categoria,
    monto: 1500 + (indice % 30) * 650,
    fecha: '2026-10-20',
    notas: 'Gasto simulado únicamente para probar el rendimiento del listado.',
  }
})

export function buscarGastoSimulado(id) {
  if (!/^demo-[1-9]\d*$/.test(id || '')) return null
  const indice = Number(id.slice(5)) - 1
  return demoExpenses[indice] || null
}
