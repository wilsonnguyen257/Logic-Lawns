import React from "react";
import { motion } from "framer-motion";
import { Scissors, Home, Wind } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "../ui/card";
import { Badge } from "../ui/badge";

const services = [
  {
    title: "The Quick Trim",
    description: "Perfect for a quick refresh. We'll mow and edge your front lawn and nature strip, leaving it neat and tidy.",
    icon: Scissors,
    gardenSize: "Up to 120 m2 of front lawn and nature strip",
    features: ["Front Lawn Mowing", "Nature Strip", "Basic Edging", "Path Blowing"],
  },
  {
    title: "Full Residential",
    description: "Our most popular package. Complete care for your entire property to keep it looking its absolute best.",
    icon: Home,
    gardenSize: "Around 120-350 m2 total lawn area",
    features: ["Front & Back Mowing", "Precision Edging", "Weed Whacking", "Complete Clean-up", "Green Waste Removal"],
    popular: true,
  },
  {
    title: "The Clean Up",
    description: "Has the yard gotten out of hand? This specialized service tackles overgrown lawns and brings them back to life.",
    icon: Wind,
    gardenSize: "Usually 250 m2+ or heavily overgrown yards",
    features: ["Overgrown Grass Slashing", "Heavy Edging", "Weed Control", "Debris Removal", "Restorative Cut"],
  }
];

export function Services() {
  return (
    <section id="services" className="py-20 bg-white">
      <div className="container px-4 mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Our Services</h2>
          <p className="text-lg text-slate-600">
            Professional lawn care packages designed to fit your needs and keep your property looking pristine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              <Card className={`h-full flex flex-col ${service.popular ? 'ring-2 ring-primary shadow-md relative mt-4 md:mt-0 overflow-visible' : ''}`}>
                {service.popular && (
                  <Badge className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 px-4 py-1 text-xs tracking-wider uppercase whitespace-nowrap">
                    MOST POPULAR
                  </Badge>
                )}
                <CardHeader className="pt-8 text-center">
                  <div className="mx-auto bg-primary/10 w-16 h-16 flex items-center justify-center rounded-2xl mb-4">
                    <service.icon className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground">{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col">
                  <CardDescription className="text-center mb-6 text-base">{service.description}</CardDescription>
                  <div className="mb-6 rounded-2xl border border-primary/15 bg-primary/5 px-4 py-3 text-center">
                    <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary/80">
                      Estimated Size Range
                    </div>
                    <Badge variant="outline" className="h-auto max-w-full whitespace-normal rounded-full px-3 py-1 text-center leading-5">
                      {service.gardenSize}
                    </Badge>
                  </div>
                  <ul className="mt-auto space-y-3">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <div className="mt-1 bg-primary/20 rounded-full p-0.5">
                          <svg className="w-3 h-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
