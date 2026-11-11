/*
  Todo el contenido editable de la web vive aquí.
  Reglas de honestidad (PRODUCT.md de TaQ): nada de testimonios, logos de clientes,
  métricas, precios ni años de experiencia inventados. TaQ está en desarrollo.
*/

export const CONTACT_EMAIL = 'axm.central@outlook.com'

export const SITE_URL = 'https://axm-d.github.io/axm-landing/'

/* La misma etiqueta en la barra, el hero y la barra móvil: una acción, un nombre. */
export const CTA_LABEL = 'Cuéntame tu proyecto'

export const LINKS = {
  githubDevs: 'https://github.com/AXM-DEVs',
  githubD: 'https://github.com/AXM-D',
  taq: 'https://github.com/AXM-DEVs/TaQ',
}

export const NAV = [
  { label: 'Servicios', href: '#servicios' },
  { label: 'Proceso', href: '#proceso' },
  { label: 'TaQ', href: '#taq' },
  { label: 'Proyectos', href: '#proyectos' },
  { label: 'Preguntas', href: '#preguntas' },
]

/* ---------- Demostración del hero: datos ficticios (dominios .example) ---------- */
export const DEMO_SIGNALS = [
  {
    source: 'RSS',
    text: 'Nuevo dominio registrado: acme-pagos.example',
    steps: [
      'Evento normalizado con id 3f9a…c21. Único en la ventana.',
      'Coincide con un dominio que vigilas: acme.example.',
      'Regla r-012 v3: posible suplantación de marca.',
      'Hallazgo h-0481 creado.',
    ],
  },
  {
    source: 'Bluesky',
    text: 'Publicación: «Soporte oficial de Acme, escríbenos aquí»',
    steps: [
      'Evento normalizado con id b71e…09d. Cursor guardado.',
      'Menciona una marca que vigilas: Acme.',
      'Regla r-007 v5: cuenta que se presenta como soporte oficial.',
      'Hallazgo h-0482 creado.',
    ],
  },
  {
    source: 'Wikimedia',
    text: 'Edición en el artículo «Acme (empresa)»',
    steps: [
      'Evento normalizado con id 5c02…e7a. Único en la ventana.',
      'Coincide con una organización que vigilas: Acme.',
      'Regla r-019 v1: cambio en los datos de contacto.',
      'Hallazgo h-0483 creado.',
    ],
  },
]

export const DEMO_STAGES = ['Ingerir', 'Contextualizar', 'Inferir', 'Coordinar', 'Aprender']

/* ---------- Servicios ---------- */
export const SERVICES = [
  {
    id: 'pipelines',
    title: 'Pipelines y motores de datos',
    desc: 'Ingesta de eventos, colas, deduplicación y almacenamiento analítico, diseñados para que cada dato pueda explicar de dónde viene.',
    gets: ['Pipeline en marcha con reintentos y cola de errores', 'Métricas y trazas desde el primer día', 'Documentación para operarlo sin mí'],
    proof: { label: 'TaQ', href: 'https://github.com/AXM-DEVs/TaQ' },
  },
  {
    id: 'vigilancia',
    title: 'Vigilancia de marca y dominios',
    desc: 'Monitorización defensiva de marcas, dominios y organizaciones con fuentes públicas, reglas que se pueden leer y revisión humana.',
    gets: ['Listas vigiladas y reglas versionadas', 'Hallazgos que una persona revisa y aprueba', 'Registro de por qué saltó cada alerta'],
    proof: { label: 'TaQ y Retro', href: 'https://github.com/AXM-D/retro' },
  },
  {
    id: 'backends',
    title: 'Backends y APIs',
    desc: 'Servicios en Rust y Python con observabilidad incluida: sabes qué hace el sistema y por qué falla cuando falla.',
    gets: ['API documentada con OpenAPI', 'Métricas, trazas y comprobaciones de salud', 'Runbook de operación'],
    proof: { label: 'taq-api', href: 'https://github.com/AXM-DEVs/TaQ' },
  },
  {
    id: 'auditoria',
    title: 'Auditoría de arquitectura',
    desc: 'Revisión y documentación de un sistema que ya existe, para saber qué hay, qué falta y qué arreglar primero.',
    gets: ['Mapa del sistema y diagramas', 'Riesgos ordenados por prioridad', 'Plan de qué arreglar primero'],
    proof: { label: 'Project Analyzer', href: 'https://github.com/AXM-DEVs/project-analyzer' },
  },
]

