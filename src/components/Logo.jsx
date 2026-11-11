/*
  Logotipo de AXM redibujado como vector a partir del original (brand-src/).
  Mismas proporciones: Λ sin travesaño, X y M de trazo uniforme.
*/
export function Wordmark({ className, title }) {
  return (
    <svg viewBox="0 0 732 180" className={className} fill="currentColor" role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      <polygon points="0,180 100,0 108,0 207,180 174,180 104,52 33,180" />
      <polygon points="259,0 296,0 461,180 424,180" />
      <polygon points="461,0 424,0 259,180 296,180" />
      <polygon points="537,180 537,0 543,0 634.5,98 726,0 732,0 732,180 705,180 705,64 634.5,138 565,64 565,180" />
    </svg>
  )
}
