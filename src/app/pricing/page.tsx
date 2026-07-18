import PricingNavbar from '../../components/PricingNavbar';
import PricingHero from '../../components/PricingHero';
import DesktopPricing from '../../components/DesktopPricing';
import StreamingPricing from '../../components/StreamingPricing';
import CreatorBundle from '../../components/CreatorBundle';
import LicensedCharacters from '../../components/LicensedCharacters';
import FooterCTA from '../../components/FooterCTA';
import PricingFooter from '../../components/PricingFooter';

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-black">
      <PricingNavbar />
      <PricingHero />
      <DesktopPricing />
      <StreamingPricing />
      <CreatorBundle />
      <LicensedCharacters />
      <FooterCTA />
      <PricingFooter />
    </main>
  );
}
