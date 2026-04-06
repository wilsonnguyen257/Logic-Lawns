import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, ArrowRight } from "lucide-react";
import { Card, CardContent } from "../common/Card";
import { Button } from "../common/Button";
import { usePriceEstimator, BlockSize, ServiceType } from "../../hooks/usePriceEstimator";

export function PriceEstimator() {
  const {
    blockSize,
    setBlockSize,
    serviceType,
    setServiceType,
    estimatedPrice,
  } = usePriceEstimator();

  const blockSizes: { id: BlockSize; label: string; desc: string }[] = [
    { id: "small", label: "Small", desc: "Townhouse / Unit" },
    { id: "medium", label: "Medium", desc: "Standard Home" },
    { id: "large", label: "Large", desc: "Corner Block / Large" },
  ];

  const serviceTypes: { id: ServiceType; label: string }[] = [
    { id: "quickTrim", label: "The Quick Trim" },
    { id: "fullResidential", label: "Full Residential" },
    { id: "cleanUp", label: "The Clean Up" },
  ];

  const handlePreFillForm = () => {
    // Scroll to contact form
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
      
      // We could use context or URL params to pass the selection to the form,
      // but for simplicity in this SPA, we'll just scroll.
      // The user will re-select or we can use a global state if preferred later.
      // A quick hack for this demo is dispatching a custom event
      window.dispatchEvent(new CustomEvent('prefill-contact', { 
        detail: { serviceType } 
      }));
    }
  };

  return (
    <section id="estimator" className="py-20 bg-white">
      <div className="container px-4 mx-auto">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-brand-50 text-brand-700 text-sm font-medium">
              <Calculator className="w-4 h-4" />
              <span>Instant Quote</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Price Estimator
            </h2>
            <p className="text-lg text-slate-600">
              Get an instant idea of what your lawn care might cost. No surprises, just honest pricing.
            </p>
          </div>

          <Card className="overflow-hidden border-0 ring-1 ring-slate-200 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-5">
              <div className="md:col-span-3 p-6 md:p-10">
                <div className="space-y-8">
                  {/* Block Size Selection */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">1. Select your block size</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {blockSizes.map((size) => (
                        <button
                          key={size.id}
                          onClick={() => setBlockSize(size.id)}
                          className={`p-4 rounded-xl border-2 text-left transition-all ${
                            blockSize === size.id
                              ? "border-brand-600 bg-brand-50"
                              : "border-slate-200 hover:border-brand-300 hover:bg-slate-50"
                          }`}
                        >
                          <div className={`font-semibold mb-1 ${blockSize === size.id ? "text-brand-900" : "text-slate-900"}`}>
                            {size.label}
                          </div>
                          <div className={`text-xs ${blockSize === size.id ? "text-brand-700" : "text-slate-500"}`}>
                            {size.desc}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Service Type Selection */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">2. Choose a service</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {serviceTypes.map((service) => (
                        <button
                          key={service.id}
                          onClick={() => setServiceType(service.id)}
                          className={`p-4 rounded-xl border-2 text-center transition-all ${
                            serviceType === service.id
                              ? "border-brand-600 bg-brand-50"
                              : "border-slate-200 hover:border-brand-300 hover:bg-slate-50"
                          }`}
                        >
                          <div className={`font-semibold text-sm ${serviceType === service.id ? "text-brand-900" : "text-slate-900"}`}>
                            {service.label}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Price Display */}
              <div className="md:col-span-2 bg-slate-900 p-6 md:p-10 flex flex-col justify-center text-center text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-brand-600 opacity-10" />
                <div className="relative z-10">
                  <h3 className="text-slate-300 font-medium mb-2 uppercase tracking-wider text-sm">
                    Estimated Starting Price
                  </h3>
                  
                  <div className="flex justify-center items-start mb-6 h-24">
                    <span className="text-3xl font-medium mt-2 text-brand-400">$</span>
                    <AnimatePresence mode="popLayout">
                      <motion.span
                        key={estimatedPrice}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.3 }}
                        className="text-7xl font-bold tracking-tight"
                      >
                        {estimatedPrice}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                  
                  <p className="text-slate-400 text-sm mb-8 px-4">
                    *Final price may vary based on exact lawn condition and accessibility.
                  </p>
                  
                  <Button 
                    variant="primary" 
                    className="w-full bg-brand-500 hover:bg-brand-400 text-white border-none"
                    onClick={handlePreFillForm}
                  >
                    Book This Service <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}