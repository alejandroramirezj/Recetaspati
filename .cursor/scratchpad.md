# Project Scratchpad: Pati Sweet Creations Web

## Background and Motivation

El objetivo es crear/mejorar una web sencilla para "Pati Sweet Creations" que muestre productos, permita configurarlos (cuando sea necesario) y facilite realizar pedidos a través de WhatsApp. Se ha implementado la estructura básica de productos, un carrito de compra global, y una página de resumen de pedido. Se busca mejorar la experiencia de usuario y la presentación general.

El usuario desea que el resumen del pedido (`OrderSummary.tsx`) y el carrito móvil (`MobileCartBar.tsx`) muestren claramente los sabores seleccionados o las galletas individuales para todos los tipos de productos. También solicitó la conversión de imágenes `.png` a formato `.webp` en todo el proyecto.

El usuario ha solicitado los siguientes cambios:

- Que el segundo producto del catálogo sea la "caja de galletas".
- Que la sección "hero" se centre en la "tarta de galletas en Granada", con el texto "Pide tu tarta de galleta".
- Eliminar el isotipo de la sección Hero.
- Incluir el isotipo a la izquierda del logo en el Navbar.
- Eliminar los botones de TikTok e Instagram del Navbar en la versión móvil.
- Centrar el logo con el isotipo en el Navbar en la versión móvil.
- Añadir un acceso al carrito a la derecha del Navbar con un icono SVG en la versión móvil.
- El resumen del pedido (la vista en móvil) tiene que ser como el carrito móvil.
- La píldora del carrito móvil debe ocultarse cuando se está en la pestaña de resumen del pedido.
- Ocultar el contador de artículos del Navbar en móvil.
- Ocultar la barra del total del pedido en la página de resumen.
- Restaurar el contador rojo de ítems en el Navbar móvil.

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

### 5. Space Optimization (Planner Input - Review)
- **Challenge:** La web utiliza bastante espacio vertical y horizontal, lo que podría compactarse para mejorar la densidad de información y reducir el scroll.
- **Analysis:**
    - **Vertical Spacing (Homepage):** Las secciones principales (`#productos`, `#recomendador`, `#testimonios`, etc.) usan `py-16` o `py-20`, lo cual es generoso. Reducir a `py-12 md:py-16` podría mejorar la cohesión.
    - **Component Spacing:** Las tarjetas (`Card`), configuradores y el asistente usan `space-y-6`, `gap-8`, `p-6`, etc. Reducciones incrementales (`space-y-5`, `gap-6`, `p-5`) podrían ser beneficiosas.
    - **Wizard Height:** El `min-h` en `RecommendationWizard` podría ajustarse dinámicamente o reducirse más si el paso más corto lo permite.
    - **Grid Gaps:** Los `gap` en grids de productos (`ProductCatalog`, `CategoryPage`, `ProductDetail`) pueden ser reducidos para mayor densidad.
    - **Layout Elements:** `Navbar` y barras inferiores parecen tener alturas razonables, pero el `Footer` podría revisarse.
- **Files to check:** `src/pages/Index.tsx`, `src/pages/ProductDetail.tsx`, `src/components/home/RecommendationWizard.tsx`, `src/pages/OrderSummary.tsx`, `src/pages/CategoryPage.tsx`, `src/components/layout/Footer.tsx`, Tailwind config (si hay valores base definidos).

## High-level Task Breakdown

### Mejoras Generales (Planner Input - Initial Suggestions)

1.  **Mejorar Claridad Configurador `cookiePack`/`flavorPack`:** Mostrar el precio del pack seleccionado más prominentemente *antes* de empezar a elegir items. Considerar deshabilitar los botones +/- de items si no se ha seleccionado un pack.
2.  **Optimizar Imágenes Productos:** Implementar _lazy loading_ para imágenes en `ProductDetail`, `CategoryPage`, `OrderSummary`. Revisar tamaños y considerar formato WebP si es viable.
3.  **Revisión Responsividad `ProductDetail`:** Ajustar el layout en vista tablet/móvil para mejor flujo entre imagen y configurador.
4.  **Revisión Responsividad `OrderSummary`:** Verificar la tabla de items en móvil y ajustar si es necesario.
5.  **Añadir `alt` text descriptivos:** Revisar todas las imágenes (productos, cookies individuales) y añadir textos `alt` significativos.
6.  **Mejorar Feedback `flavorCheckboxSelector`:** Si el límite de selección es > 3, mostrar contador `(seleccionados/límite)`. 
7.  **Revisar `aria-label`s:** Asegurar que todos los botones sin texto claro (iconos) tengan `aria-label`.

