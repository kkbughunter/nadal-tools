# nadal-tools

Vite + React app configured with Tailwind CSS v4 and GitHub Pages deployment.

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## GitHub Pages deployment

This repo includes `.github/workflows/deploy.yml` to deploy on every push to `main`.

1. Push this repository to GitHub.
2. In GitHub, open `Settings > Pages`.
3. Under `Build and deployment`, set `Source` to `GitHub Actions`.
4. Push to `main` (or run the workflow manually from the Actions tab).

Vite `base` is set dynamically from `GITHUB_REPOSITORY`, so production assets resolve correctly for repository pages like `https://<user>.github.io/<repo>/`.
