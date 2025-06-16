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
import LastMinuteOffers from "@/components/home/LastMinuteOffers";
import AboutUs from "./AboutUs";
import FAQ from "./FAQ";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        
        {/* Reduced vertical padding for the ticker */}
        <ProductTicker /> 
        {/* Ensured consistent large padding for main sections */}
        <ProductCatalog /> 
        
        {/* Sección Sobre Mí (historia y video) */}
        <AboutUs /> 

        <RecommendationWizard /> 
        {/* <MothersDay /> */} {/* Component has py-16 - ELIMINADO */}
        <Testimonials /> 
        <LastMinuteOffers /> 
        
        {/* Sección de Preguntas Frecuentes */}
        <FAQ /> 

        {/* Slightly reduced padding for social feeds? */}
        <InstagramFeed /> 
        <TikTokFeed /> 
        {/* <ExpansionForm /> */} {/* Commented out usage */}
        {/* <ContactSection /> */} {/* Component has py-16 - ELIMINADO */}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
