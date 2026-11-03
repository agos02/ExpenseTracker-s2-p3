const iconos = {
  inicio: <><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z" /></>,
  gastos: <><path d="M8 6h13M8 12h13M8 18h13"/><path d="M3.5 6h.01M3.5 12h.01M3.5 18h.01" strokeWidth="3" strokeLinecap="round"/></>,
  ajustes: <><circle cx="12" cy="12" r="3"/><path d="M19.2 15.1l1.5 1.2-1.7 2.9-1.9-.5a8 8 0 0 1-2.1 1.2l-.4 2h-3.3l-.5-2a8 8 0 0 1-2.1-1.2l-1.9.5-1.7-2.9 1.5-1.2a8 8 0 0 1 0-2.4l-1.5-1.2 1.7-2.9 1.9.5a8 8 0 0 1 2.1-1.2l.5-2h3.3l.4 2a8 8 0 0 1 2.1 1.2l1.9-.5 1.7 2.9-1.5 1.2a8 8 0 0 1 0 2.4z" transform="translate(0 -1) scale(1 .94)"/></>,
  comida: <><path d="M4 3v7a3 3 0 0 0 6 0V3M7 3v18M4 7h6M17 3v18M17 3c4 2 4 8 0 10"/></>,
  transporte: <><path d="M5 17H3v-6l2-5a2 2 0 0 1 2-1h10a2 2 0 0 1 2 1l2 5v6h-2"/><path d="M5 17h14M4 11h16"/><path d="M6 17v2M18 17v2"/><circle cx="7.5" cy="14" r="1"/><circle cx="16.5" cy="14" r="1"/></>,
  servicios: <><path d="M3 9a14 14 0 0 1 18 0M6 12a9.5 9.5 0 0 1 12 0M9 15a5 5 0 0 1 6 0"/><circle cx="12" cy="19" r="1" fill="currentColor" stroke="none"/></>,
  otros: <><path d="m12 2 9 10-9 10L3 12z"/><path d="M8 12h8M12 8v8"/></>,
  siguiente: <><path d="m9 5 7 7-7 7"/></>,
  volver: <><path d="m15 5-7 7 7 7"/></>,
  sumar: <><path d="M12 5v14M5 12h14"/></>,
}

export default function AppIcon({ nombre, size = 24, className = '' }) {
  return (
    <svg
      className={className}
      aria-hidden="true"
      focusable="false"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {iconos[nombre] ?? iconos.otros}
    </svg>
  )
}
