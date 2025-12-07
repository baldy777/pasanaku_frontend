# Pasanaku Web – Sistema de Gestión

Sistema web para administrar grupos de pasanaku, donde varias personas realizan aportes periódicos y el monto reunido se entrega a un integrante según turno o sorteo, hasta completar la lista de fichas y finalizar el ciclo.

# Nota

el proyecto tanto el frontend como el balckend funcionan de manera local por ende tal sistema no esta subido a un servidor u dominio.

Recordar iniciar el backend para aprovechar del frontend

# Tecnologías utilizadas

Frontend: React + TypeScript (Vite)

Backend: API REST (repositorio separado)

Autenticación y roles: Login con distintos niveles de acceso

# Características principales

- Creación y administración de grupos de pasanaku

- Registro y gestión de participantes

- Configuración de fichas, turnos y aportes

- Sistema de login con roles

- Listado y detalle de grupos

- Gestión de usuarios desde la vista administrativa

# Instalación y ejecución

1. Clonar el repositorio

En caso de no tener git instalado valla al siguiente enlace para us instalacion
-> https://git-scm.com/ luego ya puede clonarlo.

Por recomendacion personal, abrir el proyecto en visual studio code, seguir el siguiente enlace para su instalacion -> https://code.visualstudio.com/

con este comando lo puede llgar a clonar

git clone https://github.com/baldy777/pasanaku_frontend.git

2. ingresar a la carpeta del repositorio

cd pasanaku_frontend

este comando le permitira abrir el archivo con vs code

code .

3. Instalar dependencias

npm install

4. Ejecutar la aplicación

npm run setup

## nota: encaso de clonar una version anterior, realizar el comando:

git pull

esto actualizara todo el sistema.

La aplicación se ejecutará en un entorno de desarrollo local proporcionado por Vite.

# Roles y autenticación

El sistema incluye:

Pantalla de inicio de sesión

Autenticación basada en API REST

Backend

Este proyecto utiliza un backend separado basado en API REST.
