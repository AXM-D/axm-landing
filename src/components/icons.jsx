/* Iconos propios, un solo trazo (1.6) y una sola caja (16). Siempre decorativos. */
function Svg({ className = 'size-4', children, strokeWidth = 1.6 }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

export const ArrowRight = (p) => (
  <Svg {...p}>
    <path d="M3 8h10M9 4l4 4-4 4" />
  </Svg>
)
export const ArrowUpRight = (p) => (
  <Svg {...p}>
    <path d="M5 11l6-6M6 5h5v5" />
  </Svg>
)
export const Check = (p) => (
  <Svg strokeWidth={2} {...p}>
    <path d="M3.5 8.5l3 3 6-7" />
  </Svg>
)
export const Cross = (p) => (
  <Svg strokeWidth={2} {...p}>
    <path d="M4 4l8 8M12 4l-8 8" />
  </Svg>
)
export const Plus = (p) => (
  <Svg {...p}>
    <path d="M8 3v10M3 8h10" />
  </Svg>
)
export const Copy = (p) => (
  <Svg strokeWidth={1.5} {...p}>
    <rect x="5" y="5" width="8.5" height="8.5" rx="2" />
    <path d="M11 5V3.5A1.5 1.5 0 009.5 2h-6A1.5 1.5 0 002 3.5v6A1.5 1.5 0 003.5 11H5" />
  </Svg>
)
export const Mail = (p) => (
  <Svg strokeWidth={1.5} {...p}>
    <rect x="1.75" y="3.25" width="12.5" height="9.5" rx="2" />
    <path d="M2.5 5l5.5 4 5.5-4" />
  </Svg>
)
