import React from 'react';
import { Hero } from '../components/sections/Hero';
import { Services } from '../components/sections/Services';
import { Advantage } from '../components/sections/Advantage';
import { PriceEstimator } from '../components/sections/PriceEstimator';
import { ContactForm } from '../components/sections/ContactForm';
import { Footer } from '../components/sections/Footer';

export function HomePage() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <main className="flex-grow">
        <Hero />
        <Services />
        <Advantage />
        <PriceEstimator />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
}