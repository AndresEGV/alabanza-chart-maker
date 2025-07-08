# 🎵 Alabanza Chart Maker

<div align="center">
  <img src="public/logo.svg" alt="Alabanza Chart Maker Logo" width="120" height="120">
  
  <h3>Crea y personaliza guías de alabanza profesionales</h3>
  
  <p>
    <a href="#características">Características</a> •
    <a href="#instalación">Instalación</a> •
    <a href="#uso">Uso</a> •
    <a href="#tecnologías">Tecnologías</a> •
    <a href="#contribuir">Contribuir</a>
  </p>

  ![License](https://img.shields.io/badge/license-MIT-blue.svg)
  ![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
  ![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)
</div>

---

## 📖 Descripción

**Alabanza Chart Maker** es una aplicación web moderna diseñada para músicos y líderes de alabanza que necesitan crear guías de acordes profesionales de manera rápida y eficiente. Con una interfaz intuitiva y características avanzadas, transforma la manera en que preparas tus sesiones de alabanza.

## ✨ Características

### 🎸 Editor de Canciones
- **Editor intuitivo** con pestañas organizadas
- **Vista previa en tiempo real** de tu guía
- **Múltiples diseños** (una columna, dos columnas)
- **Transposición automática** de acordes

### 📚 Biblioteca Personal
- **Guardado automático** en la nube con Firebase
- **Sistema de favoritos** para acceso rápido
- **Búsqueda y filtros** avanzados
- **Organización por fecha** de modificación

### 🎨 Personalización
- **Tema claro/oscuro** adaptativo
- **Colores por sección** (Intro, Verso, Coro, etc.)
- **Indicadores de tempo** visual
- **Notas y anotaciones** personalizadas

### 👥 Colaboración
- **Autenticación segura** con Google
- **Perfil de usuario** personalizable
- **Acceso desde cualquier dispositivo**

## 🚀 Instalación

### Prerrequisitos
- Node.js 18+ y npm
- Cuenta de Firebase (para autenticación y base de datos)

### Pasos

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/alabanza-chart-maker.git
   cd alabanza-chart-maker
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Configura las variables de entorno**
   
   Crea un archivo `.env` en la raíz del proyecto:
   ```env
   VITE_FIREBASE_API_KEY=tu-api-key
   VITE_FIREBASE_AUTH_DOMAIN=tu-auth-domain
   VITE_FIREBASE_PROJECT_ID=tu-project-id
   VITE_FIREBASE_STORAGE_BUCKET=tu-storage-bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=tu-sender-id
   VITE_FIREBASE_APP_ID=tu-app-id
   ```

4. **Inicia el servidor de desarrollo**
   ```bash
   npm run dev
   ```

5. **Abre tu navegador**
   ```
   http://localhost:5173
   ```

## 📋 Uso

### Crear una Nueva Guía

1. Haz clic en **"Nueva Guía"**
2. Completa la información básica (título, artista, tono, tempo)
3. Agrega las secciones de tu canción (Intro, Verso, Coro, etc.)
4. Escribe las letras y acordes en el formato:
   ```
   C       G       Am      F
   Letra de la canción aquí
   ```
5. Define la secuencia (ej: I V C V C O)
6. Selecciona el diseño de página
7. Haz clic en **"Generar y Guardar Guía"**

### Gestionar tu Biblioteca

- **Buscar**: Usa la barra de búsqueda para encontrar canciones
- **Favoritos**: Marca tus canciones favoritas con ⭐
- **Eliminar**: Usa el botón 🗑️ para eliminar canciones
- **Editar**: Haz clic en cualquier canción para editarla

## 🛠️ Tecnologías

<table>
  <tr>
    <td align="center">
      <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg" width="40" height="40" alt="React"/>
      <br>React 18
    </td>
    <td align="center">
      <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg" width="40" height="40" alt="TypeScript"/>
      <br>TypeScript
    </td>
    <td align="center">
      <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/tailwindcss/tailwindcss-original.svg" width="40" height="40" alt="Tailwind"/>
      <br>Tailwind CSS
    </td>
    <td align="center">
      <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/firebase/firebase-plain.svg" width="40" height="40" alt="Firebase"/>
      <br>Firebase
    </td>
  </tr>
</table>

### Stack Completo

- **Frontend**: React 18 + TypeScript
- **Estilos**: Tailwind CSS + shadcn/ui
- **Estado**: Zustand
- **Base de datos**: Firebase Firestore
- **Autenticación**: Firebase Auth
- **Build**: Vite
- **Iconos**: Lucide React

## 📁 Estructura del Proyecto

```
alabanza-chart-maker/
├── src/
│   ├── components/       # Componentes React
│   │   ├── ui/          # Componentes de shadcn/ui
│   │   ├── auth/        # Componentes de autenticación
│   │   └── song-form/   # Componentes del formulario
│   ├── stores/          # Estados globales (Zustand)
│   ├── hooks/           # Custom hooks
│   ├── utils/           # Funciones utilitarias
│   ├── types/           # Tipos TypeScript
│   └── config/          # Configuración (Firebase)
├── public/              # Archivos estáticos
└── dist/               # Build de producción
```

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor, sigue estos pasos:

1. Fork el proyecto
2. Crea tu rama de características (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Guía de Estilo

- Usa TypeScript para todo el código nuevo
- Sigue las convenciones de ESLint configuradas
- Escribe tests para nuevas características
- Actualiza la documentación según sea necesario

## 🐛 Reportar Problemas

Si encuentras un bug o tienes una sugerencia, por favor abre un [issue](https://github.com/tu-usuario/alabanza-chart-maker/issues) con:

- Descripción clara del problema
- Pasos para reproducirlo
- Screenshots si es aplicable
- Tu entorno (navegador, OS)

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - mira el archivo [LICENSE](LICENSE) para más detalles.

## 👏 Agradecimientos

- [shadcn/ui](https://ui.shadcn.com/) por los componentes hermosos
- [Lucide](https://lucide.dev/) por los iconos
- [Firebase](https://firebase.google.com/) por el backend
- La comunidad de músicos que inspiró este proyecto

---

<div align="center">
  <p>Hecho con ❤️ para la comunidad de alabanza</p>
  <p>
    <a href="https://github.com/tu-usuario/alabanza-chart-maker">GitHub</a> •
    <a href="https://tu-sitio-web.com">Website</a> •
    <a href="mailto:tu-email@ejemplo.com">Contacto</a>
  </p>
</div>