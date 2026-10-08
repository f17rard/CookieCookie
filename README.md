# CookieCookie

Primera version del panel de ventas para un negocio de galletas. La interfaz usa React y TypeScript; por ahora guarda las ventas en el almacenamiento local del navegador. Todavia no hay un backend ni una base de datos conectados.

## Requisitos

- Node.js y npm

## Empezar

1. Instala las dependencias con `npm install`.
2. Inicia el servidor local con `npm run dev`.
3. Abre en el navegador la direccion que muestra Vite (normalmente `http://localhost:5173`).

Para comprobar que el proyecto compila para produccion, ejecuta `npm run build`.

## Esta version

- El precio se fija en $1.50 por galleta.
- El resumen muestra galletas vendidas, total de ventas, dinero cobrado y saldo pendiente.
- Cada venta registra nombre, cantidad, metodo de pago, monto recibido y fecha.
- Las ventas sobreviven a una recarga en el mismo navegador mediante `localStorage`; todavia no se comparten entre dispositivos ni usuarios.
- La ganancia real no se calcula porque aun no se ha definido el costo de producir cada galleta.

## Estructura

- `src/App.tsx`: pantalla y comportamiento de registro de ventas.
- `src/styles.css`: estilos adaptables a pantallas pequeñas.
- `src/main.tsx`: punto de entrada de React.
