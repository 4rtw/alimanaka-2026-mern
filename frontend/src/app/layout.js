import { Lora } from 'next/font/google';
import MUIThemeProvider from '../theme/MUIThemeProvider';

const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-lora',
  display: 'swap',
});

const YEAR = process.env.LITURGICAL_YEAR || new Date().getFullYear();

export const metadata = {
  title: `Alimanaka ${YEAR} - Fiangonana Loterana Malagasy`,
  description: `Kalendrie liturgique ${YEAR} ny Fiangonana Loterana Malagasy (FLM)`,
  icons: {
    icon: '/icon',
    apple: '/apple-icon',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="mg">
      <body className={lora.variable}>
        <MUIThemeProvider>
          {children}
        </MUIThemeProvider>
      </body>
    </html>
  )
}
