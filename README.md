# BDIX Server Status Checker

A web application built with Next.js (App Router), React, and Tailwind CSS to easily find and check the status of open BDIX and ISP servers in Bangladesh.

## Features

- **Concurrent Status Checking**: Tests multiple server addresses concurrently to efficiently determine their online/offline status.
- **Categorized Server List**: Servers are categorized (e.g., Movie, TV, General FTP/File Sharing, ISP/Network/Broadband, Mixed) for easy filtering.
- **Search Functionality**: Quickly search for specific servers by name.
- **Responsive UI**: A modern, responsive user interface built with Tailwind CSS, ensuring a great experience on both desktop and mobile devices.
- **Real-time Results**: See real-time testing progress and results directly on the dashboard.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Deployment**: [Vercel](https://vercel.com)

## Getting Started

First, install the dependencies:

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

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## How to Update Server Data

The server data is maintained locally in the project. To add, remove, or modify a BDIX/ISP server entry, update the `public/servers.json` file.

Each server entry follows this structure:

```json
{
  "id": 1,
  "name": "SERVER NAME",
  "addresses": [
      "http://example.com"
  ],
  "type": "Category"
}
```

The application fetches this file on load, so any updates to `public/servers.json` will be reflected after a page reload.

## Deployment

The easiest way to deploy this Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.
