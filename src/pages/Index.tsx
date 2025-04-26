
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import ProductCatalog from "@/components/home/ProductCatalog";
import Testimonials from "@/components/home/Testimonials";
import ContactSection from "@/components/home/ContactSection";
import MothersDay from "@/components/home/MothersDay";
import ExpansionForm from "@/components/home/ExpansionForm";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <ProductCatalog />
        <MothersDay />
        <Testimonials />
        <ExpansionForm />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
