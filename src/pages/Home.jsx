import React from 'react';
import HeroPro from '../components/HeroPro';
import Atouts from '../components/Atouts';
// import ChiffresCles from '../components/ChiffresCles';
// import ServicesOverview from '../components/ServicesOverview';
// import Testimonials from '../components/Testimonials';
// import CallToAction from '../components/CallToAction';
import News from '../components/News';

export default function Home() {
  return (
    <div>
      <HeroPro />
      <Atouts />
      {/* <ChiffresCles /> */}
      {/* <ServicesOverview /> */}
      {/* <Testimonials /> */}
      {/* <CallToAction /> */}
      <News />
    </div>
  );
} 