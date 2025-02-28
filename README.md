# Splotify 🎵

Splotify is **yet another [Spotify](https://open.spotify.com/) clone** - because the world clearly needed one more! 😆

But mostly, it's a **side project** built to **<span style="color:#32CD32;">experiment**</span> with modern frontend best practices while integrating the [Spotify Web API](https://developer.spotify.com/documentation/web-api).

🚀 The goal is to build a **clean**, **performant**, and **accessible** UI while focusing on custom component design and code maintainability.

## Focus Areas

- Clean Code
- Sustainability ([Green Software Foundation Patterns](https://patterns.greensoftware.foundation/))
- Custom UI & Best Component Design Practices
- Performance ([React Query](https://tanstack.com/query/latest/docs/framework/react/overview), [Turbopack](https://nextjs.org/docs/app/api-reference/turbopack), lazy loading)
- Accessibility ([WCAG](https://www.wcag.com/)-compliant UI)

## Planned Features

- Spotify API integration (playlists, artists, recommendations, ...)
- Custom UI components (with [Storybook](https://storybook.js.org/))
- Responsive design for desktop & mobile
- Dark mode & energy-efficient UI
- Testing with [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/), and [Playwright](https://playwright.dev/)

## Git Commit Convention

This project loosely follows the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) format for commit messages.
Prefixes will be used for clarity but not strictly enforced.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

### VS Code Recommended Settings

For best development experience, use the `.vscode/settings.json` included in this repo.  
It enforces consistent formatting and linting with Prettier and ESLint.

## Getting Started

First, install dependencies:

```bash
# Recommended
pnpm install
# or
npm install
# or
yarn install
# or
bun install
```

Then, run the development server:

```bash
pnpm dev
# or
npm run dev
# or
yarn dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

This app will be deployed using the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
