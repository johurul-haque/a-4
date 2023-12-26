<h1 align="center">
  A-3
</h1>

<p align="center">
 REST API for LMS <i>(Learning Management System)</i> application.
</p>

## Tech stack
- **TypeScript** - Static type checking
- **Express.js** - Route handling and middleware
- **MongoDB** - Storing and managing data
- **Mongoose** - Data modeling and query building
- **Zod** - Validating and parsing incoming and inferring types

## Getting started
Create a `.env` file at the root of your project and add the following variables

```ini
# .env
MONGODB_URI=mongodb+srv://...
PORT=8080 # optional
```

```bash
# install dependencies
npm install

# dev server
npm run dev

# build for production
npm run build

# running in production
npm run start
```

## App structure

```bash
├── src
│   ├── config
│       └── index.ts # Default exports environment variables
│   ├── helpers
│       └── handle-errors.ts # Models all error types in desired type
│   ├── modules
│       ├── course
│       ├── category
│       └── reviews
│   ├── interface
│   ├── middlewares
│   ├── utils
│   ├── app.ts # Default exports the `app` from express for routing.  
│   ├── main.ts # Main entry point for the application.
│   └── routes.ts # Routes for the application 
├── .env
├── .gitignore
├── package.json
├── vercel.json
└── tsconfig.json
```
