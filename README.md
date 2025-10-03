# Ellise

Sitio estático de ropa deportiva inclusiva, con paleta de colores suaves y diseño responsive.

## Estructura
- `index.html`: marcado semántico y accesible
- `styles.css`: paleta suave, layout, componentes
- `script.js`: menú móvil y carrusel simple

## Uso
1. Abre `index.html` en tu navegador.
2. Edita `styles.css` para ajustar colores o tipografías.
3. Reemplaza los placeholders visuales por imágenes reales.
4. (Opcional) Configura tu CDN de imágenes.
5. (Opcional) Genera imágenes locales de productos y cárgalas a tu CDN.

## Personalización rápida
- Cambia colores en `:root` dentro de `styles.css` (variables `--soft-*` y `--primary`).
- Ajusta secciones (`#novedades`, `#colecciones`, `#destacados`) según tu catálogo.
 - Imágenes: coloca tus archivos en el CDN y usa rutas bajo `products/`.

## Accesibilidad
- Navegación por teclado (skip link, estados `aria-*`).
- Contraste suficiente y foco visible.

## Licencia
Uso interno / demo.

## CDN de imágenes
- El sitio puede cargar imágenes desde un CDN propio. En `index.html` las imágenes usan `data-cdn="ruta/en/cdn.jpg"` y un `src` mínimo placeholder.
- En `script.js` existe una configuración:

```html
<script>
  window.ELLise_CDN_BASE = 'https://cdn.tu-dominio.com/ellise';
</script>
<script src="script.js"></script>
```

- Si no configuras `window.ELLise_CDN_BASE`, se usará `https://cdn.example.com/ellise` por defecto.
- Coloca tus imágenes en el CDN, por ejemplo: `https://cdn.tu-dominio.com/ellise/products/top-respirable.jpg`.

## Generación de imágenes de productos
- Requisitos: Node 18+, clave de API en `ELLISE_IMAGE_API_KEY` (y `ELLISE_IMAGE_API_URL` si usas otro proveedor).
- Manifiesto: `tools/products.manifest.json` con archivos destino y prompts.
- Ejecuta:

```bash
npm run images
```

- Las imágenes se guardan en `./cdn/products/*.png`. El sitio está configurado para usar `./cdn` en local. Sube el contenido de `cdn/` a tu CDN y cambia `window.ELLise_CDN_BASE` en `index.html` al dominio del CDN.

### Imágenes responsivas y lazy-loading
- El script genera `srcset` con anchos `[400, 600, 800, 1200]` usando `?w=ANCHO` en la URL.
- En el HTML se define `sizes="(max-width: 680px) 100vw, (max-width: 960px) 50vw, 33vw"` para productos.
- Lazy-loading: se usa `IntersectionObserver` con `rootMargin: 200px` para cargar antes de entrar en viewport. Si no hay soporte, hace carga inmediata.