### Bloque de Optimización de Espacio

- [ ] **Executor:** Reducir padding vertical secciones Homepage (`Index.tsx`).
- [ ] **Executor:** Compactar espaciado en `ProductDetail` (grid gap, space-y, card padding).
- [ ] **Executor:** Ajustar altura mínima y espaciado en `RecommendationWizard`.
- [ ] **Executor:** Reducir gaps en grids de `OrderSummary` y `CategoryPage`.
- [ ] **Executor:** Revisar y ajustar padding del `Footer`.

### Nueva Funcionalidad: Limitar Sabores en Pack Específico

#### Background and Motivation

El usuario ha solicitado que para un producto específico, el "pack de 6 galletas", se limite la selección a un máximo de 2 sabores diferentes. Esto busca simplificar la elección para este pack en particular o gestionar el inventario/producción.

#### Key Challenges and Analysis

*   **Identificación del Pack:** Se debe poder identificar de forma única el "pack de 6 galletas" en la estructura de datos de productos.
*   **Modificación del Configurador:** El componente configurador (probablemente `ItemPackConfigurator` o similar) deberá ser modificado para:
    *   Recibir o inferir el límite máximo de sabores para el pack actual.
    *   Deshabilitar la selección de más sabores una vez alcanzado el límite.
    *   Proveer feedback claro al usuario sobre esta restricción.
*   **Estructura de Datos:** Es posible que sea necesario añadir un nuevo campo a la definición del producto o del pack en `products.ts` para especificar este límite de sabores (e.g., `maxUniqueFlavors`).

#### High-level Task Breakdown

1.  **Executor:** Actualizar `scratchpad.md` para reflejar la nueva tarea. (DONE)
2.  **Executor:** Identificar el producto "pack de 6 galletas" en `src/data/products.ts` y su `configType`.
3.  **Executor:** Modificar la interfaz `ProductOption` o `Product` en `src/types/product.ts` para incluir un campo opcional como `maxUniqueFlavors?: number`.
4.  **Executor:** Actualizar la entrada del "pack de 6 galletas" en `src/data/products.ts` para añadir `maxUniqueFlavors: 2`.
5.  **Executor:** Localizar el componente configurador relevante (probablemente `ItemPackConfigurator` en `src/pages/ProductDetail.tsx` o un subcomponente).
6.  **Executor:** Modificar la lógica del configurador para:
    *   Leer la propiedad `maxUniqueFlavors` del pack seleccionado (si existe).
    *   Contar el número de sabores únicos ya seleccionados.
    *   Si `maxUniqueFlavors` está definido y se alcanza el límite de sabores únicos, deshabilitar la opción de añadir *nuevos* sabores (pero permitir aumentar la cantidad de los ya seleccionados, hasta el total de items del pack).
    *   Mostrar un mensaje informativo si se intenta exceder el límite de sabores.
7.  **Executor:** Probar la funcionalidad exhaustivamente.
8.  **Executor:** Actualizar `scratchpad.md` e informar al usuario.

### Nueva Funcionalidad: Pack Personalizado de Galletas

#### Background and Motivation

El usuario desea añadir una opción de "Pack Personalizado" para la "Caja de Galletas Artesanales". En este modo, cada galleta tiene un precio individual (3€) y no hay limitación en la cantidad de sabores únicos que se pueden elegir, ni un tamaño de pack predefinido (el cliente elige cuántas quiere).

#### Key Challenges and Analysis

