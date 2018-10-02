# Arkon Lab Website

Requires Node >= `6` for development.

Originally built with Node `v8.11.3` and NPM `v5.6.0`.

## Single build
Create a build which will output to the `dist` directory.
```
npm run build
```

Copy all files from `dist/` and `php/` to the web root.

## First time setup
```
npm install
```

## Start the dev web server
This web server will watch files and rebuild as they change.
You will have to manually refresh the page as you make changes, but
trust me that's better than having a refresh every time you save your work.
This webserver will by default run on `http://localhost:8080`.
```
npm start
```
