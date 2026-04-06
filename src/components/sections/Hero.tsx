import React from "react";
import { motion } from "framer-motion";
import { Logo } from "../common/Logo";
import { Button } from "../common/Button";
import { ArrowRight, Leaf, Shield, Clock } from "lucide-react";

export function Hero() {
  return (
    <section className="relative pt-8 pb-20 md:pt-12 md:pb-28 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 bg-brand-50" />
      <div className="absolute inset-y-0 right-0 -z-10 w-1/2 bg-brand-100/50 rounded-l-full blur-3xl opacity-60 transform translate-x-1/3" />
      
      <div className="container px-4 mx-auto">
        <nav className="flex items-center justify-between mb-16 md:mb-24">
          <Logo />
          <Button variant="outline" size="sm" onClick={() => document.getElementById('contact')?.scrollIntoView()}>
            Book Now
          </Button>
        </nav>

        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-white border border-brand-200 text-brand-700 text-sm font-medium shadow-sm"
          >
            <Leaf className="w-4 h-4" />
            <span>Eco-Friendly Lawn Care</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6"
          >
            Professional Lawn Care,{" "}
            <span className="text-brand-600">Handled with Care</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Serving the <span className="font-semibold text-slate-800">Local Suburb</span> area with reliable, 
            efficient, and affordable lawn maintenance. Get your weekend back.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button 
              size="lg" 
              className="w-full sm:w-auto gap-2"
              onClick={() => document.getElementById('estimator')?.scrollIntoView()}
            >
              Get a Quote <ArrowRight className="w-5 h-5" />
            </Button>
            <Button 
              variant="secondary" 
              size="lg" 
              className="w-full sm:w-auto"
              onClick={() => document.getElementById('services')?.scrollIntoView()}
            >
              View Services
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-6 pt-8 border-t border-brand-200/60 max-w-2xl mx-auto"
          >
            <div className="flex flex-col items-center justify-center gap-2">
              <Shield className="w-6 h-6 text-brand-600" />
              <span className="text-sm font-medium text-slate-700">Fully Insured</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-2">
              <Clock className="w-6 h-6 text-brand-600" />
              <span className="text-sm font-medium text-slate-700">Reliable Scheduling</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-2 col-span-2 md:col-span-1">
              <Leaf className="w-6 h-6 text-brand-600" />
              <span className="text-sm font-medium text-slate-700">Clean & Green</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}