*   **Distinción de Tipos de Pack:** El `ItemPackConfigurator` necesitará distinguir entre packs con tamaño fijo (y posible límite de sabores) y el nuevo pack personalizado con precio por unidad.
*   **Cálculo de Precio Dinámico:** El precio total del pack personalizado cambiará con cada galleta añadida/quitada.
*   **Adaptación de la UI:** Las descripciones, contadores y condiciones de "completado" deben cambiar significativamente para el pack personalizado.
*   **Estructura de Datos (`Option`):** La interfaz `Option` necesitará nuevos campos para marcar un pack como personalizado y definir su precio unitario.

#### High-level Task Breakdown

1.  **Executor:** Actualizar `scratchpad.md` para reflejar la nueva tarea. (DONE)
2.  **Executor:** Añadir `isCustomPack?: boolean` y `customPackUnitPrice?: number` a la interfaz `Option` en `src/data/products.ts`.
3.  **Executor:** Añadir la nueva opción "Pack Personalizado" (con `isCustomPack: true` y `customPackUnitPrice: 3`) al producto "Caja de Galletas Artesanales" (`id: 2`) en `src/data/products.ts`.
4.  **Executor:** En `ItemPackConfigurator` (`src/pages/ProductDetail.tsx`):
    *   Leer las nuevas propiedades `isCustomPack` y `customPackUnitPrice` en `packOptions`.
    *   Añadir estado para saber si el pack actual es personalizado (e.g., `currentPackIsCustom: boolean`).
    *   Modificar `handlePackSelect` para establecer `currentPackIsCustom` y resetear/ignorar `selectedPackSize` y `maxUniqueSelectedFlavorsAllowed` si el pack es personalizado.
    *   Ajustar `currentCount`: sigue siendo la suma de `selectedItems`.
    *   Ajustar `finalPackPrice`: si `currentPackIsCustom`, será `currentCount * customPackUnitPrice` del pack seleccionado. Sino, la lógica actual.
    *   Ajustar `incrementItem` y la lógica de deshabilitación de botones: Si `currentPackIsCustom`, no aplicar límites de `selectedPackSize` ni de `maxUniqueSelectedFlavorsAllowed` (se pueden añadir tantas galletas de tantos tipos como se quiera, el único límite es práctico o de UI si se define uno alto).
    *   Ajustar `isOrderComplete`: si `currentPackIsCustom`, es `true` si `currentCount > 0`.
    *   Actualizar la UI (descripciones de packs, contadores en "Elige tus Galletas", textos de botones, barra inferior) para reflejar la lógica del pack personalizado (precio por unidad, sin límites fijos de tamaño/sabores).
    *   Modificar `handleAddToCart` para usar el `finalPackPrice` calculado y en `cookieDetails`, `packSize` podría ser `currentCount`.
5.  **Executor:** Probar la nueva opción de pack personalizado y verificar que los packs existentes (6 y 12 unidades) sigan funcionando correctamente.
6.  **Executor:** Actualizar `scratchpad.md` e informar al usuario.

### Nueva Funcionalidad: Minijuego "Cookie Catcher"

#### Background and Motivation

El usuario ha solicitado la creación de un minijuego interactivo en el sitio web. El objetivo es aumentar la participación del usuario y ofrecer una recompensa divertida. El concepto es un juego donde el usuario debe "atrapar" galletas que caen por la pantalla. Al alcanzar una puntuación objetivo (10 galletas), el usuario gana una "bolsa de minicookies gratis" que debería añadirse a su pedido/carrito. Se busca que el juego sea visualmente atractivo y divertido ("muy guay").

#### Key Challenges and Analysis (Initial)

*   **Implementación del Juego:** Requiere lógica de juego (movimiento, colisiones/captura, puntuación, estados de juego), gráficos/animaciones y manejo de interacciones del usuario dentro de un entorno React. Se debe elegir una tecnología adecuada (CSS, SVG, Canvas, librería tipo Framer Motion o similar) que equilibre simplicidad y el efecto "muy guay" deseado.
*   **Integración con Carrito:** La recompensa (minicookies gratis) debe añadirse al estado global del carrito (`CartContext`). Hay que definir cómo representar este item (¿producto con precio 0?) y cómo prevenir que se añada múltiples veces.
*   **UI/UX:** ¿Dónde y cómo se accede al juego? ¿Es una sección permanente, un pop-up, un easter egg? ¿Cómo se informa al usuario de la recompensa?
*   **Rendimiento:** Asegurar que el juego no impacte negativamente el rendimiento general del sitio.

