# Introducción

**ComuniApp** es una aplicación móvil híbrida desarrollada para transformar y digitalizar la gestión de servicios comunitarios locales, ofreciendo a los ciudadanos una herramienta directa para involucrarse activamente en su entorno urbano y social.

La plataforma integra funcionalidades modernas como:

- Reporte de incidencias en tiempo real
- Geolocalización GPS precisa
- Visualización interactiva en mapas con marcadores
- Directorio de negocios locales y puntos de interés
- Registro y evidencia fotográfica mediante la cámara del dispositivo
- Formularios validados para integridad de datos
- Autenticación y bases de datos seguras en la nube
- Navegación fluida y diseño responsivo

El objetivo principal de la aplicación es centralizar las necesidades de la comunidad en un único ecosistema digital, permitiendo que los usuarios documenten incidencias, descubran comercios locales y mantengan una comunicación estructurada basada en su ubicación geográfica.

---

# Propuesta de Valor

**ComuniApp** redefine la forma en que los ciudadanos interactúan con su comunidad mediante la convergencia de **geolocalización precisa** y un **sistema de reportes en tiempo real**, permitiendo una visibilidad inmediata de las necesidades locales. Gracias a su capacidad de **registro multimedia y autenticación segura**, los usuarios disfrutan de una plataforma confiable bajo una **arquitectura móvil** moderna que garantiza fluidez, escalabilidad y una experiencia de usuario adecuada a través de una **interfaz intuitiva y componentes reutilizables**.

---

# Pitch Visual

<br />

<h2>Vista Principal: Feed de Avisos y Reportes</h2>
<p>
  El núcleo de <strong>ComuniApp</strong> es mantener a la comunidad informada con el mínimo esfuerzo. A continuación, se detalla el flujo integrado en la pantalla principal:
</p>

<h3>1. Listado Dinámico y Contexto</h3>
<p>
  El usuario interactúa con un feed actualizado en tiempo real que lista los avisos y reportes generados por la comunidad. Cada tarjeta informativa presenta los detalles esenciales de la incidencia o anuncio, priorizando la claridad visual.
</p>

<h3>2. Navegación Intuitiva</h3>
<p>
  Mediante <b>React Navigation</b>, la aplicación ofrece transiciones fluidas entre el listado general y los detalles específicos de cada reporte, asegurando que la información sea accesible con un solo toque.
</p>

<br />

<h2>Vista Mapa: Exploración y Marcadores Interactivos</h2>
<p>
  La sección de mapas actúa como el motor visual geográfico de la plataforma, permitiendo a los usuarios entender la distribución de las incidencias y negocios en su área.
</p>

<h3>1. Geolocalización (GPS) Activa</h3>
<p>
  La interfaz utiliza el GPS del dispositivo para centrar al usuario en su entorno actual, facilitando el descubrimiento de puntos de interés y reportes bajo la premisa de "Cerca de mí".
</p>

<h3>2. Marcadores Personalizados</h3>
<p>
  Los resultados se despliegan sobre un mapa interactivo mediante marcadores categorizados. Esta arquitectura permite al usuario evaluar rápidamente la densidad de reportes o la ubicación de comercios locales antes de profundizar en los detalles.
</p>

<br />

<h2>Formularios: Registro de Incidencias con Evidencia</h2>
<p>
  La herramienta de creación de reportes está diseñada para ser robusta y a prueba de errores, garantizando la calidad de la información comunitaria.
</p>

<h3>1. Captura Multimedia Integrada</h3>
<p>
  Uso directo de la <b>cámara</b> del dispositivo para adjuntar fotografías al instante, brindando evidencia visual irrefutable para cada incidencia reportada (baches, luminarias fundidas, etc.).
</p>

<h3>2. Validación Rigurosa de Datos</h3>
<p>
  Interfaces de entrada (inputs) con sistemas de validación que aseguran que ningún reporte sea enviado incompleto. Esto mantiene la base de datos limpia y funcional para todos los usuarios.
</p>

<br />

<h2>Vista Perfil: Identidad y Seguridad</h2>
<p>
  La sección de usuario garantiza un ecosistema confiable y personalizado.
</p>

<h3>1. Autenticación Segura</h3>
<p>
  Integración total con <b>Firebase Authentication</b> para gestionar el acceso, garantizando que cada reporte provenga de un miembro real y registrado de la comunidad.
</p>

<br />

---

# Arquitectura Funcional del Sistema

<br />

