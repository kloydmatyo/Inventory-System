import './globals.css'

export const metadata = {
  title: 'Inventory Management MVP',
  description: 'A simple inventory management system',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <nav className="bg-blue-600 text-white p-4">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold">Inventory Management</h1>
          </div>
        </nav>
        <main className="container mx-auto p-4">
          {children}
        </main>
      </body>
    </html>
  )
}