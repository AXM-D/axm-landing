# Sinfuga

Pega un `.env`, un archivo de configuración o código, y Sinfuga marca las claves, tokens y contraseñas que no deberían salir de tu computadora. También copia una versión con los secretos tachados, para pegarla en un ticket o un chat.

**Pruébalo:** https://axm.qd.je/sinfuga/

> Proyecto demo de [AXM](https://axm.qd.je/). No es un encargo de un cliente: es una muestra de cómo trabajo.

## Qué detecta

- Claves de OpenAI, Anthropic, OpenRouter, Groq, Nvidia, Google, AWS, Stripe y Slack
- Tokens de GitHub y JWT
- Claves privadas (`-----BEGIN ... PRIVATE KEY-----`)
- Contraseñas dentro de URLs (`postgres://usuario:contraseña@...`)
- Variables como `PASSWORD`, `SECRET`, `TOKEN` o `API_KEY` con un valor escrito a mano (ignora valores de relleno como `changeme` o `${VAR}`)

## Privacidad

Todo corre en tu navegador: HTML, CSS y JavaScript sin dependencias ni servidor. No se envía nada, no hay analítica ni cookies. El ejemplo genera valores aleatorios en el momento, así que este repositorio no contiene ninguna clave.

## Usarlo en local

Abre `index.html` en el navegador. No hay que instalar nada.

## Archivos

- `detect.js`: las reglas de detección (fácil de ampliar: una expresión regular y un consejo por regla)
- `app.js`: el editor con las marcas y el informe
- `styles.css`: estilos
