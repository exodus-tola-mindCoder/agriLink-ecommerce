import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Users, 
  Target, 
  Heart, 
  Award, 
  TrendingUp,
  Shield,
  Truck,
  Globe,
  Star,
  CheckCircle
} from 'lucide-react';

const AboutPage: React.FC = () => {
  const stats = [
    { icon: Users, label: 'Active Users', value: '25,000+', color: 'bg-blue-500' },
    { icon: Award, label: 'Verified Sellers', value: '500+', color: 'bg-green-500' },
    { icon: MapPin, label: 'Cities Served', value: '3', color: 'bg-orange-500' },
    { icon: TrendingUp, label: 'Orders Completed', value: '50,000+', color: 'bg-purple-500' }
  ];

  const values = [
    {
      icon: Heart,
      title: 'Community First',
      description: 'We prioritize the needs of our local communities and work to strengthen economic ties across Eastern Ethiopia.'
    },
    {
      icon: Shield,
      title: 'Trust & Security',
      description: 'Every seller is verified and every transaction is protected. We build trust through transparency and reliability.'
    },
    {
      icon: Globe,
      title: 'Digital Innovation',
      description: 'Bringing modern e-commerce solutions to traditional markets while preserving cultural authenticity.'
    },
    {
      icon: Target,
      title: 'Quality Focus',
      description: 'We maintain high standards for products and services to ensure the best experience for our customers.'
    }
  ];

  const team = [
    {
      name: 'Abebe Tadesse',
      role: 'Founder & CEO',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Visionary entrepreneur with 15+ years in technology and business development across Ethiopia.'
    },
    {
      name: 'Meron Bekele',
      role: 'Head of Operations',
      image: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Operations expert ensuring smooth platform functionality and exceptional user experience.'
    },
    {
      name: 'Daniel Girma',
      role: 'Technology Director',
      image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Tech innovator building scalable solutions for Ethiopia\'s growing digital marketplace.'
    },
    {
      name: 'Fatuma Ali',
      role: 'Community Manager',
      image: 'https://images.pexels.com/photos/3763152/pexels-photo-3763152.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Community advocate fostering relationships between sellers, buyers, and local businesses.'
    }
  ];

  const milestones = [
    {
      year: '2022',
      title: 'Platform Launch',
      description: 'EastLink Market officially launched in Harar with 50 initial sellers.'
    },
    {
      year: '2023',
      title: 'Regional Expansion',
      description: 'Extended services to Dire Dawa and Hararge, reaching 500+ sellers.'
    },
    {
      year: '2024',
      title: 'Mobile App Launch',
      description: 'Launched mobile applications for iOS and Android platforms.'
    },
    {
      year: '2025',
      title: 'AI Integration',
      description: 'Implementing AI-powered recommendations and logistics optimization.'
    }
  ];

  return (
    <div className="min-h-screen bg-yellow-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-violet-800 to-orange-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About EastLink Market
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-orange-100 max-w-3xl mx-auto">
              Connecting communities, empowering businesses, and building Ethiopia's digital marketplace future.
            </p>
            <div className="flex justify-center">
              <img 
                src="https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Ethiopian marketplace" 
                className="rounded-lg shadow-2xl max-w-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                EastLink Market was born from a vision to bridge the gap between traditional Ethiopian commerce 
                and modern digital solutions. We believe that every local business deserves access to broader 
                markets and every customer deserves quality products from trusted sellers.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Our platform serves as more than just an e-commerce site – it's a community hub that preserves 
                cultural authenticity while embracing technological innovation. We're committed to supporting 
                local entrepreneurs and fostering economic growth across Harar, Dire Dawa, and Hararge.
              </p>
              <div className="flex items-center space-x-4">
                <CheckCircle className="h-6 w-6 text-green-500" />
                <span className="text-gray-700">Empowering local businesses</span>
              </div>
              <div className="flex items-center space-x-4 mt-2">
                <CheckCircle className="h-6 w-6 text-green-500" />
                <span className="text-gray-700">Preserving cultural heritage</span>
              </div>
              <div className="flex items-center space-x-4 mt-2">
                <CheckCircle className="h-6 w-6 text-green-500" />
                <span className="text-gray-700">Building digital infrastructure</span>
              </div>
            </div>
            <div>
              <img 
                src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600" 
                alt="Ethiopian coffee culture" 
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Impact</h2>
            <p className="text-lg text-gray-600">
              Numbers that reflect our commitment to community growth
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`w-16 h-16 ${stat.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Values</h2>
            <p className="text-lg text-gray-600">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-6 w-6 text-violet-800" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 bg-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Journey</h2>
            <p className="text-lg text-gray-600">
              Key milestones in building Ethiopia's premier e-commerce platform
            </p>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-violet-200"></div>
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-white p-6 rounded-lg shadow-md border border-orange-200">
                      <div className="text-violet-800 font-bold text-lg mb-2">{milestone.year}</div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-2">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                  <div className="relative z-10">
                    <div className="w-4 h-4 bg-violet-800 rounded-full border-4 border-white shadow-md"></div>
                  </div>
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-600">
              The passionate people behind EastLink Market
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-slate-900 mb-1">{member.name}</h3>
                <p className="text-violet-800 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recognition Section */}
      <section className="py-16 bg-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Recognition & Awards</h2>
            <p className="text-lg text-gray-600">
              Honored to be recognized for our contribution to Ethiopian e-commerce
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-md border border-orange-200">
              <Award className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Best E-commerce Platform</h3>
              <p className="text-gray-600">Ethiopian Digital Innovation Awards 2024</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md border border-orange-200">
              <Star className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Community Impact Award</h3>
              <p className="text-gray-600">East African Business Excellence 2024</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md border border-orange-200">
              <TrendingUp className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Fastest Growing Startup</h3>
              <p className="text-gray-600">Ethiopian Startup Awards 2023</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-violet-800 to-orange-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Join Our Growing Community
          </h2>
          <p className="text-xl mb-8 text-orange-100">
            Be part of Ethiopia's digital marketplace revolution
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/register" 
              className="bg-white text-violet-800 px-8 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
            >
              Get Started Today
            </Link>
            <Link 
              to="/contact" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-violet-800 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;