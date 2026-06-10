import {
  Navbar,
  Hero,
  StreamingDemands,
  RolesCarousel,
  LivestreamShowcase,
  KnowledgeUpload,
  FinalCTA,
  Footer,
} from '@/components';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <StreamingDemands />
      <RolesCarousel />
      <LivestreamShowcase />
      <KnowledgeUpload />
      <FinalCTA />
      <Footer />
    </main>
  );
}
