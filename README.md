# Pasanaku Web – Sistema de Gestión

Sistema web para administrar grupos de pasanaku, donde varias personas realizan aportes periódicos y el monto reunido se entrega a un integrante según turno o sorteo, hasta completar la lista de fichas y finalizar el ciclo.

1. Tecnologías utilizadas

Frontend: React + TypeScript (Vite)

Backend: API REST (repositorio separado)

Autenticación y roles: Login con distintos niveles de acceso

2. Características principales

Creación y administración de grupos de pasanaku

Registro y gestión de participantes

Configuración de fichas, turnos y aportes

Asignación del ganador por turno o sorteo

Sistema de login con roles

Listado y detalle de grupos

Gestión de usuarios desde la vista administrativa

3. Instalación y ejecución

I. Clonar el repositorio git clone https://tu-repositorio.git cd PASANAKUFRONTEND

II. Instalar dependencias
npm install

III. Ejecutar la aplicación
npm run dev

La aplicación se ejecutará en un entorno de desarrollo local proporcionado por Vite.

4. Roles y autenticación

El sistema incluye:

Pantalla de inicio de sesión

Autenticación basada en API REST

5. Estructura del proyecto
   /src
   ├── assets/  
    │
   ├── components/  
    │ ├── componentsUsuario/
   │ │ └── ModalUsuario.tsx
   │ └── Sidebar.tsx
   │
   ├── pages/  
    │ ├── common/
   │ │ ├── homeDashboard.tsx
   │ │ └── LadingPage.tsx
   │ │
   │ ├── grupos/
   │ │ ├── GrupoDetalle.tsx
   │ │ └── MisPasanakus.tsx
   │ │
   │ └── usuarios/
   │ ├── login.tsx
   │ ├── RegistroUsuarios.tsx
   │ └── VistaUsuarios.tsx
   │
   ├── App.tsx  
    ├── main.tsx  
    │
   ├── index.css  
    │
   ├── vite.config.ts  
    └── tsconfig\*.json

Backend

Este proyecto utiliza un backend separado basado en API REST.
