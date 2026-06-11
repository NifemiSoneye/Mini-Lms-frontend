import React from "react";
import LandingNav from "@/components/LandingNav";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Clock, BarChart2, GraduationCap } from "lucide-react";
export default function Landing() {
  const features = [
    {
      icon: Clock,
      title: "Learn at your own pace",
      description:
        "Life is busy. Our flexible schedules allow you to consume content whenever and wherever it fits your routine.",
    },
    {
      icon: BarChart2,
      title: "Track your progress",
      description:
        "Visualize your achievements with advanced analytics. See exactly how far you've come in your learning journey.",
    },
    {
      icon: GraduationCap,
      title: "Expert curated content",
      description:
        "Every course is vetted by industry leaders to ensure you are learning relevant, high-impact skills for today's market.",
    },
  ];
  return (
    <div className="min-h-screen flex flex-col">
      <div className="sticky top-0 z-50">
        <LandingNav />
      </div>
      <main className="flex-1">
        <section className="w-full bg-gray-50 px-6 py-16 md:py-24  min-h-[calc(100vh-73px)]">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
            {/* Text content */}
            <div className="flex-1 text-center md:text-left">
              <h1
                className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight animate-fade-slide-up"
                style={{ animationDelay: "0ms" }}
              >
                Learn Without <span className="text-blue-600">Limits</span>
              </h1>
              <p
                className="text-gray-500 mt-4 text-lg max-w-md mx-auto md:mx-0 animate-fade-slide-up"
                style={{ animationDelay: "150ms" }}
              >
                Access world-class courses and track your progress all in one
                place. Your journey to mastery starts here with professional
                guidance.
              </p>
              <div
                className="flex flex-col sm:flex-row gap-3 mt-8 justify-center md:justify-start animate-fade-slide-up"
                style={{ animationDelay: "300ms" }}
              >
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-base"
                  asChild
                >
                  <Link to="/register">Get Started</Link>
                </Button>
                <Button
                  variant="outline"
                  className="px-8 py-6 text-base"
                  asChild
                >
                  <Link to="/login">Explore Courses</Link>
                </Button>
              </div>
            </div>

            {/* Image */}
            <div
              className="flex-1 w-full flex justify-center animate-fade-slide-up "
              style={{ animationDelay: "0ms" }}
            >
              <div className="relative w-full max-w-lg">
                {/* shadow layer behind */}
                <div className="absolute inset-0 bg-blue-200 rounded-2xl translate-x-4 translate-y-4" />
                <img
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800"
                  alt="Learning platform"
                  className="relative w-full rounded-2xl object-cover shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>
        <section className="w-full bg-white px-6 py-20">
          <div className="max-w-6xl mx-auto">
            {/* Heading */}
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Empowering Your Education
              </h2>
              <div className="w-12 h-1 bg-blue-600 mx-auto mt-4 rounded-full" />
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="border border-gray-100 rounded-xl p-6 hover:shadow-md transition-shadow duration-300"
                >
                  <div className="bg-blue-50 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-gray-900 font-semibold text-lg mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="w-full px-6 py-20">
          <div className="max-w-6xl mx-auto bg-blue-600 rounded-2xl px-8 py-16 flex flex-col items-center text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Ready to start learning?
            </h2>
            <p className="text-blue-100 mt-4 text-base max-w-md">
              Join over 50,000+ students worldwide and get unlimited access to
              all courses, projects, and certificates.
            </p>
            <Button
              className="mt-8 bg-white text-blue-600 hover:bg-blue-50 font-semibold px-10 py-6 text-base rounded-full"
              asChild
            >
              <Link to="/register">Sign Up for Free</Link>
            </Button>
          </div>
        </section>
      </main>
      <footer className="w-full bg-white border-t border-gray-100 px-6 py-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <Link to="/" className="text-blue-600 font-bold text-xl">
            Coursa
          </Link>

          {/* Links */}
          {/* Copyright */}
          <p className="text-gray-400 text-sm text-center">
            © 2024 Coursa. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
