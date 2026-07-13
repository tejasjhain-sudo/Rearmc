"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { useState, useEffect } from "react";
import { Review } from "@/lib/kv";

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    fetch("/api/settings").then(res => res.json()).then(data => {
      if (data.reviews) setReviews(data.reviews);
    }).catch(console.error);
  }, []);
  return (
    <section id="reviews" className="relative py-24 overflow-hidden bg-brand-dark">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-4 text-white"
          >
            What <span className="text-brand-red">Content Creators</span> Say
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 max-w-2xl mx-auto"
          >
            See why top Indian Minecraft creators prefer RearMC for their PvP practice.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {reviews.map((review, i) => {
            // Extract Video ID to get thumbnail
            let videoId = "";
            try {
              if (review.url.includes("youtu.be/")) videoId = review.url.split("youtu.be/")[1]?.split("?")[0];
              else if (review.url.includes("v=")) videoId = new URL(review.url).searchParams.get("v") || "";
            } catch (e) {}

            return (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative rounded-2xl overflow-hidden glass border border-white/10 hover:border-brand-red/50 transition-colors"
              >
                <div className="aspect-video relative overflow-hidden bg-gray-900">
                  {videoId ? (
                    <img 
                      src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`} 
                      alt={review.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => { (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`; }}
                    />
                  ) : (
                    <div className="w-full h-full bg-[#111] flex items-center justify-center text-gray-500 text-sm">No Thumbnail</div>
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                    <a 
                      href={review.url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="w-16 h-16 rounded-full bg-brand-red text-white flex items-center justify-center shadow-[0_0_30px_rgba(255,45,45,0.8)] transition-transform hover:scale-110"
                    >
                      <Play fill="currentColor" size={24} className="ml-1" />
                    </a>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-1 truncate">{review.title}</h3>
                  <p className="text-brand-red font-medium text-sm">Review by {review.reviewer}</p>
                </div>
              </motion.div>
            );
          })}

          {/* Placeholder if empty */}
          {reviews.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-12">
              No reviews available at the moment.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
