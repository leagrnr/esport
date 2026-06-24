# React + Vite

## Tester la PWA

Le service worker ne fonctionne pas en mode `dev`. Il faut builder puis prévisualiser :

```bash
npm run build
npx vite preview --host
```

### Sur ordinateur (Chrome)

1. Ouvre `http://localhost:4173`
2. Ouvre les DevTools (`F12`)
3. Onglet **Application > Manifest** — vérifie le nom, l'icône, le display
4. Onglet **Application > Service Workers** — vérifie que le SW est actif
5. Une icône d'installation apparaît dans la barre d'adresse si tout est OK

### Sur mobile

1. Connecte ton mobile au même réseau Wi-Fi
2. Trouve ton IP locale avec `ipconfig` (ligne **IPv4** sous Wi-Fi)
3. Ouvre `http://192.168.x.x:4173` dans Chrome mobile
4. Chrome propose "Ajouter à l'écran d'accueil" si le manifest est valide

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
