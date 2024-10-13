'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Mail, Star, BarChart2, Users, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import messages from '@/messages.json';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">

      {/* Main content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 text-white">
        {/* Hero Section */}
        <section className="text-center mb-16 max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Feedify Feedback - Instant Insights from Your Customers
          </h1>
          <p className="mt-7 text-xl text-gray-300 mb-8">
            Seamlessly gather and analyze feedback with AI to gain deeper insights into your products. Create dedicated spaces for each product and share unique public links with your customers.
          </p>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105">
            Get Started Free
          </Button>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full max-w-5xl mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Star, title: "AI-Powered Analysis", description: "Gain deeper insights with our advanced AI algorithms." },
              { icon: BarChart2, title: "Real-time Analytics", description: "Track feedback trends and sentiment in real-time." },
              { icon: Users, title: "Dedicated Product Spaces", description: "Organize feedback for each of your products separately." }
            ].map((feature, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700 hover:border-blue-500 transition-all duration-300">
                <CardHeader>
                  <feature.icon className="h-12 w-12 text-blue-400 mb-4" />
                  <CardTitle className="text-xl font-semibold text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Testimonials Carousel */}
        <section id="testimonials" className="w-full max-w-3xl mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">What Our Customers Say</h2>
          <Carousel
            plugins={[Autoplay({ delay: 3000 })]}
            className="w-full"
          >
            <CarouselContent>
              {messages.map((message, index) => (
                <CarouselItem key={index} className="p-1">
                  <Card className="bg-gray-800 border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="text-xl text-blue-400">{message.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-start space-x-4">
                      <Mail className="flex-shrink-0 text-gray-500 mt-1" />
                      <div>
                        <p className="text-gray-300 italic">"{message.content}"</p>
                        <p className="text-sm text-gray-500 mt-2">
                          {message.received}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </section>

        {/* Call to Action */}
        <section className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Feedback Process?</h2>
          <p className="text-xl text-gray-300 mb-8">Join thousands of satisfied customers and start gathering insights today.</p>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center">
            Start Your Free Trial <ArrowRight className="ml-2" />
          </Button>
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center p-6 bg-gray-900 text-gray-400">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-4">
          <div>
            <h3 className="font-semibold mb-2">Product</h3>
            <ul className="space-y-1">
              <li><Link href="#" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Integrations</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Company</h3>
            <ul className="space-y-1">
              <li><Link href="#" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Resources</h3>
            <ul className="space-y-1">
              <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Documentation</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Support</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Legal</h3>
            <ul className="space-y-1">
              <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-4">
          © 2024 Feedify Feedback. All rights reserved.
        </div>
      </footer>
    </div>
  );
}