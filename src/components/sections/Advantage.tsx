import React from "react";
import { motion } from "framer-motion";
import { Car, DollarSign, CalendarCheck, Zap } from "lucide-react";

export function Advantage() {
  const benefits = [
    {
      title: "Better Prices",
      description: "Lower overhead means savings passed directly to you without compromising quality.",
      icon: DollarSign,
    },
    {
      title: "Reliable Scheduling",
      description: "A streamlined setup means fewer breakdowns and consistent, on-time arrivals.",
      icon: CalendarCheck,
    },
    {
      title: "Highly Efficient",
      description: "Nimble equipment perfectly suited for standard residential blocks.",
      icon: Zap,
    }
  ];

  return (
    <section className="py-20 bg-slate-50">
      <div className="container px-4 mx-auto">
        <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-brand-50 text-brand-700 text-sm font-medium">
                  <Car className="w-4 h-4" />
                  <span>The Logic Lawns Difference</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                  The "Sedan-Sized" Advantage
                </h2>
                <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                  Unlike massive landscaping companies with heavy trucks and huge overheads, 
                  I operate a compact, highly efficient setup out of a standard vehicle. 
                  What does this mean for you? <strong>Better service at a better price.</strong>
                </p>
                
                <div className="space-y-6">
                  {benefits.map((benefit, index) => (
                    <motion.div 
                      key={benefit.title}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
                      className="flex gap-4"
                    >
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center">
                          <benefit.icon className="w-5 h-5 text-brand-600" />
                        </div>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-slate-900 mb-1">{benefit.title}</h4>
                        <p className="text-slate-600">{benefit.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
            
            <div className="bg-brand-600 p-8 md:p-12 text-white flex flex-col justify-center relative overflow-hidden">
              {/* Abstract decorative elements */}
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-brand-800/40 rounded-full blur-3xl" />
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="relative z-10 text-center"
              >
                <h3 className="text-2xl md:text-3xl font-bold mb-6">Perfect for Standard Blocks</h3>
                <p className="text-brand-50 text-lg mb-8">
                  My equipment and approach are specifically tailored for standard residential properties, 
                  ensuring a pristine finish without the wear and tear of heavy commercial machinery.
                </p>
                <div className="inline-block p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                  <div className="flex items-center gap-4 text-left">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                      <Zap className="w-6 h-6 text-brand-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-brand-100 uppercase tracking-wider">Fast & Clean</div>
                      <div className="text-xl font-bold">In & Out Efficiency</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}