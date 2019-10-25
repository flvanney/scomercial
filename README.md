Sistema Comercial desarollado por estudiantes de la UNNOBA.
Descuentos por lista: ¡Valor minimo, imposible de bajar!
Stock:
Articulo: COD, nombre, familia, cat, precios x, ValorMinimo.
Cliente: cuando el cliente va a pagar, verificiar si el cliente esta activo y si alcanza el monto, 
en caso contrario verificar limite de credito y notas de credito.
# Sistema comercial :bank:

## Como hacer que funcione

1. Instalar [nodeJS](https://nodejs.org/es/).
2. Desde una consola, pararse en la carpeta del proyecto y ejecutar `npm update` para descargar todos los módulos y dependencias.
3. Instalar [PostgreSQL](https://www.postgresql.org/) e importar la base de datos que está en la carpeta raiz. (nombre: scontable, usuario: postgres, password: root).
4. Terminado eso, abrir dos consolas y parados en la carpeta raiz del proyecto ejecutar `ng serve` y `node server.js` para levantar la aplicación en Angular y el backend. Acceder mediante localhost:4200.