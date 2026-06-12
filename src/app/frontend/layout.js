import Header from "@/components/frontend/header";
import Footer from "@/components/frontend/footer";

export default function FrontendLayout({
  children,
}) {
  return (
    <div className="min-h-screen flex flex-col">

      <Header />
    
      <main className="flex-1">
        {children}
      </main>

      <Footer />

    </div>
  );
}