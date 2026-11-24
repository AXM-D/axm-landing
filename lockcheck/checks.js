/* AXM Lockcheck: pruebas contra OSV.dev, el registro de npm y heurísticas locales. */
(function () {
  'use strict'

  /* Paquetes muy descargados: un nombre a una letra de distancia es sospechoso */
  const POPULAR = ['react', 'react-dom', 'lodash', 'express', 'axios', 'chalk', 'debug', 'commander', 'moment', 'request', 'webpack', 'typescript', 'vue', 'next', 'jquery', 'underscore', 'async', 'uuid', 'yargs', 'dotenv', 'bluebird', 'classnames', 'prop-types', 'body-parser', 'mkdirp', 'glob', 'rimraf', 'semver', 'colors', 'minimist', 'inquirer', 'fs-extra', 'eslint', 'prettier', 'jest', 'mocha', 'babel-core', 'core-js', 'rxjs', 'redux', 'mongoose', 'mysql', 'mysql2', 'pg', 'redis', 'socket.io', 'cors', 'jsonwebtoken', 'bcrypt', 'nodemailer', 'cheerio', 'puppeteer', 'electron', 'vite', 'esbuild', 'rollup', 'tailwindcss', 'postcss', 'sass', 'styled-components', 'graphql', 'apollo-server', 'koa', 'fastify', 'nestjs', 'angular', 'svelte', 'zod', 'dayjs', 'date-fns', 'node-fetch', 'cross-env', 'nodemon', 'ws', 'chokidar', 'tslib', 'sharp', 'ora', 'execa', 'got', 'superagent', 'qs', 'cookie-parser', 'helmet', 'morgan', 'multer', 'passport', 'sequelize', 'prisma', 'knex', 'ethers', 'web3', 'discord.js', 'telegraf', 'openai', 'anthropic', 'requests', 'numpy', 'pandas', 'django', 'flask', 'urllib3', 'boto3', 'setuptools', 'pyyaml', 'cryptography', 'pillow', 'scipy', 'matplotlib', 'beautifulsoup4', 'selenium', 'fastapi', 'pydantic', 'sqlalchemy', 'colorama', 'tqdm', 'click', 'jinja2', 'paramiko']
  const POP = new Set(POPULAR)

  function lev(a, b) {
    if (Math.abs(a.length - b.length) > 1) return 9
    const d = Array.from({ length: a.length + 1 }, (_, i) => [i])
    for (let j = 1; j <= b.length; j++) d[0][j] = j
    for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) {
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1)
    }
    return d[a.length][b.length]
  }

  function typos(pkgs) {
    const out = []
    for (const p of pkgs) {
      const base = p.name.replace(/^@[^/]+\//, '')
      if (POP.has(p.name) || POP.has(base) || base.length < 4) continue
      const near = POPULAR.find((n) => n.length >= 4 && lev(base, n) === 1)
      if (near) out.push({ pkg: p, near })
    }
    return out
  }

  /* ---------- OSV.dev ---------- */
  async function osv(pkgs, onProgress) {
    const hits = new Map()
    for (let i = 0; i < pkgs.length; i += 500) {
      const chunk = pkgs.slice(i, i + 500)
      const r = await fetch('https://api.osv.dev/v1/querybatch', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ queries: chunk.map((p) => ({ package: { name: p.name, ecosystem: p.eco }, version: p.version })) }),
      })
      if (!r.ok) throw new Error(`OSV ${r.status}`)
      const j = await r.json()
      j.results.forEach((res, k) => { if (res.vulns?.length) hits.set(chunk[k], res.vulns.map((v) => v.id)) })
      onProgress?.(Math.min(i + 500, pkgs.length))
    }
    /* detalles: primero el malware, luego el resto, con tope */
    const ids = [...new Set([...hits.values()].flat())].sort((a, b) => (b.startsWith('MAL-') - a.startsWith('MAL-')))
    const details = new Map()
    let n = 0
    const worker = async () => {
      while (n < Math.min(ids.length, 250)) {
        const id = ids[n++]
        try {
          const r = await fetch(`https://api.osv.dev/v1/vulns/${encodeURIComponent(id)}`)
          if (r.ok) details.set(id, await r.json())
        } catch { /* sigue */ }
      }
    }
    await Promise.all(Array.from({ length: 8 }, worker))
    return { hits, details }
  }

  function severity(v) {
    if (!v) return 'unknown'
    /* Avisos de malware: los MAL- de OSV y los GHSA de GitHub titulados como paquete o código malicioso */
    if (v.id.startsWith('MAL-') || /^(malicious|embedded malicious code)|malicious (package|code|version)|contains? malware|\bis (a )?malware\b|(backdoor|compromised) (in|version|package)/i.test(v.summary || '')) return 'malware'
    const s = (v.database_specific?.severity || '').toUpperCase()
    if (s === 'CRITICAL') return 'critical'
    if (s === 'HIGH') return 'high'
    if (s === 'MODERATE' || s === 'MEDIUM') return 'moderate'
    if (s === 'LOW') return 'low'
    return 'unknown'
  }

  function fixedIn(v, name) {
    const fixes = []
    for (const a of v?.affected || []) {
      if (a.package?.name?.toLowerCase() !== name.toLowerCase()) continue
      for (const r of a.ranges || []) for (const e of r.events || []) if (e.fixed) fixes.push(e.fixed)
    }
    return [...new Set(fixes)]
  }

  /* ---------- Versiones recién publicadas (ventana de los gusanos) ---------- */
  async function freshness(pkgs, limit = 40) {
    const pick = pkgs.filter((p) => p.eco === 'npm').sort((a, b) => (b.script - a.script) || (b.direct - a.direct)).slice(0, limit)
    const out = []
    let i = 0
    const worker = async () => {
      while (i < pick.length) {
        const p = pick[i++]
        try {
          const r = await fetch(`https://registry.npmjs.org/${p.name.replace('/', '%2F')}`)
          if (!r.ok) continue
          const j = await r.json()
          const t = j.time?.[p.version]
          if (!t) { out.push({ pkg: p, missing: true }); continue }
          const hours = (Date.now() - new Date(t)) / 36e5
          const deprecated = j.versions?.[p.version]?.deprecated
          out.push({ pkg: p, hours, deprecated })
        } catch { /* sigue */ }
      }
    }
    await Promise.all(Array.from({ length: 6 }, worker))
    return { checked: pick.length, results: out }
  }

  window.Checks = { osv, severity, fixedIn, freshness, typos }
})()
