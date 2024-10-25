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

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function Home() {

  const router = useRouter()
  return (
    <div className="min-h-screen flex flex-col bg-black">
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 text-white">
        {/* Hero Section */}
        <motion.section 
          initial="initial"
          animate="animate"
          variants={fadeIn}
          className="text-center mb-16 max-w-4xl"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
            Feedify Feedback - Instant Insights from Your Customers
          </h1>
          <p className="mt-7 text-xl text-gray-400 mb-8">
            Seamlessly gather and analyze feedback with AI to gain deeper insights into your products. Create dedicated spaces for each product and share unique public links with your customers.
          </p>
          <Button className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-300" onClick={()=>router.push('/sign-up')}>
            Get Started Free
          </Button>
        </motion.section>

        {/* Features Section */}
        <section id="features" className="w-full max-w-5xl mb-16">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-3xl font-bold mb-8 text-center text-gray-100"
          >
            Key Features
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                    <feature.icon className="h-12 w-12 text-gray-400 mb-4" />
                    <CardTitle className="text-xl font-semibold text-gray-100">{feature.title}</CardTitle>
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
        <section id="testimonials" className="w-full max-w-3xl mb-16">
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
                      <CardTitle className="text-xl text-gray-300">{message.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-start space-x-4">
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
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </section>

        {/* Call to Action */}
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4 text-gray-100">Ready to Transform Your Feedback Process?</h2>
          <p className="text-xl text-gray-400 mb-8">Join thousands of satisfied customers and start gathering insights today.</p>
          <Button className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-300 flex items-center" onClick={()=>router.push('/sign-up')}>
            Start Your Free Trial <ArrowRight className="ml-2" />
          </Button>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="text-center p-6 bg-gray-900 text-gray-400">
        <div className="border-t border-gray-800 pt-4">
          &copy; 2024 Feedify Feedback. All rights reserved.
        </div>
      </footer>
    </div>
  );
}