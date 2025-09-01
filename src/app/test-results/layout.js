import '../../app/globals.css';

export const metadata = {
  title: 'BDIX Test Results',
  description: 'BDIX Server Connectivity Test Results',
};

export default function TestResultsLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}