/* ---------- Proceso (es una secuencia real: por eso va numerada) ---------- */
export const PROCESS = [
  { t: 'Me cuentas el problema', d: 'Un email con lo que necesitas y lo que ya tienes. Te respondo yo, no un formulario.' },
  { t: 'Propuesta por escrito', d: 'Alcance, entregables y lo que queda fuera. Si no puedo ayudarte, te lo digo antes de empezar.' },
  { t: 'Entregas pequeñas', d: 'Construyo por partes que puedes ver y probar. El código es tuyo desde el primer commit.' },
  { t: 'Entrega y operación', d: 'Documentación, métricas y un runbook para que el sistema no dependa de mí.' },
]

/* ---------- TaQ. Fuente: README, PRODUCT.md y CONTEXTO_PROYECTO.md del repositorio ---------- */
export const STAGES = [
  {
    id: 'ingerir',
    label: 'Ingerir',
    title: 'Fuentes públicas en una sola tubería',
    body: 'Conectores para Wikimedia (SSE), Bluesky Jetstream (WebSocket) y RSS configurable alimentan un único pipeline. Cada evento se normaliza con un id estable blake3, se deduplica en una ventana temporal y se publica en Redpanda. Si falla, va a una cola de errores con replay controlado.',
    code: ['taq-ingest', 'taq-ingestd', 'taq-connector-*', 'taq-dlq-replay'],
  },
  {
    id: 'contextualizar',
    label: 'Contextualizar',
    title: 'Lo que importa a cada cliente',
    body: 'Cada señal se compara con listas vigiladas de marcas, dominios y organizaciones, versionadas por inquilino. El contexto se guarda en PostgreSQL en la misma transacción que la evaluación.',
    code: ['taq-api', 'taq-state', 'PostgreSQL'],
  },
  {
    id: 'inferir',
    label: 'Inferir',
    title: 'Reglas que se pueden leer',
    body: 'Reglas versionadas y explicables deciden qué patrón se detectó y por qué. Cada evaluación queda registrada para poder auditarla después.',
    code: ['taq-api', 'reglas versionadas'],
  },
  {
    id: 'coordinar',
    label: 'Coordinar',
    title: 'Una persona aprueba antes de actuar',
    body: 'Los resultados se convierten en hallazgos revisables. Las acciones aprobadas solo se escriben en un outbox: esta versión no ejecuta efectos externos por su cuenta.',
    code: ['hallazgos', 'aprobaciones', 'outbox', 'taqctl'],
  },
  {
    id: 'aprender',
    label: 'Aprender',
    title: 'El feedback propone, no impone',
    body: 'La retroalimentación genera datasets y muestras inmutables que sugieren mejoras. Ningún cambio se aplica solo: todo pasa por revisión.',
    code: ['feedback', 'datasets', 'auditoría'],
  },
]

export const ARCHITECTURE = [
  { k: 'Fuentes', v: 'Wikimedia, Bluesky, RSS' },
  { k: 'Ingesta', v: 'taq-ingestd' },
  { k: 'Transporte', v: 'Redpanda' },
  { k: 'Estado', v: 'PostgreSQL, ClickHouse' },
  { k: 'Producto', v: 'taq-api, taqctl' },
]

export const STACK = ['Rust', 'Tokio', 'Redpanda / Kafka', 'ClickHouse', 'PostgreSQL', 'OpenTelemetry', 'Prometheus', 'Grafana', 'Docker Compose']

