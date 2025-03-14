import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import StatsSection from "@/components/home/StatsSection";
import ContactSection from "@/components/home/ContactSection";
import FooterSection from "@/components/home/FooterSection";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <StatsSection />
        <ContactSection />
      </main>
      
      <FooterSection />
    </div>
  );
};

export default Index;
