# BDIX Connectivity Tester

A comprehensive web application for testing BDIX (Bangladesh Internet Exchange) server connectivity. This tool helps users in Bangladesh determine which local content servers are accessible from their network connection.

## Features

### Core Functionality
- **Categorized Server Testing**: Organized testing by server type (FTP, Media, Software, etc.)
- **Real-time Connectivity Testing**: Instant results showing which servers are accessible
- **Favorites System**: Save frequently used servers for quick access
- **Test History**: Keep track of previous test results
- **Quick Test Mode**: Test only the most popular servers for faster results
- **Search & Filter**: Easily find specific servers by name, URL, or category

### User Experience
- **Dark/Light Mode**: Choose your preferred viewing theme
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Progressive Web App (PVC)**: Installable on mobile devices
- **Export Results**: Save test results for future reference
- **Share Results**: Share your test results with others

### Advanced Features
- **Network Information**: View your connection details and ISP information
- **Analytics Dashboard**: Detailed statistics and trends
- **Speed Test**: Measure your connection speed to BDIX servers
- **BDIX Guide**: Comprehensive information about BDIX technology
- **Server Comparison**: Compare multiple servers side by side
- **Server Suggestions**: Community-driven server recommendation system

## Technology Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **UI Components**: Framer Motion for animations, React Icons
- **State Management**: React Hooks
- **Deployment**: Vercel
- **API**: Next.js API Routes

## Getting Started

### Prerequisites
- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/bdix-tester.git
cd bdix-tester
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Deployment

The easiest way to deploy this Next.js app is to use the [Vercel Platform](https://vercel.com/new).

## Auto-commit and Deployment

This project includes an automatic git commit and push system:

- `npm run auto-commit` - Manually trigger an auto-commit
- `npm run watch` - Watch for file changes and automatically commit and push
- `watch.bat` - Windows batch file to start the file watcher

The project also includes GitHub Actions for automatic deployment to Vercel when changes are pushed to the master branch.

## Project Structure

```
bdix-tester/
├── src/
│   ├── app/
│   │   ├── components/          # Reusable components
│   │   ├── api/                 # API routes
│   │   ├── data/                # Static data files
│   │   ├── docs/                # Documentation pages
│   │   ├── offline/             # Offline page
│   │   ├── layout.js            # Root layout
│   │   └── page.js              # Main page
│   └── styles/
├── public/                      # Static assets
├── README.md
└── package.json
```

## API Routes

- `GET /api/servers` - Get server suggestions
- `POST /api/servers` - Submit new server suggestions

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to all BDIX-enabled ISPs and content providers
- Inspired by the need for better local content access in Bangladesh
- Built with the amazing Next.js framework

## Support

If you have any questions or need help, please open an issue on GitHub.