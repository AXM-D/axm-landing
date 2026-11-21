/* Gemelo: genera variantes de un dominio como las que usa quien quiere suplantarlo. */
(function () {
  'use strict'

  const NEAR = {
    a: 'qsz', b: 'vgn', c: 'xdv', d: 'sfe', e: 'wrd', f: 'dgr', g: 'fht', h: 'gjy', i: 'uok', j: 'hku',
    k: 'jli', l: 'kop', m: 'n', n: 'bm', o: 'ipl', p: 'ol', q: 'wa', r: 'etf', s: 'adw', t: 'ryg',
    u: 'yij', v: 'cb', w: 'qes', x: 'zc', y: 'tu', z: 'xa',
  }
  const LOOK = [['o', '0'], ['l', '1'], ['i', '1'], ['i', 'l'], ['e', '3'], ['a', '4'], ['s', '5'], ['m', 'rn'], ['rn', 'm'], ['w', 'vv'], ['g', 'q'], ['b', 'd']]
  const TLDS = ['com', 'com.mx', 'mx', 'net', 'org', 'co', 'io', 'app', 'online', 'site', 'shop', 'xyz', 'info', 'store']
  const WORDS = ['login', 'soporte', 'pagos', 'seguro', 'cuenta', 'mx', 'oficial', 'app']

  const VALID = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/

  function parse(input) {
    let d = String(input).trim().toLowerCase()
    d = d.replace(/^[a-z]+:\/\//, '').replace(/^www\./, '').split(/[/?#:]/)[0]
    const i = d.indexOf('.')
    if (i < 1) return null
    const name = d.slice(0, i)
    const tld = d.slice(i + 1)
    if (!VALID.test(name) || !/^[a-z]{2,}(\.[a-z]{2,})?$/.test(tld)) return null
    return { name, tld, domain: `${name}.${tld}` }
  }

  function generate({ name, tld }) {
    const out = new Map()
    const add = (n, t, kind) => {
      if (!VALID.test(n) || n.length < 2) return
      const d = `${n}.${t}`
      if (d === `${name}.${tld}` || out.has(d)) return
      out.set(d, { domain: d, kind })
    }
    for (let i = 0; i < name.length; i++) {
      add(name.slice(0, i) + name.slice(i + 1), tld, 'Le falta una letra')
      add(name.slice(0, i) + name[i] + name.slice(i), tld, 'Letra repetida')
      if (i < name.length - 1) add(name.slice(0, i) + name[i + 1] + name[i] + name.slice(i + 2), tld, 'Letras invertidas')
      for (const c of NEAR[name[i]] || '') add(name.slice(0, i) + c + name.slice(i + 1), tld, 'Tecla de al lado')
      if (i > 0) add(name.slice(0, i) + '-' + name.slice(i), tld, 'Con guion')
    }
    for (const [a, b] of LOOK) {
      let at = name.indexOf(a)
      while (at !== -1) {
        add(name.slice(0, at) + b + name.slice(at + a.length), tld, 'Letra que se parece')
        at = name.indexOf(a, at + 1)
      }
    }
    for (const t of TLDS) if (t !== tld) add(name, t, 'Otra terminación')
    for (const w of WORDS) {
      add(`${name}-${w}`, tld, 'Palabra añadida')
      add(`${w}-${name}`, tld, 'Palabra añadida')
    }
    add(`${name}s`, tld, 'Letra añadida')
    return [...out.values()]
  }

  /* Partes que cambian respecto al original, para resaltarlas */
  function diff(original, variant) {
    let a = 0
    while (a < original.length && a < variant.length && original[a] === variant[a]) a++
    let b = 0
    while (b < original.length - a && b < variant.length - a && original[original.length - 1 - b] === variant[variant.length - 1 - b]) b++
    return [variant.slice(0, a), variant.slice(a, variant.length - b), variant.slice(variant.length - b)]
  }

  window.Gemelo = { parse, generate, diff }
})()
