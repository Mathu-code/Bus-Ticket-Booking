import { FaFacebookF, FaTwitter, FaInstagram, FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-blue-900 text-white">
      {/* Top Section */}
      <div className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-1 md:grid-cols-3 gap-10 border-b border-blue-800">
        
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <img
              src="/Bus3.png"
              alt="BusGo Logo"
              className="h-16 w-16 object-contain mr-1 rounded"
            />
            <span className="text-3xl font-bold tracking-wide">BusGo</span>
          </div>
          <p className="text-sm text-blue-200 leading-relaxed">
            BusGo is a smart online bus ticket booking platform that lets you
            search, book, and travel across Sri Lanka with ease and comfort.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm text-blue-200">
            <li><a href="/" className="hover:underline">Home</a></li>
            <li><a href="/about" className="hover:underline">About Us</a></li>
            <li><a href="/faq" className="hover:underline">FAQ</a></li>
            <li><a href="/contact" className="hover:underline">Contact</a></li>
            <li><a href="/terms" className="hover:underline">Terms & Conditions</a></li>
            <li><a href="/privacy" className="hover:underline">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Support & Social */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Support</h3>
          <p className="text-sm text-blue-200 mb-1">
            Email:{" "}
            <a href="mailto:support@busgo.com" className="underline">
              support@busgo.com
            </a>
          </p>
          <p className="text-sm text-blue-200 mb-4">
            Hotline:{" "}
            <a href="tel:0112345678" className="underline">
              011‑234‑5678
            </a>
          </p>

          <div className="flex gap-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-700 hover:bg-blue-600 p-3 rounded-full transition"
            >
              <FaFacebookF size={18} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-700 hover:bg-blue-600 p-3 rounded-full transition"
            >
              <FaTwitter size={18} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-pink-600 hover:bg-pink-500 p-3 rounded-full transition"
            >
              <FaInstagram size={18} />
            </a>
            <a
              href="https://wa.me/94771234567"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 hover:bg-green-500 p-3 rounded-full transition"
            >
              <FaWhatsapp size={18} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="text-center text-xs text-blue-300 py-4">
        © {new Date().getFullYear()} BusGo. All rights reserved. | Secure Online Bus Ticket Booking
      </div>
    </footer>
  );
}
