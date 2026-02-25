import { Heart } from "lucide-react";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-white/5 py-12 px-4">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Image src="/PULSE.logo.name.png" alt="PULSE" width={120} height={40} className="h-8 w-auto" />
            <p className="mt-2 text-sm text-white/40">
              Dating inteligente com IA.
              <br />
              Conexões reais, química de verdade.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white/70 mb-3">Produto</h4>
            <ul className="space-y-2">
              <li><a href="#features" className="text-sm text-white/40 hover:text-white/60 transition-colors">Funcionalidades</a></li>
              <li><a href="#pricing" className="text-sm text-white/40 hover:text-white/60 transition-colors">Planos</a></li>
              <li><a href="#how-it-works" className="text-sm text-white/40 hover:text-white/60 transition-colors">Como Funciona</a></li>
              <li><a href="#" className="text-sm text-white/40 hover:text-white/60 transition-colors">Segurança</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white/70 mb-3">Empresa</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-white/40 hover:text-white/60 transition-colors">Sobre Nós</a></li>
              <li><a href="#" className="text-sm text-white/40 hover:text-white/60 transition-colors">Blog</a></li>
              <li><a href="#" className="text-sm text-white/40 hover:text-white/60 transition-colors">Carreiras</a></li>
              <li><a href="#" className="text-sm text-white/40 hover:text-white/60 transition-colors">Imprensa</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white/70 mb-3">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-white/40 hover:text-white/60 transition-colors">Política de Privacidade</a></li>
              <li><a href="#" className="text-sm text-white/40 hover:text-white/60 transition-colors">Termos de Uso</a></li>
              <li><a href="#" className="text-sm text-white/40 hover:text-white/60 transition-colors">Política de Cookies</a></li>
              <li><a href="#" className="text-sm text-white/40 hover:text-white/60 transition-colors">RGPD</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            &copy; {new Date().getFullYear()} PULSE. Todos os direitos reservados.
          </p>
          <p className="text-xs text-white/30 flex items-center gap-1">
            Feito com <Heart className="h-3 w-3 text-[#FF3B5C]" /> para conexões reais
          </p>
        </div>
      </div>
    </footer>
  );
}
