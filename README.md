# BDIX Server Status Checker

A web application to check the real-time status of various BDIX (Bangladesh Internet Exchange) servers. Built with modern web technologies to provide a fast, responsive, and user-friendly experience for finding available BDIX resources like FTP, Movie, and TV servers.

## Features

- **Real-time Status Checking:** Concurrently pings multiple BDIX servers to determine their availability (Open/Closed).
- **Categorized Listing:** Filter servers by type (Movie, TV, General FTP, ISP, Mixed).
- **Search Functionality:** Easily find specific servers by name.
- **Fast and Responsive UI:** Built with Next.js (App Router), React 19, and Tailwind CSS v4 for a seamless experience across all devices.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org) (App Router)
- **Library:** [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Deployment:** [Vercel](https://vercel.com)

## Getting Started

### Prerequisites

Ensure you have Node.js installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd bdix-status-checker
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application running.

### Building for Production

To build the application for production, run:

```bash
npm run build
```

Then start the production server:

```bash
npm start
```

## Data Source

The server data is maintained locally in the `public/servers.json` file. You can easily add, remove, or modify server entries by editing this JSON file.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request if you'd like to improve the application.