<p>
  La arquitectura de <strong>ComuniApp</strong> está diseñada bajo un modelo de <b>Capas de Servicios basados en la Nube</b>. Este enfoque garantiza la fluidez de la interfaz de usuario en dispositivos móviles mientras se maneja la sincronización de datos en tiempo real.
</p>

<h3>1. Adquisición y Validado de Eventos (Device Layer)</h3>
<p>
  Los sensores nativos (GPS y Cámara) capturan datos de entrada. El sistema gestiona permisos localmente y utiliza formularios validados para procesar la información antes de cualquier petición de red, minimizando errores.
</p>

<h3>2. Gestión de Identidad (Security Layer)</h3>
<p>
  Las credenciales y sesiones de los usuarios son administradas por <b>Firebase Authentication</b>, emitiendo tokens seguros que autorizan las transacciones de lectura y escritura dentro de la aplicación.
</p>

<h3>3. Persistencia Reactiva (Data Layer)</h3>
<p>
  La información de reportes y marcadores se consolida en <b>Firestore</b>. La base de datos no relacional dispara actualizaciones reactivas hacia la aplicación, manteniendo el feed de avisos y el mapa sincronizados de forma instantánea.
</p>

<h3>4. Renderizado y Navegación (Application Layer)</h3>
<p>
  Los componentes reutilizables de <b>React Native</b> consumen los datos de Firestore y los presentan mediante un diseño responsivo. <b>React Navigation</b> orquesta el flujo entre pantallas conservando el estado y el contexto geográfico.
</p>

<br />

---

# Características y Capacidades

## Sistema de Geolocalización GPS

### Capacidades

- Obtención de ubicación del usuario en tiempo real.
- Asignación de coordenadas a nuevas incidencias.
- Visualización de mapas interactivos.

### Funcionalidades técnicas

- Integración nativa con servicios de localización de Expo.
- Manejo dinámico de permisos de GPS en Android/iOS.
- Renderizado de marcadores espaciales.

## Sistema de Reportes y Formularios

### Capacidades

- Creación estructurada de avisos comunitarios.
- Adjunte de evidencia visual.
- Prevención de envíos erróneos.

### Funcionalidades técnicas

- Controladores de estado para inputs.
- Validaciones en tiempo real (RegEx, campos requeridos).
- Conexión estructurada con colecciones de base de datos.

## Integración con Cámara

### Capacidades

- Captura de fotografías desde la aplicación.
- Registro visual de incidencias en el entorno.

### Funcionalidades técnicas

- Acceso nativo al hardware de la cámara mediante Expo.
- Manejo de permisos multimedia.
- Optimización de la imagen para su subida a la nube.

## Autenticación y Seguridad

### Capacidades

- Registro seguro de ciudadanos.
- Inicio de sesión y protección de rutas.

### Funcionalidades técnicas

- Implementación de Firebase Authentication.
- Persistencia de sesión en el dispositivo.
- Vinculación de UID de usuario con los reportes generados.

---

# Stack Tecnológico

## Tecnologías Principales

<br />

<div align="center">
  <table style="width: 100%; table-layout: fixed;">
    <thead>
      <tr>
        <th align="left" style="width: 25%;">Categoría</th>
        <th align="left" style="width: 30%;">Tecnología</th>
        <th align="left" style="width: 45%;">Propósito</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><b>Framework Mobile</b></td>
        <td>React Native</td>
        <td>Desarrollo móvil híbrido multiplataforma (iOS/Android)</td>
      </tr>
      <tr>
        <td><b>Herramientas / SDK</b></td>
        <td>Expo</td>
        <td>Simplificación del entorno de desarrollo y configuración rápida nativa</td>
      </tr>
      <tr>
        <td><b>Navegación</b></td>
        <td>React Navigation</td>
        <td>Routing fluido y gestión del stack de pantallas</td>
      </tr>
      <tr>
        <td><b>Backend Services</b></td>
        <td>Firebase</td>
        <td>Plataforma integral (BaaS) para ecosistema Cloud</td>
      </tr>
      <tr>
        <td><b>Base de Datos</b></td>
        <td>Firestore</td>
        <td>Almacenamiento NoSQL en tiempo real para reportes</td>
      </tr>
      <tr>
        <td><b>Autenticación</b></td>
        <td>Firebase Auth</td>
        <td>Gestión de identidades y control de acceso seguro</td>
      </tr>
      <tr>
        <td><b>Control de Versiones</b></td>
        <td>Git & GitHub</td>
        <td>Gestión del código fuente, ramas y despliegue del repositorio</td>
      </tr>
    </tbody>
  </table>
