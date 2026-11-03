import { useRef } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import ExpenseCard from './ExpenseCard'

// Igual que FlatList: solo monta las filas visibles y una zona adicional.
export default function VirtualExpenseList({ gastos }) {
  const contenedorRef = useRef(null)
  const virtualizer = useVirtualizer({
    count: gastos.length,
    getScrollElement: () => contenedorRef.current,
    estimateSize: () => 96,
    overscan: 5,
    getItemKey: (indice) => gastos[indice].id,
    useFlushSync: false,
  })

  return (
    <div
      ref={contenedorRef}
      className="expenses-virtual__scroll"
      style={{ height: Math.min(470, gastos.length * 100 + 8) }}
      role="region"
      aria-label="Listado de gastos virtualizado, desplazable"
      tabIndex={0}
    >
      <ul
        className="expenses-virtual__inner"
        style={{ height: virtualizer.getTotalSize() }}
      >
        {virtualizer.getVirtualItems().map((fila) => (
          <li
            key={fila.key}
            data-index={fila.index}
            ref={virtualizer.measureElement}
            className="expenses-virtual__row"
            style={{ transform: `translateY(${fila.start}px)` }}
          >
            <ExpenseCard gasto={gastos[fila.index]} />
          </li>
        ))}
      </ul>
    </div>
  )
}
