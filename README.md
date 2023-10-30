
# READCONNECT API

## Backend

Está desarrollado con Nest JS, GraphQL y MySQL. Se utilizó Docker para el desarrollo de la aplicación.

## Instrucciones:

1. **Clonar Proyecto**
2. **Instalar Dependencias:** Ejecutar `npm install` o `yarn install` según el entorno de desarrollo.
3. **Configurar Variables de Entorno:** Copiar el archivo `.env.template` y renombrarlo a `.env`.
4. **Editar Variables:** Modificar las variables de entorno en el archivo `.env` según las necesidades.
5. **Levantar la Base de Datos:** Ejecutar el comando `docker-compose up -d`.
6. **Iniciar el Proyecto:** Usar `npm run start:dev` o `yarn start:dev` según el entorno de desarrollo.
7. Visitar el sitio: Ingresar al link: `localhost:3000/graphql`.
8. Insertar los datos en la base de datos como seed: Para generar el seed, en Apollo ejecutar la función `executedSeed` en los mutations. Si sale todo bien, debe aparecer la respuesta `true`.
9. Los datos están en la carpeta `/src/seeds/data`.
