# CookieCookie

Primera version del panel de ventas para un negocio de galletas. La tecnologia objetivo del proyecto es un frontend con React y TypeScript, un backend con Java y una base de datos probablemente creada con Supabase. Se planea publicar la pagina en Vercel. Por ahora, solo esta implementado el frontend y las ventas se guardan en el almacenamiento local del navegador; el backend y la base de datos aun no estan conectados.

## Tecnologias y despliegue

- Frontend: React y TypeScript, con Vite para desarrollo y compilacion.
- Backend planeado: Java.
- Base de datos planeada: probablemente Supabase.
- Despliegue planeado: Vercel para publicar la pagina.
- Estado actual: no hay backend ni base de datos conectados; las ventas se guardan en `localStorage`.
- Contexto de aprendizaje: el propietario del proyecto no tiene experiencia previa con React ni Java y quiere aprender estas tecnologias construyendo el proyecto. Explicar los cambios y las decisiones tecnicas de forma clara y gradual.

## Requisitos

- Node.js y npm

## Empezar

1. Instala las dependencias con `npm install`.
2. Inicia el servidor local con `npm run dev`.
3. Abre en el navegador la direccion que muestra Vite (normalmente `http://localhost:5173`).

Para comprobar que el proyecto compila para produccion, ejecuta `npm run build`.

## Esta version

- El precio se fija en $1.50 por galleta.
- El costo de producción es de $0.42 por galleta.
- El resumen muestra galletas vendidas, total de ventas, dinero cobrado y saldo pendiente.
- Cada venta registra nombre, cantidad, metodo de pago, monto recibido y fecha.
- Las ventas sobreviven a una recarga en el mismo navegador mediante `localStorage`; todavia no se comparten entre dispositivos ni usuarios.
- La ganancia real aun no se calcula en el panel; el costo de produccion ya esta definido en $0.42 por galleta.

## Estructura

- `src/App.tsx`: pantalla y comportamiento de registro de ventas.
- `src/styles.css`: estilos adaptables a pantallas pequeñas.
- `src/main.tsx`: punto de entrada de React.
