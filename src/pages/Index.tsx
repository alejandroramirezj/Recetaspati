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
        {/* Reduced vertical padding for the ticker */}
        <ProductTicker /> {/* Keep default padding from component? Or add py-6 here? Let's adjust component itself */}
        {/* Ensured consistent large padding for main sections */}
        <ProductCatalog /> {/* Component has py-16 */}
        <RecommendationWizard /> {/* Component has py-16 */}
        <MothersDay /> {/* Component has py-16 */}
        <Testimonials /> {/* Component has py-16 */}
        {/* Slightly reduced padding for social feeds? */}
        <InstagramFeed /> {/* Let's adjust this component */}
        <TikTokFeed /> {/* Let's adjust this component */}
        {/* <ExpansionForm /> */} {/* Commented out usage */}
        <ContactSection /> {/* Component has py-16 */}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
