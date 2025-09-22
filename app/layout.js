import './globals.css'
import Navigation from '../components/Navigation'

export const metadata = {
  title: 'Simple Inventory Management',
  description: 'Manage your products, suppliers, and stock levels',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}