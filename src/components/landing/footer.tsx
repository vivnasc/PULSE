import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/5 py-12 px-4">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-xl font-bold pulse-gradient-text">
              PULSE
            </h3>
            <p className="mt-2 text-sm text-white/40">
              AI-Powered Smart Dating.
              <br />
              Real connections, real chemistry.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white/70 mb-3">Product</h4>
            <ul className="space-y-2">
              <li><a href="#features" className="text-sm text-white/40 hover:text-white/60 transition-colors">Features</a></li>
              <li><a href="#pricing" className="text-sm text-white/40 hover:text-white/60 transition-colors">Pricing</a></li>
              <li><a href="#how-it-works" className="text-sm text-white/40 hover:text-white/60 transition-colors">How it Works</a></li>
              <li><a href="#" className="text-sm text-white/40 hover:text-white/60 transition-colors">Safety</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white/70 mb-3">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-white/40 hover:text-white/60 transition-colors">About</a></li>
              <li><a href="#" className="text-sm text-white/40 hover:text-white/60 transition-colors">Blog</a></li>
              <li><a href="#" className="text-sm text-white/40 hover:text-white/60 transition-colors">Careers</a></li>
              <li><a href="#" className="text-sm text-white/40 hover:text-white/60 transition-colors">Press</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white/70 mb-3">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-white/40 hover:text-white/60 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-white/40 hover:text-white/60 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-sm text-white/40 hover:text-white/60 transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="text-sm text-white/40 hover:text-white/60 transition-colors">GDPR</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            &copy; {new Date().getFullYear()} PULSE. All rights reserved.
          </p>
          <p className="text-xs text-white/30 flex items-center gap-1">
            Made with <Heart className="h-3 w-3 text-[#FF3B5C]" /> for real connections
          </p>
        </div>
      </div>
    </footer>
  );
}
