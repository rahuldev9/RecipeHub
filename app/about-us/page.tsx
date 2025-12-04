"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

export default function AboutUs() {
  return (
    <main className="w-full min-h-screen bg-white text-gray-800 px-6 py-12 md:px-16 lg:px-28 overflow-hidden">
      {/* HEADER */}
      <motion.section
        initial="hidden"
        animate="show"
        variants={fadeIn}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl mx-auto mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">About RecipeHub</h1>
        <p className="text-lg text-gray-600">
          Your AI-powered cooking assistant that turns **ingredients or food
          images** into delicious recipes — instantly.
        </p>
      </motion.section>

      {/* HERO IMAGE */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={fadeIn}
        transition={{ duration: 0.8 }}
        className="w-full flex justify-center mb-16"
      >
        {/* <Image
          src="/assets/aboutus.png"
          alt="RecipeHub AI Cooking"
          width={1200}
          height={600}
          className="rounded-2xl shadow-xl object-cover hover:scale-[1.02] transition-transform duration-300"
        /> */}
      </motion.div>

      {/* MISSION */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={fadeIn}
        transition={{ duration: 0.7 }}
        className="max-w-4xl mx-auto mb-16"
      >
        <h2 className="text-3xl font-semibold mb-4">Our Mission</h2>
        <p className="text-gray-700 leading-relaxed">
          RecipeHub uses AI to make cooking effortless. Whether you type your
          ingredients or upload a photo, we find or generate the perfect recipe
          for you — simple, fast, and personalized.
        </p>
      </motion.section>

      {/* FEATURES */}
      <section className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto mb-20">
        {[
          {
            title: "🔍 Recipes from Ingredients",
            desc: "Type any items you have — like 'eggs, bread, garlic' — and RecipeHub instantly suggests meals you can cook.",
          },
          {
            title: "📸 Recipes from Images",
            desc: "Upload a food photo and our AI detects the ingredients or dish, giving you ready-to-cook recipes.",
          },
          {
            title: "🍽️ Curated Recipe Library",
            desc: "Thousands of easy recipes with step-by-step guides, tips, and global cuisines.",
          },
          {
            title: "📅 Smart Meal Planning",
            desc: "AI-powered suggestions that build weekly meal plans based on your taste and lifestyle.",
          },
        ].map((feature, index) => (
          <motion.div
            key={index}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.5 + index * 0.1 }}
            className="p-6 rounded-xl border bg-white shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer"
          >
            <h3 className="text-2xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-700">{feature.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* STORY SECTION */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={fadeIn}
        transition={{ duration: 0.7 }}
        className="max-w-4xl mx-auto mb-20"
      >
        <h2 className="text-3xl font-semibold mb-4">Why We Built RecipeHub</h2>
        <p className="text-gray-700 leading-relaxed">
          Everyone faces the same daily question:{" "}
          <strong>“What should I cook?”</strong>
          RecipeHub uses AI to answer that by turning ingredients or images into
          creative, delicious recipes. We want cooking to feel effortless —
          something that brings joy, not stress.
        </p>
      </motion.section>

      {/* CALL TO ACTION */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={fadeIn}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl mx-auto"
      >
        <h2 className="text-3xl font-semibold mb-4">
          Join the RecipeHub Community
        </h2>
        <p className="text-gray-700 mb-8">
          Discover dishes, explore new ideas, and unlock a smarter way to cook
          with AI.
        </p>
        <a
          href="/"
          className="px-6 py-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-medium transition shadow-md hover:shadow-xl"
        >
          Start Cooking
        </a>
      </motion.section>
    </main>
  );
}
