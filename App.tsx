import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Specialties from './components/Specialties';
import Products from './components/Products';
import CTA from './components/CTA';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-white">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Specialties />
        <Products />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default App;