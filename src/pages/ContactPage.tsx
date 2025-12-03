import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  MessageCircle,
  Headphones,
  FileText,
  Users,
  Building
} from 'lucide-react';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    category: 'general',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        category: 'general',
        message: ''
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }, 2000);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Our Offices',
      details: [
        'Harar: Ras Makonnen Street, Near Harar University',
        'Dire Dawa: Sabian Street, Commercial District',
        'Hararge: Main Market Area, Business Center'
      ]
    },
    {
      icon: Phone,
      title: 'Phone Numbers',
      details: [
        'Main Office: +251-25-666-1234',
        'Customer Support: +251-25-666-1235',
        'Seller Support: +251-25-666-1236'
      ]
    },
    {
      icon: Mail,
      title: 'Email Addresses',
      details: [
        'General: info@eastlinkmarket.et',
        'Support: support@eastlinkmarket.et',
        'Business: business@eastlinkmarket.et'
      ]
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: [
        'Monday - Friday: 8:00 AM - 6:00 PM',
        'Saturday: 9:00 AM - 4:00 PM',
        'Sunday: Closed',
        '24/7 Online Support Available'
      ]
    }
  ];

  const supportCategories = [
    {
      icon: MessageCircle,
      title: 'General Inquiry',
      description: 'Questions about our platform, services, or policies'
    },
    {
      icon: Headphones,
      title: 'Customer Support',
      description: 'Help with orders, payments, or account issues'
    },
    {
      icon: Building,
      title: 'Seller Support',
      description: 'Assistance for sellers and business partnerships'
    },
    {
      icon: FileText,
      title: 'Technical Issues',
      description: 'Report bugs, technical problems, or feature requests'
    }
  ];

  const faqs = [
    {
      question: 'How do I create an account?',
      answer: 'Click on "Sign Up" in the top right corner and choose your account type (Customer, Seller, or Delivery Agent). Fill in the required information and verify your email.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We currently accept cash on delivery and are working on integrating mobile money and bank transfer options for online payments.'
    },
    {
      question: 'How long does delivery take?',
      answer: 'Delivery times vary by location: Harar (1-2 days), Dire Dawa (1-3 days), Hararge (2-4 days). Express delivery options are available for urgent orders.'
    },
    {
      question: 'How do I become a seller?',
      answer: 'Register as a seller, provide your business license and required documents. Our team will review and approve your application within 2-3 business days.'
    },
    {
      question: 'What if I have issues with my order?',
      answer: 'Contact our customer support team immediately. We offer order tracking, return policies, and dispute resolution to ensure customer satisfaction.'
    }
  ];

  return (
    <div className="min-h-screen bg-yellow-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We're here to help! Reach out to us for any questions, support, or feedback. 
            Our team is committed to providing excellent service to our community.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {contactInfo.map((info, index) => (
            <div key={index} className="bg-orange-50 rounded-lg p-6 border border-orange-200 text-center">
              <div className="w-12 h-12 bg-violet-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <info.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">{info.title}</h3>
              <div className="space-y-2">
                {info.details.map((detail, idx) => (
                  <p key={idx} className="text-sm text-gray-600">{detail}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          {/* Contact Form */}
          <div className="bg-orange-50 rounded-lg p-8 border border-orange-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Send us a Message</h2>
            
            {submitStatus === 'success' && (
              <div className="bg-green-50 border border-green-300 rounded-md p-4 mb-6">
                <div className="flex items-center">
                  <Send className="h-5 w-5 text-green-400 mr-2" />
                  <p className="text-green-800">Thank you! Your message has been sent successfully. We'll get back to you soon.</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="support">Customer Support</option>
                    <option value="seller">Seller Support</option>
                    <option value="technical">Technical Issues</option>
                    <option value="partnership">Business Partnership</option>
                    <option value="feedback">Feedback & Suggestions</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  placeholder="Brief description of your inquiry"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  placeholder="Please provide details about your inquiry..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-violet-800 text-white py-3 px-6 rounded-md hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Support Categories & Map */}
          <div className="space-y-8">
            {/* Support Categories */}
            <div className="bg-orange-50 rounded-lg p-8 border border-orange-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">How Can We Help?</h2>
              <div className="space-y-4">
                {supportCategories.map((category, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-white rounded-lg border border-orange-200 hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <category.icon className="h-5 w-5 text-violet-800" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">{category.title}</h3>
                      <p className="text-sm text-gray-600">{category.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Contact */}
            <div className="bg-gradient-to-r from-violet-800 to-orange-500 rounded-lg p-8 text-white">
              <h3 className="text-xl font-bold mb-4">Need Immediate Help?</h3>
              <p className="text-orange-100 mb-6">
                For urgent matters, contact our support team directly
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5" />
                  <span>+251-25-666-1235</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5" />
                  <span>support@eastlinkmarket.et</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MessageCircle className="h-5 w-5" />
                  <span>Live Chat (8 AM - 6 PM)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-orange-50 rounded-lg p-8 border border-orange-200 mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg p-6 border border-orange-200">
                <h3 className="font-semibold text-slate-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600 text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Office Locations */}
        <div className="bg-white rounded-lg p-8 shadow-md">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Visit Our Offices</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-violet-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Harar Office</h3>
              <p className="text-gray-600 text-sm mb-2">Ras Makonnen Street</p>
              <p className="text-gray-600 text-sm mb-2">Near Harar University</p>
              <p className="text-violet-800 font-medium">+251-25-666-1234</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Dire Dawa Office</h3>
              <p className="text-gray-600 text-sm mb-2">Sabian Street</p>
              <p className="text-gray-600 text-sm mb-2">Commercial District</p>
              <p className="text-violet-800 font-medium">+251-25-666-1237</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Hararge Office</h3>
              <p className="text-gray-600 text-sm mb-2">Main Market Area</p>
              <p className="text-gray-600 text-sm mb-2">Business Center</p>
              <p className="text-violet-800 font-medium">+251-25-666-1238</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;