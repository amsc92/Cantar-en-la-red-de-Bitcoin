# Cantar en la red de Bitcoin. Para pensar con satoshis

 ___________________
 | _______________ |
 | |XXBLOCKXXXXXX| |
 | |XXXXXXPOEMXXX| |
 | |XXNaNaXXXXXXX| |
 | |XXXXXXXXSONGX| |
 | |XXXXXXXXXXXXX| |
 |_________________|
     _[_______]_
 ___[___________]___
|         [_____] []|__
|         [_____] []|  \__
L___________________J     \ \___\/
 ___________________      /\
/###################\    (__)


Proyecto de arte conceptual y performativo sobre la memoria cultural, las nanas
y la permanencia de los mensajes en la blockchain de Bitcoin. La web combina
textos, canciones de distintas tradiciones y una representación visual inspirada
en una cartera de Bitcoin.

## Sobre el proyecto

El proyecto explora la posibilidad de conservar fragmentos de canciones y
memorias transmitidas entre generaciones mediante mensajes incluidos en
transacciones de Bitcoin. La blockchain se presenta como un medio público,
descentralizado y difícil de censurar para dejar constancia de esa diversidad
cultural.

El sitio documenta la propuesta y enlaza transacciones existentes en
exploradores públicos. Su interfaz de cartera es una representación visual:
esta web estática no es una cartera de Bitcoin ni envía transacciones.

## Contenido

- `index.html`: portada, con una interfaz inspirada en Electrum y acceso a las
  canciones del proyecto.
- `About.html`: contexto, objetivos y descripción de la performance.
- `Nota.html`, `Nota_1.html` y `Nota_2text.html`: textos y reflexiones sobre
  Bitcoin, blockchain y memoria.
- `mempool.html`: guía y enlaces a transacciones con fragmentos de canciones.
- Páginas de canciones: `nana-afrocubana.html`, `romanche-song.html`,
  `Nana Nathual.html`, `Nana Haitiana.html`, `Nana Malgache.html`,
  `Nana Telugu.html` y `Nana Quechua.html`.
- `settings.html`, `Units.html`, `Fiat.html`, `Lightning.html` y
  `Password.html`: pantallas de configuración que forman parte de la
  representación de la cartera.
- `Island/`: una pieza interactiva hecha con p5.js.
- `img/`: imágenes utilizadas por el sitio.

## Cómo verlo

No se necesita instalar dependencias ni compilar el proyecto. Abre `index.html`
en un navegador moderno.

Las páginas se adaptan a pantallas de escritorio y móviles.

Para servirlo localmente, abre una terminal en la carpeta del proyecto y ejecuta:

```powershell
py -m http.server 8000
```

Después visita <http://localhost:8000/index.html>. Si el comando `py` no está
disponible, también puedes probar `python -m http.server 8000`.

## Tecnologías y servicios externos

- HTML, CSS y JavaScript sin framework.
- p5.js para la pieza de `Island/`.
- Algunos contenidos dependen de servicios externos, como CoinGecko para datos
  de precio, mempool.space para consultar transacciones y un juego incrustado.
  Se necesita conexión a Internet para acceder a esas funciones.

## Estructura

```text
.
├── index.html
├── About.html
├── Nota*.html
├── mempool.html
├── páginas de canciones (*.html)
├── styles.css
├── style.css
├── style_.css
├── search.js
├── img/
├── Island/
├── cool-text/
└── letter-spacing-animation/
```

Las carpetas `cool-text/` y `letter-spacing-animation/` contienen experimentos
web relacionados con texto y animación.
