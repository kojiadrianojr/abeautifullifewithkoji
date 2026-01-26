import { Box } from '@mui/material';
import Hero from '@/components/sections/Hero';
import Story from '@/components/sections/Story';
import Gallery from '@/components/sections/Gallery';
import Schedule from '@/components/sections/Schedule';
import Registry from '@/components/sections/Registry';
import RSVP from '@/components/sections/RSVP';
import FAQ from '@/components/sections/FAQ';
import Footer from '@/components/sections/Footer';
import Navigation from '@/components/Navigation';
import { getWeddingConfig } from '@/lib/config';

export default function Home() {
  const config = getWeddingConfig();
  const { content } = config;

  return (
    <Box component="main" sx={{ minHeight: '100vh' }}>
      <Navigation />
      {content.hero.enabled && <Hero />}
      {content.story.enabled && <Story />}
      {content.gallery.enabled && <Gallery />}
      {content.schedule.enabled && <Schedule />}
      {content.registry.enabled && <Registry />}
      {content.rsvp.enabled && <RSVP />}
      {content.faq.enabled && <FAQ />}
      
      <Footer />
    </Box>
  );
}
