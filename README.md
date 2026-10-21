# BDIX Server Tester

A fast and modern web application built with Next.js to check the status of various BDIX (Bangladesh Internet Exchange) servers. It helps users easily find which BDIX servers (Movies, TV, FTP, ISP, etc.) are currently online and accessible from their network.

## Features

- **Real-time Status Checking**: Concurrently tests multiple BDIX server addresses to determine if they are online or offline.
- **Categorization**: Filter servers by categories such as Movie, TV, General FTP/File Sharing, and ISP/Network/Broadband.
- **Search Functionality**: Quickly search for specific servers by name.
- **Visual Progress**: See a visual representation of the testing progress and the number of online/offline servers.
- **Modern Tech Stack**: Built using the latest web technologies for optimal performance and user experience.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Language**: TypeScript

## Getting Started

First, clone the repository and install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application running.

## Project Structure

- `src/app/page.tsx`: The main UI component containing the server list, filters, and test controls.
- `src/hooks/useServerTester.ts`: A custom React hook handling the core logic for concurrently testing server availability.
- `public/servers.json`: The local JSON file containing the list of BDIX servers and their URLs.

## How it Works

The core server testing logic uses `Promise.any` to concurrently test all available addresses for a single server. It utilizes `fetch` with `mode: 'no-cors'` and an `AbortController` with a 5-second timeout to gracefully handle unresponsive servers and bypass CORS restrictions for simple availability checking.

## Deployment

This project is optimized for deployment on [Vercel](https://vercel.com/), the creators of Next.js. You can deploy your own version by connecting your GitHub repository to Vercel.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
