"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Gallery() {
  const [images, setImages] = useState<{src: string, title: string}[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch("/api/settings").then(res => res.json()).then(data => {
      if (data.gallery && data.gallery.length > 0) setImages(data.gallery);
    }).catch(console.error);
  }, []);

  const next = () => setCurrentIndex((prev) => (prev + 1) % (images.length || 1));
  const prev = () => setCurrentIndex((prev) => (prev === 0 ? (images.length || 1) - 1 : prev - 1));

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [images.length]); // Added dependency

  if (images.length === 0) return null;

  return (
    <section className="relative py-24 overflow-hidden bg-brand-dark border-t border-white/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-4 text-white"
          >
            Server <span className="text-brand-red">Gallery</span>
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative max-w-5xl mx-auto aspect-video rounded-3xl overflow-hidden glass border border-white/10 group bg-[#111]"
        >
          {images[currentIndex]?.src && (
            <img
              src={images[currentIndex].src}
              alt={images[currentIndex].title}
              className="w-full h-full object-cover transition-all duration-700 opacity-80 group-hover:opacity-100 group-hover:scale-105"
            />
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-8 pointer-events-none">
            <h3 className="text-2xl font-bold text-white tracking-wider">{images[currentIndex]?.title}</h3>
          </div>

          <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass flex items-center justify-center text-white hover:bg-brand-red transition-colors opacity-0 group-hover:opacity-100">
            <ChevronLeft size={24} />
          </button>
          
          <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass flex items-center justify-center text-white hover:bg-brand-red transition-colors opacity-0 group-hover:opacity-100">
            <ChevronRight size={24} />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? "w-6 bg-brand-red" : "bg-white/50"}`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
