import { Globe, Mail, ExternalLink } from 'lucide-react';

const Footer = ({ onOpenContact }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-panel mt-6 animate-entrance" style={{ animationDelay: '220ms' }}>
      <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <p className="font-medium text-slate-200">© {currentYear} NOTINO. All rights reserved.</p>
          <p className="text-slate-400">
            Created by <span className="font-semibold text-white">Kurt Setriani Bognot</span>
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <div className="flex items-center gap-2">
            <a href="#" className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-100 transition hover:bg-white/10" target="_blank" rel="noopener noreferrer" title="Portfolio">
              <Globe size={18} />
            </a>
            <button onClick={onOpenContact} className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-100 transition hover:bg-white/10" title="Contact">
              <Mail size={18} />
            </button>
          </div>

          <a
            href="https://kurtsetrianibognot.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-slate-100 transition hover:bg-white/10"
          >
            <ExternalLink size={18} />
            Author's Webpage
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;