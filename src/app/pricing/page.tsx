import PricingNavbar from '../../components/PricingNavbar';
import PricingHero from '../../components/PricingHero';
import DesktopPricing from '../../components/DesktopPricing';
import StreamingPricing from '../../components/StreamingPricing';
import PricingBanner from '../../components/PricingBanner';
import PricingBanner2 from '../../components/PricingBanner2';
import LicensedCharacters from '../../components/LicensedCharacters';
import PricingFooter from '../../components/PricingFooter';

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-black">
      <PricingNavbar />
      <PricingHero />
      <DesktopPricing />
      <StreamingPricing />
      <PricingBanner />
      <PricingBanner2 />
      <LicensedCharacters />
      <PricingFooter />
    </main>
  );
}