</div>

<br />

---

# Justificación Tecnológica

## React Native + Expo

Seleccionados por:

- Desarrollo cross-platform eficiente con una base de código única.
- Renderizado de componentes nativos para UI/UX de alta calidad.
- Ecosistema maduro de Expo para acceso rápido a GPS y Cámara.
- Facilidad para generar APKs funcionales a través de Expo Go.

---

## Firebase & Firestore

Elegidos por:

- Sincronización de datos en tiempo real esencial para feeds dinámicos.
- Solución "todo en uno" (Auth, Storage, Database) sin necesidad de gestionar servidores propios.
- Alta escalabilidad y velocidad de lectura/escritura de incidencias.

---

# Especificaciones Técnicas

# Requisitos del Sistema

<br />

<div align="center">
  <table style="width: 100%; table-layout: fixed;">
    <thead>
      <tr>
        <th align="left" style="width: 40%;">Requisito</th>
        <th align="left" style="width: 60%;">Especificación</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><b>Sistema Operativo</b></td>
        <td>Android / iOS (Ejecutable nativo vía Expo)</td>
      </tr>
      <tr>
        <td><b>Entorno de Ejecución</b></td>
        <td>Expo Go (para pruebas) o instalación APK</td>
      </tr>
      <tr>
        <td><b>GPS</b></td>
        <td>Requerido (Servicios de ubicación activos para el Mapa)</td>
      </tr>
      <tr>
        <td><b>Cámara</b></td>
        <td>Requerida (Para levantar reportes fotográficos)</td>
      </tr>
      <tr>
        <td><b>Conectividad</b></td>
        <td>Internet (Requerido para conexión a Firebase)</td>
      </tr>
      <tr>
        <td><b>Permisos del Sistema</b></td>
        <td>Cámara y Ubicación (Foreground)</td>
      </tr>
    </tbody>
  </table>
</div>

<br />

---

# Integraciones de Hardware

## GPS

Utilizado para:

- Detección precisa del lugar de la incidencia comunitaria.
- Centrado automático del mapa interactivo.
- Cálculo de puntos de interés cercanos.

---

## Cámara

Utilizada para:

- Captura de evidencia visual en tiempo real.
- Validación contextual de los avisos comunitarios generados.

---

# Estructura General del Proyecto
```bash
ComuniApp/
├── assets/                    # Recursos estáticos (imágenes, iconos, splash screen)
├── src/                       # Código fuente principal de la aplicación
│   ├── components/            # Componentes de UI reutilizables (Botones, Tarjetas, Inputs)
│   ├── screens/               # Vistas principales (Main, Map, Report Form, Auth)
│   ├── navigation/            # Configuración de React Navigation (Stacks, Tabs)
│   ├── services/              # Lógica de conexión y configuración de Firebase/Firestore
│   ├── utils/                 # Funciones auxiliares, validadores y helpers
│   └── styles/                # Definición de temas y diseño responsivo global
├── app.json                   # Configuración nativa y empaquetado de Expo
├── package.json               # Dependencias, scripts de ejecución (Expo, React Native)
└── README.md                  # Documentación del proyecto
```
---
# Instalación y Uso
Sigue estos pasos para configurar el entorno de desarrollo y ejecutar la aplicación localmente.

### 1. Prerrequisitos
Es necesario contar con las siguientes herramientas:

* Node.js (Versión LTS recomendada).
* Git instalado en tu sistema.
* Expo Go instalado en un dispositivo móvil Android/iOS.
* Proyecto configurado en Firebase Console (Firestore y Auth habilitados).

### 2. Clonación e Instalación

```bash
# Clonar el repositorio
git clone [https://github.com/tu-usuario/ComuniApp.git](https://github.com/tu-usuario/ComuniApp.git)

# Acceder al directorio
cd ComuniApp

# Instalar dependencias
npm install
```

### 3. Configuración de Entorno
Configura las credenciales de Firebase en tu entorno local. Debes inicializar tu objeto de configuración de Firebase con las siguientes variables generadas desde tu consola de Firebase:

* `apiKey`
* `authDomain`
* `projectId`
* `storageBucket`
* `messagingSenderId`
* `appId`

### 4. Despliegue y Ejecución
Inicia el servidor de desarrollo de Expo:

```bash
npx expo start
```
---