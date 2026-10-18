# BDIX Server Status Checker

A web application to easily find, test, and check the status of all available BDIX servers. Built with modern web technologies, this tool allows you to concurrently test the availability of BDIX/ISP servers and categorize them based on their content type.

## Features

- **Real-Time Status Checking**: Concurrently test multiple server addresses to quickly find open and working BDIX servers.
- **Categorization**: Easily filter servers by categories such as Movie, TV, General FTP/File Sharing, ISP/Network/Broadband, and Mixed.
- **Search**: Quickly search for specific servers by name.
- **Graceful Error Handling**: Effectively handles offline or unresponsive servers using 5-second timeouts.
- **Modern UI**: Clean and responsive user interface built with Tailwind CSS.

## Technologies Used

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)

## Getting Started

First, make sure you have Node.js installed. Then, clone the repository and install the dependencies:

```bash
npm install
```

Next, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application running.

## Adding or Updating Servers

Server configurations and data are maintained locally in `public/servers.json`. To add a new server or update an existing one, simply modify this JSON file.

## Build and Deployment

To build the project for production, run:

```bash
npm run build
```

This project is optimized and ready to be deployed on Vercel. Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
