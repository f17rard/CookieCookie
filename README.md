# CookieCookie

Primera version del panel de ventas para un negocio de galletas. La tecnologia objetivo del proyecto es un frontend con React y TypeScript y un backend con Java y Spring Boot, conectado a PostgreSQL en Supabase. Se planea publicar el frontend en Vercel. El frontend guarda las ventas en el almacenamiento local del navegador. Ya existe la estructura inicial del backend, pero aun no tiene endpoints ni esta conectado a la base de datos.

## Tecnologias y despliegue

- Frontend: React y TypeScript, con Vite para desarrollo y compilacion.
- Backend: Java y Spring Boot (estructura inicial en `backend/`).
- Base de datos planeada: PostgreSQL en Supabase.
- Despliegue planeado: Vercel para publicar la pagina.
- Estado actual: el frontend guarda las ventas en `localStorage`; el backend aun no ofrece endpoints ni se conecta a Supabase.
- Contexto de aprendizaje: el propietario del proyecto no tiene experiencia previa con React ni Java y quiere aprender estas tecnologias construyendo el proyecto. Explicar los cambios y las decisiones tecnicas de forma clara y gradual.

## Requisitos

- Node.js y npm para el frontend.
- JDK 17 o superior para el backend.

## Empezar

1. Instala las dependencias con `npm install`.
2. Inicia el servidor local con `npm run dev`.
3. Abre en el navegador la direccion que muestra Vite (normalmente `http://localhost:5173`).

Para comprobar que el proyecto compila para produccion, ejecuta `npm run build`.

Para ejecutar las pruebas iniciales del backend, abre una terminal en `backend/` y ejecuta `.\mvnw.cmd test`. El Maven Wrapper descarga y ejecuta Maven para este proyecto, por lo que no necesitas instalar Maven globalmente. Las pruebas usan H2 en memoria y no requieren una cuenta de Supabase.

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
- `backend/`: proyecto inicial de Spring Boot; falta implementar la API de ventas y del registro semanal de produccion, y conectarla a Supabase.
