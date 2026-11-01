# BDIX Server Status Checker

A web application designed to check the status (testing, online, offline) of various BDIX (Bangladesh Internet Exchange) servers and ISPs. The application performs concurrent checks to find the working endpoint for each server and provides a user-friendly dashboard.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Deployment**: [Vercel](https://vercel.com/)

## Features

- **Concurrent Testing**: Tests multiple server URLs concurrently to find the first working endpoint.
- **Categorization**: Filter servers by their testing status (Online, Offline, Testing).
- **Search**: Easily search for specific servers by name.
- **Responsive UI**: A modern, clean, and mobile-friendly interface built with Tailwind CSS.

## Getting Started

First, install the dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Server Data

Server configurations and data are maintained locally in `public/servers.json`.

## Deployment

The easiest way to deploy this Next.js app is to use the [Vercel Platform](https://vercel.com/new).
