# Project Scratchpad: Pati Sweet Creations Web

## Background and Motivation

El objetivo es crear/mejorar una web sencilla para "Pati Sweet Creations" que muestre productos, permita configurarlos (cuando sea necesario) y facilite realizar pedidos a través de WhatsApp. Se ha implementado la estructura básica de productos, un carrito de compra global, y una página de resumen de pedido. Se busca mejorar la experiencia de usuario y la presentación general.

## Key Challenges and Analysis (Planner Input - Initial Review)

### 1. Image Optimization
- **Challenge:** Las imágenes de productos pueden afectar significativamente el tiempo de carga, especialmente en conexiones móviles.
- **Analysis:** 
    - Actualmente, las imágenes parecen cargarse directamente (`<img>` tag). No se observa _lazy loading_ explícito ni uso de formatos modernos como WebP.
    - Los tamaños de las imágenes no han sido revisados; podrían ser más grandes de lo necesario para su visualización.
    - **Files to check:** `src/pages/Index.tsx`, `src/pages/ProductDetail.tsx`, `src/pages/CategoryPage.tsx`, `src/pages/OrderSummary.tsx`, `src/data/products.ts` (URLs).

### 2. Configurator Clarity & UX
- **Challenge:** Asegurar que los distintos tipos de configuradores (`fixedPack`, `flavorPack`, `cookiePack`, `flavorQuantity`, `flavorOnly`) sean intuitivos y fáciles de usar.
- **Analysis:**
    - **`cookiePack` / `flavorPack` (`ItemPackConfigurator`):** La necesidad de seleccionar PRIMERO el tamaño del pack y LUEGO los items puede ser un poco rígida. El contador de items restantes es útil.
    - **`flavorCheckboxSelector` (`flavorPack` simple):** La selección múltiple con límite está bien, pero el feedback visual de cuántos faltan podría mejorarse si el límite es alto.
    - **`flavorQuantitySelector` (`flavorQuantity`):** El uso de +/- para cada sabor es claro. El botón de añadir globalmente necesita estar bien diferenciado del de pedir solo ese item.
    - **`simpleProductDisplay` / `fixedPackSelector`:** Son los más sencillos, pero asegurar que el precio y la descripción del pack/opción sean claros es vital.
    - **General:** ¿Está claro el precio *final* que se va a añadir al carrito en todos los casos antes de pulsar el botón?
    - **Files to check:** `src/pages/ProductDetail.tsx` (todos los selectores/displays internos).

### 3. Responsiveness & Layout
- **Challenge:** Garantizar una experiencia consistente y sin problemas visuales en diferentes tamaños de pantalla.
- **Analysis:**
    - **`ProductDetail`:** La disposición de imagen + configurador necesita revisión en pantallas intermedias (tablets). ¿Se aprovecha bien el espacio?
    - **`OrderSummary`:** La tabla/lista de items debe adaptarse bien en móviles. El layout actual (`flex-col sm:flex-row`) parece un buen punto de partida, pero hay que verificarlo con contenido real.
    - **`Navbar` / `MobileCartBar`:** La transición entre menú de escritorio y móvil, y la visibilidad/funcionalidad de la barra móvil parecen correctas, pero siempre es bueno un repaso final.
    - **General:** Revisar posibles desbordamientos de texto, elementos que se solapen o tamaños de fuente incómodos en pantallas pequeñas.
    - **Files to check:** `src/pages/ProductDetail.tsx`, `src/pages/OrderSummary.tsx`, `src/components/layout/Navbar.tsx`, `src/components/layout/MobileCartBar.tsx`, CSS global/Tailwind config.

### 4. Accessibility (Basic)
- **Challenge:** Cumplir con unos mínimos de accesibilidad.
- **Analysis:**
    - Faltan `alt` text descriptivos en algunas imágenes (ej. placeholders, quizás cookies individuales).
    - Revisar el uso de `aria-label` en botones icon-only o elementos interactivos complejos.
    - Contraste de colores (parece bueno en general con la paleta actual, pero verificar).
    - **Files to check:** Todos los componentes con imágenes y elementos interactivos.

## High-level Task Breakdown (Planner Input - Initial Suggestions)

Basado en el análisis anterior, se proponen las siguientes tareas (prioridad sugerida de arriba abajo):

