import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="w-full h-full bg-blue-50 text-blue-900">
        {children}
      </body>
    </html>
  );
}
