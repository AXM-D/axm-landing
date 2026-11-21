/* Sinfuga: detectores. Cada uno dice qué encontró y qué hacer con ello. */
(function () {
  'use strict'

  const ROTATE = 'Si ya se subió a algún sitio, regenérala en el panel del proveedor: borrarla del archivo no basta.'

  const RULES = [
    { id: 'private-key', name: 'Clave privada', re: /-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?(-----END [A-Z ]*PRIVATE KEY-----|$)/g, fix: 'Una clave privada nunca va en el código. Guárdala como archivo fuera del repositorio y añade su nombre al .gitignore.' },
    { id: 'anthropic', name: 'Clave de Anthropic', re: /\bsk-ant-[A-Za-z0-9_-]{20,}/g, fix: ROTATE },
    { id: 'openrouter', name: 'Clave de OpenRouter', re: /\bsk-or-v1-[a-f0-9]{32,}/g, fix: ROTATE },
    { id: 'openai', name: 'Clave de OpenAI o compatible', re: /\bsk-(proj-)?[A-Za-z0-9_-]{20,}/g, fix: ROTATE },
    { id: 'stripe', name: 'Clave secreta de Stripe', re: /\b(sk|rk)_live_[A-Za-z0-9]{20,}/g, fix: 'Con esta clave se pueden cobrar y reembolsar pagos. ' + ROTATE },
    { id: 'github', name: 'Token de GitHub', re: /\b(gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,})/g, fix: 'Da acceso a tus repositorios. ' + ROTATE },
    { id: 'aws', name: 'Clave de acceso de AWS', re: /\b(AKIA|ASIA)[0-9A-Z]{16}\b/g, fix: 'Desactívala en IAM y crea otra. Revisa el historial de facturación por si alguien la usó.' },
    { id: 'google', name: 'Clave de API de Google', re: /\bAIza[0-9A-Za-z_-]{35}\b/g, fix: 'Restringe la clave por dominio o por IP en Google Cloud, o regenérala.' },
    { id: 'slack', name: 'Token de Slack', re: /\bxox[abprs]-[A-Za-z0-9-]{10,}/g, fix: ROTATE },
    { id: 'groq', name: 'Clave de Groq', re: /\bgsk_[A-Za-z0-9]{20,}/g, fix: ROTATE },
    { id: 'nvidia', name: 'Clave de Nvidia', re: /\bnvapi-[A-Za-z0-9_-]{20,}/g, fix: ROTATE },
    { id: 'jwt', name: 'Token JWT', re: /\beyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/g, fix: 'Un JWT puede servir para entrar como otra persona mientras no caduque. No lo pegues en código ni en tickets.' },
    { id: 'url-password', name: 'Contraseña dentro de una URL', re: /\b[a-z][a-z0-9+.-]*:\/\/[^\s:@/]+:([^\s@/]{3,})@/gi, group: 1, fix: 'La contraseña de la base de datos o del servicio va en una variable de entorno aparte, no dentro de la URL del código.' },
    { id: 'assignment', name: 'Contraseña o clave escrita a mano', re: /\b([A-Za-z0-9_]*(?:PASSWORD|PASSWD|PWD|SECRET|TOKEN|API_?KEY|PRIVATE_?KEY|CONTRASE(?:Ñ|N)A)[A-Za-z0-9_]*)\s*[:=]\s*["']?([^\s"'#]{8,})["']?/gi, group: 2, fix: 'Si es real, sácala del archivo: déjala en un .env que esté en el .gitignore o en un gestor de secretos.' },
  ]

  /* Valores de relleno que no son secretos. */
  const PLACEHOLDER = /^(changeme|change_me|example|ejemplo|password|contraseña|secret|xxx+|\*+|<.*>|\$\{.*\}|\{\{.*\}\}|your[_-].*|tu[_-].*|process\.env.*|os\.environ.*|env\(.*\)|null|none|true|false|undefined)$/i

  function lineOf(text, index) {
    let n = 1
    for (let i = 0; i < index; i++) if (text.charCodeAt(i) === 10) n++
    return n
  }

  function scan(text) {
    const hits = []
    for (const rule of RULES) {
      rule.re.lastIndex = 0
      let m
      while ((m = rule.re.exec(text))) {
        if (m[0].length === 0) { rule.re.lastIndex++; continue }
        let start = m.index
        let value = m[0]
        if (rule.group) {
          value = m[rule.group]
          start = m.index + m[0].lastIndexOf(value)
          if (PLACEHOLDER.test(value)) continue
        }
        hits.push({ rule, start, end: start + value.length, value })
      }
    }
    /* Si dos detectores marcan lo mismo, gana el más específico (el primero de la lista). */
    hits.sort((a, b) => a.start - b.start || RULES.indexOf(a.rule) - RULES.indexOf(b.rule))
    const out = []
    for (const h of hits) {
      const last = out[out.length - 1]
      if (last && h.start < last.end) continue
      out.push({ ...h, line: lineOf(text, h.start) })
    }
    return out
  }

  function mask(value) {
    if (value.length <= 8) return '•'.repeat(value.length)
    return value.slice(0, 4) + '•'.repeat(Math.min(12, value.length - 4))
  }

  window.Sinfuga = { scan, mask, RULES }
})()
