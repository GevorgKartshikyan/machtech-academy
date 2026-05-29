import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MachTech Academy — Bitrix24 մասնագետ դառնալու ուղին",
  description: "Անվճար ուսուցում Bitrix24 CRM ներդրման ոլորտում։ Հաջող ավարտողներին՝ ստաժավորման հրավեր MachTech-ում։",
  openGraph: {
    title: "MachTech Academy",
    description: "Դարձիր Bitrix24 մասնագետ — անվճար ուսուցում MachTech Academy-ում",
    type: "website"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hy">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, fontFamily: "Montserrat, 'Montserrat Armenian', system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
