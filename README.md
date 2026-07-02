# MarkFlow — Conversor Premium de Markdown a HTML

¡Bienvenido a **MarkFlow**! Un editor y conversor de Markdown a HTML en tiempo real, diseñado con una interfaz moderna, minimalista y de alto rendimiento. Convierte tus textos en formato Markdown en documentos web listos para publicar de manera instantánea y con estilos visuales impresionantes.

---

## ✨ Características Principales

- **Editor en Tiempo Real:** Visualiza los cambios instantáneamente a medida que escribes en Markdown.
- **Estilos Visuales Personalizados:** Alterna entre 4 plantillas de diseño exclusivas para la vista previa y la exportación:
  - **Documentación Moderna:** Un diseño limpio con estructura clara, ideal para guías y manuales técnicos.
  - **Artículo Elegante:** Tipografía cuidada y centrada, perfecta para blogs, posts y ensayos.
  - **Minimalista Limpio:** Estilo ultra-simplificado para concentrarse en la pureza del contenido.
  - **Consola Retro:** Un estilo nostálgico con fuente monoespaciada en color verde neón sobre fondo negro.
- **Resaltado de Sintaxis Dinámico:** Soporte integrado para múltiples lenguajes de programación en bloques de código (JavaScript, CSS, Python, JSON, Bash) gracias a *Prism.js*.
- **Diseño Dual (Claro/Oscuro):** Alterna fácilmente entre modo nocturno y modo diurno con persistencia de estado local (`localStorage`).
- **Arrastrar y Soltar (Drag & Drop):** Sube archivos Markdown (`.md`, `.txt`, `.markdown`) arrastrándolos directamente a la ventana del editor.
- **Exportación Flexible:**
  - **HTML Semántico Limpio:** Genera código HTML puro sin estilos en línea, perfecto para copiar en sistemas de gestión de contenido (CMS) como WordPress.
  - **HTML con Estilo Integrado:** Genera un documento HTML completo e independiente (`standalone`), con todos los estilos de la plantilla incrustados directamente, listo para ser visualizado en cualquier navegador.
- **Estadísticas de Escritura:** Contador automático en tiempo real de palabras, caracteres y tiempo estimado de lectura.
- **Portapapeles en un Clic:** Botón dedicado para copiar el HTML generado directamente al portapapeles.

---

## 🛠️ Tecnologías Utilizadas

MarkFlow está construido enteramente del lado del cliente, asegurando la máxima velocidad y privacidad para tus documentos (tus datos nunca salen de tu ordenador).

- **Estructura y Estilo:** HTML5 y CSS3 Vanilla (con un sistema de variables personalizado para soporte de temas dinámicos y transiciones fluidas).
- **Lógica:** JavaScript Moderno (ES6+).
- **Bibliotecas Clave:**
  - [Marked.js](https://marked.js.org/) — Analizador (parser) de Markdown rápido y eficiente.
  - [Prism.js](https://prismjs.com/) — Resaltador de sintaxis para bloques de código.
  - [FontAwesome](https://fontawesome.com/) — Iconografía moderna y descriptiva.
  - [Google Fonts](https://fonts.google.com/) — Integración de las fuentes *Outfit*, *Inter*, *Fira Code* y *Playfair Display*.

---

## 📂 Estructura del Proyecto

El repositorio cuenta con una arquitectura simple y limpia:

```text
├── index.html       # Estructura principal y maquetación de la aplicación web.
├── style.css        # Hoja de estilos del editor, vistas previas y plantillas.
├── app.js           # Lógica del editor, procesamiento de Markdown e importación/exportación.
└── README.md        # Documentación oficial del proyecto.
```

---

## 🚀 Cómo Empezar

Al ser una aplicación 100% de frontend (estática), no requiere de ningún proceso de compilación o instalación de servidores pesados.

### Opción 1: Ejecución Directa (Local)
1. Descarga o clona este repositorio en tu ordenador.
2. Abre el archivo [index.html](file:///c:/Users/abart/Documents/APP_ANTIGRAVITY/index.html) en cualquier navegador web moderno (Chrome, Firefox, Edge, Safari).
3. ¡Comienza a escribir!

### Opción 2: Servidor de Desarrollo Local (Recomendado)
Para una experiencia óptima con algunas características del navegador o si deseas realizar modificaciones, puedes usar cualquier servidor estático local. Por ejemplo, con Python o Node.js:

**Usando Node.js (Live Server):**
```bash
# Instala un servidor estático si no tienes uno
npm install -g live-server

# Ejecuta el servidor en la raíz del proyecto
live-server
```

**Usando Python:**
```bash
# Python 3
python -m http.server 8000
```
Luego accede a `http://localhost:8000` en tu navegador.

---

## 📝 Ejemplos de Uso en el Editor

Puedes probar todas estas opciones de sintaxis Markdown dentro del editor de MarkFlow:

```markdown
# Título Principal

## Subtítulo

Esto es un texto en **negrita** y esto en *cursiva*.

- Elemento de lista 1
- Elemento de lista 2

```javascript
// El bloque de código se resaltará automáticamente
const mensaje = "Hola Mundo desde MarkFlow";
console.log(mensaje);
```

Puedes ver cómo el diseño se adapta de inmediato al cambiar la plantilla en el selector superior.
```

---

## 📄 Licencia

Este proyecto es de código libre. Siéntete libre de utilizarlo, modificarlo y adaptarlo a tus necesidades.