1.  **Mejorar Claridad Configurador `cookiePack`/`flavorPack`:** Mostrar el precio del pack seleccionado más prominentemente *antes* de empezar a elegir items. Considerar deshabilitar los botones +/- de items si no se ha seleccionado un pack.
2.  **Optimizar Imágenes Productos:** Implementar _lazy loading_ para imágenes en `ProductDetail`, `CategoryPage`, `OrderSummary`. Revisar tamaños y considerar formato WebP si es viable.
3.  **Revisión Responsividad `ProductDetail`:** Ajustar el layout en vista tablet/móvil para mejor flujo entre imagen y configurador.
4.  **Revisión Responsividad `OrderSummary`:** Verificar la tabla de items en móvil y ajustar si es necesario.
5.  **Añadir `alt` text descriptivos:** Revisar todas las imágenes (productos, cookies individuales) y añadir textos `alt` significativos.
6.  **Mejorar Feedback `flavorCheckboxSelector`:** Si el límite de selección es > 3, mostrar contador `(seleccionados/límite)`. 
7.  **Revisar `aria-label`s:** Asegurar que todos los botones sin texto claro (iconos) tengan `aria-label`.

## Project Status Board

- [x] Implementar estructura básica de productos y datos (`products.ts`, `types/product`).
- [x] Crear contexto de carrito (`CartContext`, `types/cart`).
- [x] Integrar `CartProvider` en `App.tsx`.
- [x] Refactorizar `products.ts` con `configType`, precios unitarios, sabores.
- [x] Implementar configurador `cookiePack` (`ItemPackConfigurator`).
- [x] Implementar configurador `flavorPack` (`FlavorCheckboxSelector` o `ItemPackConfigurator`).
- [x] Implementar configurador `flavorQuantity` (`FlavorQuantitySelector`).
- [x] Implementar display simple (`SimpleProductDisplay`, `FixedPackSelector`).
- [x] Añadir botones "Añadir Carrito" y "Pedir Solo WhatsApp".
- [x] Implementar `MobileCartBar` con dropdown de detalle y botón envío WhatsApp.
- [x] Corregir errores cálculo total y botones +/- en carrito.
- [x] Añadir icono carrito a `Navbar` escritorio.
- [x] Actualizar estilo botón "Ver/Enviar Pedido" en `MobileCartBar`.
- [x] Subir cambios visuales Navbar/MobileCartBar.
- [x] Crear página resumen pedido (`/pedido`).
- [x] Implementar animación en icono carrito al añadir item (quitar `alert`).
- [x] **Planner:** Realizar revisión general y proponer mejoras.
- [x] **Executor:** Mejorar Claridad Configurador `cookiePack`/`flavorPack`.
- [x] **Executor:** Modificar barra inferior `ItemPackConfigurator` para que sea siempre visible.
- [x] **Executor:** Eliminar botones "Pedir Solo...".
- [x] **Executor:** Optimizar Imágenes Productos (Lazy Loading).
- [x] **Executor:** Revisión Responsividad `ProductDetail`.
- [x] **Executor:** Revisión Responsividad `OrderSummary`.
- [x] **Executor:** Añadir `alt` text descriptivos.
- [x] **Executor:** Mejorar Feedback `flavorCheckboxSelector`.
- [x] **Executor:** Revisar `aria-label`s.

## Executor's Feedback or Assistance Requests

*Se han aplicado las mejoras generales solicitadas (imágenes, responsividad, accesibilidad). Pendiente de revisión y próximos pasos.* 

## Lessons Learned

- La gestión de estado con `useReducer` y `Context` es efectiva para el carrito.
- Es importante definir tipos claros (`TypeScript`) para productos y carrito para evitar errores.
- La generación de IDs únicos para `CartItem` requiere considerar las opciones seleccionadas para evitar colisiones.
- El `linter` puede dar falsos positivos o requerir varios intentos para aplicar correcciones complejas de tipos.
- Usar `alert()` para feedback no es ideal; preferible `toast` o animaciones sutiles.
- Siempre verificar rutas (`/pedido`) antes de enlazar a ellas.
- La animación directa del icono del carrito es una alternativa viable al `toast` para feedback de "añadir al carrito".
- Hacer la barra inferior del configurador de packs siempre visible mejora la UX en escritorio.
- El atributo `loading="lazy"` es una forma sencilla de mejorar el rendimiento de carga inicial de imágenes.
- Añadir `aria-label` y otros atributos ARIA mejora la accesibilidad para usuarios de lectores de pantalla. 