#### High-level Task Breakdown (Initial Sketch)

1.  **Diseño Conceptual y UI:** Definir flujo, aspecto visual, mecánicas detalladas.
2.  **Selección Tecnológica:** Elegir librería/método de implementación.
3.  **Desarrollo del Núcleo del Juego:** Crear componente, lógica de caída, captura, puntuación.
4.  **Implementación de Recompensa:** Modificar `CartContext` y lógica de adición del premio.
5.  **Integración en la Web:** Añadir el juego al sitio.
6.  **Pruebas y Refinamiento:** Asegurar funcionalidad y diversión.

## Project Status Board

**Funcionalidades Base y Mejoras Iniciales:**
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
- [x] **Executor:** Optimizar visualización de packs en FixedPackSelector a formato compacto tipo botón, manteniendo nombre, precio y descripción.

**Bloque de Mejoras Generales (Post-Funcionalidad):**
- [x] Optimizar Imágenes Productos (Lazy Loading).
- [x] Revisión Responsividad `ProductDetail`.
- [x] Revisión Responsividad `OrderSummary`.
- [x] Añadir `alt` text descriptivos.
- [x] Revisar `aria-label`s.
- [x] **Executor:** Mejorar Feedback `flavorCheckboxSelector`.

**Bloque de Optimización de Espacio:**
- [x] **Executor:** Reducir padding vertical secciones Homepage (`Index.tsx`).
- [x] **Executor:** Compactar espaciado en `ProductDetail` (grid gap, space-y, card padding).
- [x] **Executor:** Ajustar altura mínima y espaciado en `RecommendationWizard`.
- [x] **Executor:** Reducir gaps en grids de `OrderSummary` y `CategoryPage`.
- [x] **Executor:** Revisar y ajustar padding del `Footer`.

**Nueva Funcionalidad: Limitar Sabores en Pack Específico:**
- [x] **Executor:** Actualizar `scratchpad.md` para reflejar la nueva tarea.
- [x] **Executor:** Identificar el producto "pack de 6 galletas" en `src/data/products.ts` y su `configType`.
- [x] **Executor:** Modificar la interfaz `ProductOption` o `Product` en `src/types/product.ts` para incluir un campo opcional como `maxUniqueFlavors?: number`.
- [x] **Executor:** Actualizar la entrada del "pack de 6 galletas" en `src/data/products.ts` para añadir `maxUniqueFlavors: 2`.
- [x] **Executor:** Localizar el componente configurador relevante (probablemente `ItemPackConfigurator` en `src/pages/ProductDetail.tsx` o un subcomponente).
- [x] **Executor:** Modificar la lógica del configurador para:
    *   Leer la propiedad `maxUniqueFlavors` del pack seleccionado (si existe).
    *   Contar el número de sabores únicos ya seleccionados.
    *   Si `maxUniqueFlavors` está definido y se alcanza el límite de sabores únicos, deshabilitar la opción de añadir *nuevos* sabores (pero permitir aumentar la cantidad de los ya seleccionados, hasta el total de items del pack).
    *   Mostrar un mensaje informativo si se intenta exceder el límite de sabores.
- [x] **Executor:** Probar la funcionalidad exhaustivamente.
- [x] **Executor:** Actualizar `scratchpad.md` e informar al usuario.

