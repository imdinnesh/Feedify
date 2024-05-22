import Navbar from '@/components/Navbar';


export default async function RootLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {children}
    </div>
  );
}