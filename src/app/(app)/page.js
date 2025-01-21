'use client';
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
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation'
import { currentYear } from '@/helpers/currentYear';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function Home() {

  const router = useRouter()
  return (
    <div className="min-h-screen flex flex-col bg-black">
      <main className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 md:px-12 lg:px-24 py-8 sm:py-12 text-white">
        {/* Hero Section */}
        <motion.section
          initial="initial"
          animate="animate"
          variants={fadeIn}
          className="text-center mb-8 sm:mb-16 max-w-4xl mx-auto px-4"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-6 bg-gradient-to-r from-white to-gray-300 text-transparent bg-clip-text">
            Feedify Feedback - Instant Insights from Your Customers
          </h1>
          <p className="mt-4 sm:mt-7 text-lg sm:text-xl text-gray-400 mb-6 sm:mb-8">
            Seamlessly gather and analyze feedback with AI to gain deeper insights into your products. Create dedicated spaces for each product and share unique public links with your customers.
          </p>
          <Button className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-300" onClick={() => router.push('/sign-up')}>
            Get Started Free
          </Button>
        </motion.section>

        {/* Features Section */}
        <section id="features" className="w-full max-w-5xl mb-8 sm:mb-16 px-4">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-3xl font-bold mb-8 text-center text-gray-100"
          >
            Key Features
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {[
              { icon: Star, title: "AI-Powered Analysis", description: "Gain deeper insights with our advanced AI algorithms." },
              { icon: BarChart2, title: "Real-time Analytics", description: "Track feedback trends and sentiment in real-time." },
              { icon: Users, title: "Dedicated Product Spaces", description: "Organize feedback for each of your products separately." }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <Card className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-all duration-300">
                  <CardHeader>
                    <feature.icon className="h-12 w-12 text-blue-400 mb-4 hover:text-yellow-400 transition-colors duration-300" />
                    <CardTitle className="text-xl font-semibold text-white">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Testimonials Carousel */}
        <section id="testimonials" className="w-full max-w-3xl mb-8 sm:mb-16 px-4">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-3xl font-bold mb-8 text-center text-gray-100"
          >
            What Our Customers Say
          </motion.h2>
          <Carousel
            plugins={[Autoplay({ delay: 3000 })]}
            className="w-full"
          >
            <CarouselContent>
              {messages.map((message, index) => (
                <CarouselItem key={index} className="p-1">
                  <Card className="bg-gray-900 border-gray-800 transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="text-lg sm:text-xl text-gray-300">{message.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col sm:flex-row items-start space-y-2 sm:space-y-0 sm:space-x-4">
                      <Mail className="flex-shrink-0 text-gray-500 mt-1" />
                      <div>
                        <p className="text-gray-300 italic">&quot;{message.content}&quot;</p>
                        <p className="text-sm text-gray-500 mt-2">
                          {message.received}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex text-black" />
            <CarouselNext className="hidden md:flex text-black" />
          </Carousel>
        </section>

        {/* Call to Action */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-center mb-8 sm:mb-16 px-4"
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-gray-100">Ready to Transform Your Feedback Process?</h2>
          <p className="text-lg sm:text-xl text-gray-400 mb-6 sm:mb-8">Join thousands of satisfied customers and start gathering insights today.</p>
          <Button className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-300 flex items-center" onClick={() => router.push('/sign-up')}>
            Start Your Free Trial <ArrowRight className="ml-2" />
          </Button>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="text-center p-4 sm:p-6 bg-gray-900 text-gray-400">
        <div className="border-t border-gray-800 pt-4">
          &copy; {currentYear} Feedify Feedback. All rights reserved.
        </div>
      </footer>
    </div>
  );
}