**Nueva Funcionalidad: Pack Personalizado de Galletas:**
- [x] **Executor:** Actualizar `scratchpad.md` para reflejar la nueva tarea.
- [x] **Executor:** Añadir `isCustomPack?: boolean` y `customPackUnitPrice?: number` a la interfaz `Option` en `src/data/products.ts`.
- [x] **Executor:** Añadir la nueva opción "Pack Personalizado" (con `isCustomPack: true` y `customPackUnitPrice: 3`) al producto "Caja de Galletas Artesanales" (`id: 2`) en `src/data/products.ts`.
- [x] **Executor:** En `ItemPackConfigurator` (`src/pages/ProductDetail.tsx`):
    *   Leer las nuevas propiedades `isCustomPack` y `customPackUnitPrice` en `packOptions`.
    *   Añadir estado para saber si el pack actual es personalizado (e.g., `currentPackIsCustom: boolean`).
    *   Modificar `handlePackSelect` para establecer `currentPackIsCustom` y resetear/ignorar `selectedPackSize` y `maxUniqueSelectedFlavorsAllowed` si el pack es personalizado.
    *   Ajustar `currentCount`: sigue siendo la suma de `selectedItems`.
    *   Ajustar `finalPackPrice`: si `currentPackIsCustom`, será `currentCount * customPackUnitPrice` del pack seleccionado. Sino, la lógica actual.
    *   Ajustar `incrementItem` y la lógica de deshabilitación de botones: Si `currentPackIsCustom`, no aplicar límites de `selectedPackSize` ni de `maxUniqueSelectedFlavorsAllowed` (se pueden añadir tantas galletas de tantos tipos como se quiera, el único límite es práctico o de UI si se define uno alto).
    *   Ajustar `isOrderComplete`: si `currentPackIsCustom`, es `true` si `currentCount > 0`.
    *   Actualizar la UI (descripciones de packs, contadores en "Elige tus Galletas", textos de botones, barra inferior) para reflejar la lógica del pack personalizado (precio por unidad, sin límites fijos de tamaño/sabores).
    *   Modificar `handleAddToCart` para usar el `finalPackPrice` calculado y en `cookieDetails`, `packSize` podría ser `currentCount`.
- [x] **Executor:** Probar la nueva opción de pack personalizado y verificar que los packs existentes (6 y 12 unidades) sigan funcionando correctamente.
- [x] **Executor:** Actualizar `scratchpad.md` e informar al usuario.

**Mejoras en MobileCartBar (Nueva Solicitud del Usuario):**
- [x] **Executor:** Modificar la lógica de visibilidad de la píldora para que solo aparezca cuando hay productos en el carrito O cuando hay una selección activa de pack.
- [x] **Executor:** Mejorar el formato del progreso de selección de "1/6 seleccionadas" a "1 de 6".
- [x] **Executor:** Cambiar el texto del botón de "Ver/Enviar Pedido" a "Ver Pedido" cuando hay un pack completo seleccionado.
- [x] **Executor:** Añadir feedback visual mejorado con animaciones y colores cuando hay un pack seleccionado:
    *   Borde y sombra especial cuando hay selección activa
    *   Animación pulse en botones cuando están listos para acción
    *   Gradiente de color en botón de progreso para mejor feedback visual
- [ ] **Executor:** Probar todas las funcionalidades en diferentes escenarios de uso.

**Nueva Funcionalidad: Minijuego "Cookie Catcher":**
- [ ] **Diseño Conceptual y UI:** Definir flujo, aspecto visual, mecánicas detalladas.
- [ ] **Selección Tecnológica:** Elegir librería/método de implementación.
- [ ] **Desarrollo del Núcleo del Juego:** Crear componente, lógica de caída, captura, puntuación.
- [ ] **Implementación de Recompensa:** Modificar `CartContext` y lógica de adición del premio.
- [ ] **Integración en la Web:** Añadir el juego al sitio.
- [ ] **Pruebas y Refinamiento:** Asegurar funcionalidad y diversión.

## Current Status / Progress Tracking

Se ha actualizado el componente MobileCartBar para que la barra inferior móvil muestre:
- Título del pack (personalizado o estándar)
- Progreso de unidades seleccionadas (ej: 2/6 uds.)
- Precio total
- Botón con texto y estado dinámico según el progreso del pack

Falta realizar pruebas visuales en móvil y validar la experiencia de usuario para asegurar que la información es clara y la interacción es fluida.

## Executor's Feedback or Assistance Requests

La lógica y el diseño ya reflejan fielmente la caja de resumen de pack de escritorio. Si se detecta algún problema visual o de usabilidad en móvil, se recomienda ajustar estilos o textos según feedback real de usuarios.

¿Deseas que realice pruebas visuales o tienes algún ajuste de copy/diseño antes de continuar?

## Lessons

- Es fundamental replicar la lógica de DesktopPackSummary para mantener coherencia UX entre escritorio y móvil.
- El botón debe ser claro y guiar al usuario en todo momento sobre el estado de su pack.