export const STATUS = {
  today: [
    'Conectores RSS, Wikimedia y Bluesky con cursores durables',
    'Normalización, deduplicación, cola de errores y replay',
    'Contexto por inquilino, reglas, hallazgos y outbox',
    'API, CLI (taqctl) y observabilidad local',
  ],
  next: [
    'CI de extremo a extremo y recuperación ensayada',
    'Migraciones y operación de servicios',
    'TLS, gestión de secretos, retención y SBOM',
    'Medición de calidad y de carga antes de abrirlo',
  ],
}

/* ---------- Proyectos ---------- */
export const PROJECTS = [
  {
    name: 'Retro',
    kind: 'Defensa activa',
    desc: 'Plataforma local de defensa activa: honeypots SSH y HTTP detectan atacantes, OSINT construye su perfil y tú decides si bloquear, reportar o exportar. Sin nube.',
    stack: 'Python, FastAPI, React, SQLite',
    href: 'https://github.com/AXM-D/retro',
    status: 'v0.1.0',
  },
  {
    name: 'Project Analyzer',
    kind: 'Arquitectura',
    desc: 'Analiza cualquier código fuente y genera documentación de arquitectura, diagramas y un mapa navegable del proyecto.',
    stack: 'Python, HTML, CLI',
    href: 'https://github.com/AXM-DEVs/project-analyzer',
    status: 'v1.1.0',
  },
  {
    name: 'TaQ Engine 1.x',
    kind: 'Generación anterior',
    desc: 'Primera versión del motor, en Python: playbooks YAML, scoring multifactor y consultas en lenguaje natural sobre una API REST. La base que llevó a TaQ.',
    stack: 'Python, FastAPI, SQLAlchemy',
    href: 'https://github.com/AXM-DEVs/taq-engine',
    status: 'Archivado',
  },
]

/* ---------- Principios ---------- */
export const PRINCIPLES = [
  { t: 'Evidencia antes que promesas', d: 'Nada se anuncia como listo hasta que está medido y validado.' },
  { t: 'Trazable de punta a punta', d: 'Cada resultado puede explicar de dónde vino y por qué.' },
  { t: 'Personas en el circuito', d: 'La automatización propone. Las decisiones importantes las aprueba alguien.' },
  { t: 'Uso defensivo', d: 'Información pública, para proteger. No hago trabajo ofensivo.' },
]

/* ---------- Preguntas ---------- */
export const FAQ = [
  {
    q: '¿Con quién voy a hablar?',
    a: 'Conmigo. AXM es un estudio de una sola persona: quien te responde es quien diseña y escribe el código. No hay comerciales ni intermediarios.',
  },
  {
    q: '¿Cuánto cuesta un proyecto?',
    a: 'No hay una tarifa publicada porque depende del alcance. Cuéntame qué necesitas y te envío una propuesta por escrito con lo que incluye y lo que no, antes de empezar nada.',
  },
  {
    q: '¿Puedo usar o contratar TaQ ya?',
    a: 'Todavía no. TaQ está en desarrollo y no es un servicio público. Lo que sí puedes encargar es trabajo a medida con las mismas piezas y la misma forma de construir.',
  },
  {
    q: '¿Haces pentesting o seguridad ofensiva?',
    a: 'No. Trabajo solo en el lado defensivo y con información pública: vigilar tu marca, tus dominios y tu organización para que te enteres antes.',
  },
  {
    q: '¿Con qué tecnologías trabajas?',
    a: 'Sobre todo Rust y Python. Para datos: Redpanda o Kafka, ClickHouse y PostgreSQL. Para saber qué pasa dentro: OpenTelemetry, Prometheus y Grafana. Si tu sistema usa otra cosa, lo hablamos.',
  },
  {
    q: '¿Cómo empezamos?',
    a: 'Escríbeme a axm.central@outlook.com con el problema, lo que ya tienes y cuándo lo necesitas. A partir de ahí te digo si puedo ayudarte y cómo.',
  },
]

/* Temas para preparar el email de contacto */
export const TOPICS = [...SERVICES.map((s) => ({ id: s.id, label: s.title })), { id: 'otro', label: 'Otra cosa' }]
