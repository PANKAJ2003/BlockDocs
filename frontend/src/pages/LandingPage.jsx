import React, { useEffect } from "react";
import { Shield, FileCheck, Share2, Lock, Users, Database } from "lucide-react";
import TopBar from "../components/TopBar";
import { useNavigate } from "react-router-dom";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
      <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-blue-600" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

export function LandingPage() {
  const { openConnectModal } = useConnectModal();
  const { isConnected } = useAccount();
  const navigate = useNavigate();
  useEffect(() => {
    if (isConnected) {
      navigate("/dashboard");
    }
  }, [isConnected, navigate]);
  return (
    <div>
      <div className="sticky top-0 z-50 bg-white shadow-sm">
        <TopBar />
      </div>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative z-10 py-24 sm:py-32">
              <div className="text-center">
                <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
                  Secure Document Sharing
                  <span className="block text-blue-600">
                    Powered by Blockchain
                  </span>
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                  Share your documents with confidence using our
                  blockchain-based platform. Military-grade encryption meets
                  immutable record-keeping.
                </p>
                <div className="flex gap-4 justify-center">
                  <button
                    className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    onClick={openConnectModal}
                  >
                    Get Started
                  </button>
                  <button className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Background Image */}
          <div className="absolute inset-0 -z-10 opacity-10">
            <img
              src="https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&q=80"
              alt="Background pattern"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Our Platform?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={Shield}
              title="Blockchain Security"
              description="Every document is secured using advanced blockchain technology, ensuring tamper-proof storage and verification."
            />
            <FeatureCard
              icon={FileCheck}
              title="Document Verification"
              description="Instantly verify the authenticity and integrity of any shared document with our verification system."
            />
            <FeatureCard
              icon={Lock}
              title="End-to-End Encryption"
              description="Your documents are encrypted from the moment they leave your device until they reach their destination."
            />
            <FeatureCard
              icon={Share2}
              title="Easy Sharing"
              description="Share documents securely with individuals or teams with just a few clicks."
            />
            <FeatureCard
              icon={Database}
              title="Immutable Records"
              description="Every transaction is recorded on the blockchain, creating a permanent and verifiable audit trail."
            />
            <FeatureCard
              icon={Users}
              title="Access Control"
              description="Define who can access your documents with granular permission controls."
            />
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-blue-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Secure Your Documents?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of businesses that trust our platform for secure
              document sharing.
            </p>
            <button
              className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              onClick={openConnectModal}
            >
              Get Started
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-300 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="border-t border-gray-800 mt-12 pt-8 text-center">
              <p>© 2025 BlockDocs. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default LandingPage;
