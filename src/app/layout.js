import Footer from '@/components/Footer/Footer';
import Navigation from '@/components/Navigation/Navigation';
import { ThemeProvider } from '@/components/ThemeProvider/ThemeProvider';
import { Bricolage_Grotesque } from 'next/font/google';
import './globals.css';
import styles from './layout.module.css';

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-bricolage',
  // Include all weights we'll use
  weight: ['200', '300', '400', '500', '600', '700', '800'],
});

export const metadata = {
  title: 'SmoothIndex - Search Console Dashboard',
  description: 'Manage your Google Search Console sites efficiently',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={bricolage.variable}>
      <body className={bricolage.className}>
        <ThemeProvider>
          <div className={styles.layout}>
            <Navigation />
            <main className={styles.main}>
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
