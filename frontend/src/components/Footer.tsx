import {
  Facebook,
  Instagram,
  Linkedin,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/20 mt-12">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8 text-sm text-white">
        
        <div>
          <h4 className="font-semibold mb-2 text-white/90">Social</h4>
          <ul className="space-y-2">
            <li>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/70 hover:text-white hover:underline"
              >
                <Instagram className="w-4 h-4" />
                Instagram
              </a>
            </li>
            <li>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/70 hover:text-white hover:underline"
              >
                <Facebook className="w-4 h-4" />
                Facebook
              </a>
            </li>
            <li>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/70 hover:text-white hover:underline"
              >
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-2 text-white/90">Contact</h4>
          <p className="text-white/70">gitsync@gmail.com</p>
        </div>

        <div>
          <h4 className="font-semibold mb-2 text-white/90">Legal</h4>
          <ul className="space-y-1">
            <li>
              <a href="/privacy" className="hover:underline text-white/70 hover:text-white">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="/terms" className="hover:underline text-white/70 hover:text-white">
                Terms of Service
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 mt-6 pt-6 pb-8 text-center text-xs text-white/50">
        <span>&copy; {new Date().getFullYear()} GitSync - All rights reserved</span>
      </div>
    </footer>
  );
}
