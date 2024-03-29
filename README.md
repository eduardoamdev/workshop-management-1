# Workshop Management 1

<img src="./hbs.node.express.png" alt="handlebars-node-express" />

## Descripción:

Este sitio web fue mi primer proyecto desarrollado de manera íntegra con idea de ser desplegado en un servidor local y se trata de una aplicación de gestión en la que los trabajadores de un taller pueden introducir en qué equipos están trabajando, buscar órdenes de trabajo, tareas, actualizar y borrar información.

Fue creado para ser utilizado en red local por la Agrupación De Apoyo Logístico número 41 de Zaragoza.

## Tecnologías empleadas:

### NodeJS:

El lenguaje de programación empleado para el servidor es NodeJS que no es más que un entorno de ejecución para Javascript.

### Express:

Para levantar el servidor utilizamos Express. Este paquete de software nos permite levantar un servidor con muy pocas líneas de código y nos ahorra tener que utilizar la librería http de NodeJS, con la cual el trabajo sería bastante más complejo.

### MongoDB:

Como base de datos empleamos MongoDB. Esta base de datos va a ser instalada en el mismo servidor que el resto del proyecto.

### Mongoose:

El software mediante el cual nos comunicamos con la base de datos es Mongoose. Este conjunto de librerías nos ayuda a hacer peticiones a la base de datos por mediación de los modelos.

### Dotenv:

Para crear y gestionar variables de entorno empleamos Dotenv. Con este módulo podremos, mediante la creación de un archivo .env, generar variables de entorno que se encontrarán en el global scope de nuestro proyecto.

### Handlebars:

Dentro de este proyecto tendrá una importancia vital Handlebars. Este módulo es un motor de renderizado de plantillas que nos va a permitir realizar los renderizados desde nuestro back-end.

## Cómo arrancar este proyecto:

Para poner en marcha el proyecto debemos disponer de una base de datos local o remota cuya conexión pasar como argumento del método connect de mongoose y definir el puerto en el que vamos a arrancar la aplicación.

Tanto la conexión con la base de datos como el puerto los podemos guardar en un archivo .env cuyo contenido requeriremos cuando lo necesitemos.

## ¿Qué me ha aportado este proyecto?

Tengo bastante cariño a este proyecto, ya que fue el primer proyecto que desarrollé para ser utilizado directamente por terceras personas. La aplicación en sí es funcional, ya que me he centrado en que todo funcione de manera robusta, y en lo que respecta a los estilos, he tratado de que fueran conrrectos y contribuyeran a una crear una buena experiencia de usuario.

También tengo de decir que esta aplicación fue mi primera experiencia montando un servidor en Rapsberry Py y trabajando con Ubuntu server y el protocolo SSH.

Por todo ello considero que esto considero que esta aplicación fue mi despegue como desarrollador, ya que me hizo solucionar múltiples problemas, adaptarme a las necesidades del cliente y aprender a montar servidores lo cual era algo completamente nuevo para mí.
