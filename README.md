# BDIX Server Status Checker

A web application designed to help users quickly find and check the status of available BDIX (Bangladesh Internet Exchange) servers. It provides real-time testing of various FTP, movie, and live TV servers connected through the BDIX network to determine which ones are currently online and reachable from your ISP.

## Features

- **Real-time Server Testing:** Concurrently tests multiple BDIX servers to determine their availability.
- **Categorization:** Filters servers by categories like Movie, FTP, etc.
- **Search Functionality:** Easily search for specific server names.
- **Status Indicators:** Clearly displays whether a server is Open (Online), Closed (Offline), or currently being Tested.
- **Modern UI:** Clean, responsive, and user-friendly interface built with Tailwind CSS.
- **Concurrency Control:** Efficiently tests servers with a concurrency limit to avoid network congestion.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org) (App Router)
- **Library:** [React](https://react.dev)
- **Styling:** [Tailwind CSS](https://tailwindcss.com)

## Getting Started

First, make sure you have Node.js installed on your machine. Then, clone the repository and install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Configuration

Server configurations and data are maintained locally in the `public/servers.json` file. You can add, remove, or modify BDIX server entries in this file to update the list of tested servers.

## Build and Deploy

To build the project for production, run:

```bash
npm run build
```

The easiest way to deploy this Next.js app is to use the [Vercel Platform](https://vercel.com/new).

## License

This project is open-source.
