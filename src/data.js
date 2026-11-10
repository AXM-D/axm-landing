export const CONTACT_EMAIL = 'axm.central@outlook.com'

export const LINKS = {
  githubDevs: 'https://github.com/AXM-DEVs',
  githubD: 'https://github.com/AXM-D',
  taq: 'https://github.com/AXM-DEVs/TaQ',
}

/* Etapas del motor TaQ. Fuente: README, PRODUCT.md y CONTEXTO_PROYECTO.md del repositorio TaQ. */
export const STAGES = [
  {
    id: 'ingerir',
    label: 'Ingerir',
    kind: 'Fuentes',
    title: 'Señales públicas, una sola tubería.',
    body:
      'Conectores para Wikimedia (SSE), Bluesky Jetstream (WebSocket) y RSS configurable alimentan un único pipeline. Cada evento se normaliza con un ID estable blake3, se deduplica en ventana temporal y se publica en Redpanda. Si falla, va a una dead-letter queue con replay controlado.',
    code: ['taq-ingest', 'taq-ingestd', 'taq-connector-*', 'taq-dlq-replay'],
  },
  {
    id: 'contextualizar',
    label: 'Contextualizar',
    kind: 'Entidades',
    title: 'Lo que importa, por inquilino.',
    body:
      'Cada señal se compara con listas vigiladas de marcas, dominios y organizaciones, versionadas por tenant. El contexto se guarda en PostgreSQL en la misma transacción que la evaluación.',
    code: ['taq-api', 'taq-state', 'PostgreSQL'],
  },
  {
    id: 'inferir',
    label: 'Inferir',
    kind: 'Reglas',
    title: 'Reglas explícitas, no cajas negras.',
    body:
      'Reglas versionadas y explicables deciden qué patrón se detectó y por qué. Cada evaluación queda registrada para poder auditarla después.',
    code: ['taq-api', 'reglas versionadas'],
  },
  {
    id: 'coordinar',
    label: 'Coordinar',
    kind: 'Revisión humana',
    title: 'Una persona aprueba antes de actuar.',
    body:
      'Los resultados se convierten en hallazgos revisables. Las acciones aprobadas solo escriben en un outbox: esta versión no ejecuta efectos externos por su cuenta.',
    code: ['hallazgos', 'aprobaciones', 'outbox', 'taqctl'],
  },
  {
    id: 'aprender',
    label: 'Aprender',
    kind: 'Mejora gobernada',
    title: 'El feedback propone, no impone.',
    body:
      'La retroalimentación genera datasets y muestras inmutables que sugieren mejoras. Ningún cambio se aplica solo: todo pasa por revisión.',
    code: ['feedback', 'datasets', 'auditoría'],
  },
]

export const STACK = ['Rust', 'Tokio', 'Redpanda / Kafka', 'ClickHouse', 'PostgreSQL + pgvector', 'OpenTelemetry', 'Prometheus', 'Grafana', 'Docker Compose']

export const STATUS = {
  today: [
    'Conectores RSS, Wikimedia y Bluesky con cursores durables',
    'Normalización, deduplicación, DLQ y replay',
    'Contexto multi-tenant, reglas, hallazgos y outbox',
    'API, CLI (taqctl) y observabilidad local',
  ],
  next: [
    'CI de extremo a extremo y recuperación ensayada',
    'Migraciones y operación de servicios',
    'TLS, gestión de secretos, retención y SBOM',
    'Medición de calidad y carga antes de abrirlo',
  ],
}

export const PROJECTS = [
  {
    name: 'TaQ',
    tag: 'Motor principal',
    year: '2026',
    desc: 'Motor modular de inteligencia contextual defensiva. Lleva señales públicas por un pipeline trazable hasta hallazgos revisables por personas.',
    stack: ['Rust', 'Redpanda', 'ClickHouse', 'PostgreSQL'],
    href: 'https://github.com/AXM-DEVs/TaQ',
    status: 'En desarrollo',
    featured: true,
  },
  {
    name: 'Retro',
    tag: 'Defensa activa',
    year: '2026',
    desc: 'Plataforma local de defensa activa: honeypots SSH/HTTP detectan atacantes, OSINT construye su perfil y tú decides bloquear, reportar o exportar. Sin nube.',
    stack: ['Python', 'FastAPI', 'React', 'SQLite'],
    href: 'https://github.com/AXM-D/retro',
    status: 'v0.1.0',
  },
  {
    name: 'Project Analyzer',
    tag: 'Arquitectura',
    year: '2026',
    desc: 'Analiza cualquier código fuente y genera documentación de arquitectura, diagramas y un mapa navegable del proyecto en minutos.',
    stack: ['Python', 'HTML', 'CLI'],
    href: 'https://github.com/AXM-DEVs/project-analyzer',
    status: 'v1.1.0',
  },
  {
    name: 'TaQ Engine 1.x',
    tag: 'Generación anterior',
    year: '2026',
    desc: 'Primera versión del motor en Python: playbooks YAML, scoring multi-factor y consultas en lenguaje natural sobre una API REST. La base que llevó a TaQ.',
    stack: ['Python', 'FastAPI', 'SQLAlchemy'],
    href: 'https://github.com/AXM-DEVs/taq-engine',
    status: 'Archivo',
  },
]

export const SERVICES = [
  {
    title: 'Motores y pipelines de datos',
    desc: 'Ingesta de eventos, colas, deduplicación y almacenamiento analítico diseñados para no perder el porqué de cada dato.',
  },
  {
    title: 'Inteligencia defensiva y OSINT',
    desc: 'Monitorización de marcas, dominios y organizaciones con fuentes públicas, reglas explicables y revisión humana.',
  },
  {
    title: 'Backends y APIs',
    desc: 'Servicios en Rust y Python con observabilidad desde el primer día: métricas, trazas y runbooks.',
  },
  {
    title: 'Auditoría de arquitectura',
    desc: 'Revisión y documentación de sistemas existentes para entender qué hay, qué falta y qué arreglar primero.',
  },
]

export const PRINCIPLES = [
  { k: '01', t: 'Evidencia antes que promesas', d: 'Nada se anuncia como listo hasta que está medido y validado.' },
  { k: '02', t: 'Trazable de punta a punta', d: 'Cada resultado puede explicar de dónde vino y por qué.' },
  { k: '03', t: 'Personas en el circuito', d: 'La automatización propone; las decisiones importantes las aprueba alguien.' },
  { k: '04', t: 'Uso defensivo', d: 'Información pública, para proteger, no para atacar.' },
]
