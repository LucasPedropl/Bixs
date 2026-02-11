import React from 'react';
import Hero from '../components/Hero';
import Specialties from '../components/Specialties';
import Products from '../components/Products';
import CTA from '../components/CTA';

const Home: React.FC = () => {
  return (
    <>
      <Hero />
      <Specialties />
      <Products />
      <CTA />
    </>
  );
};

export default Home;