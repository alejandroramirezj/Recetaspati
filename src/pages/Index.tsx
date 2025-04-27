import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import ProductCatalog from "@/components/home/ProductCatalog";
import Testimonials from "@/components/home/Testimonials";
import ContactSection from "@/components/home/ContactSection";
import MothersDay from "@/components/home/MothersDay";
// import ExpansionForm from "@/components/home/ExpansionForm"; // Commented out import
import InstagramFeed from "@/components/home/InstagramFeed";
import TikTokFeed from "@/components/home/TikTokFeed";
import RecommendationWizard from "@/components/home/RecommendationWizard";
import ProductTicker from "@/components/layout/ProductTicker";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <ProductTicker />
        <ProductCatalog />
        <RecommendationWizard />
        <MothersDay />
        <Testimonials />
        <InstagramFeed />
        <TikTokFeed />
        {/* <ExpansionForm /> */} {/* Commented out usage */}
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
