import { Lora } from 'next/font/google';
import MUIThemeProvider from '../theme/MUIThemeProvider';

const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-lora',
  display: 'swap',
});

export const metadata = {
  title: 'Alimanaka 2026 - Fiangonana Loterana Malagasy',
  description: 'Kalendrie liturgique 2026 ny Fiangonana Loterana Malagasy (FLM)',
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
