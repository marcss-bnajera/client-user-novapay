# Client User - Portal de Clientes Web

Aplicacion web para el **portal de clientes** de NovaPay. Permite a los usuarios consultar cuentas, realizar transferencias, depositos, ver productos, gestionar favoritos y mas.

---

## Tecnologias

| Tecnologia | Uso |
|---|---|
| React 18 | UI library |
| Vite 8 | Build tool y dev server |
| Tailwind CSS 4 | Estilos utilitarios |
| Zustand | State management |
| React Router 7 | Enrutamiento |
| Axios | Peticiones HTTP |
| React Hot Toast | Notificaciones |
| Lucide React | Iconos |
| Heroicons | Iconos |

---

## Estructura

```
client-user-novapay/
├── src/
│   ├── app/               # Configuracion de la app (router, layout)
│   ├── assets/            # Imagenes y recursos estaticos
│   ├── features/          # Modulos por funcionalidad
│   ├── shared/            # Componentes, hooks, servicios compartidos
│   └── styles/            # Estilos globales
├── public/                # Archivos publicos
├── index.html             # Punto de entrada HTML
├── vite.config.js         # Configuracion de Vite
├── eslint.config.js       # Configuracion ESLint
├── Dockerfile
└── package.json
```

---

## Puerto

El servidor de desarrollo corre en el puerto **5174** por defecto (configurado en `vite.config.js`).

---

## Variables de entorno (.env)

Copia el ejemplo y ajusta si es necesario:

```bash
cp .env.example .env
```

```
VITE_AUTH_URL=http://localhost:3000
VITE_USER_URL=http://localhost:3002/NovaPay/v1
```

| Variable | Descripcion |
|---|---|
| `VITE_AUTH_URL` | URL base del auth-service para login/registro |
| `VITE_USER_URL` | URL base de la API de clientes |

---

## Ejecucion local (sin Docker)

```bash
npm install
npm run dev
```

La app estara disponible en `http://localhost:5174`.

---

## Ejecucion con Docker

Desde la carpeta raiz de NovaPay:

```bash
docker-compose up --build client-user
```

---

## Scripts disponibles

| Comando | Descripcion |
|---|---|
| `npm run dev` | Iniciar servidor de desarrollo con hot reload |
| `npm run build` | Compilar para produccion |
| `npm run lint` | Ejecutar ESLint |
| `npm run preview` | Vista previa del build de produccion |
