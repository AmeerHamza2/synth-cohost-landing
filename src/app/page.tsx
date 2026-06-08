import {
  Navbar,
  Hero,
  StreamingDemands,
  MeetSynth,
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
      <MeetSynth />
      <RolesCarousel />
      <LivestreamShowcase />
      <KnowledgeUpload />
      <FinalCTA />
      <Footer />
    </main>
  );
}
