import { ArrowRight, Clock, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';

const DiagnosticCTASection = () => {
  const { language, localPath } = useLanguage();
  const navigate = useNavigate();
  const isPt = language === 'pt-BR';

  return (
    <section className="py-16 md:py-20 bg-[#1a1a1a]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="relative max-w-6xl mx-auto rounded-3xl overflow-hidden bg-gradient-to-r from-[#1f1430] via-[#1a1a1a] to-[#1f1430] border border-brand-purple/30 px-10 py-16 md:px-24 md:py-20">
          {/* glow */}
          <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-brand-violet/10 blur-[120px] pointer-events-none" />

          <div className="relative flex flex-col md:flex-row items-center gap-12 md:gap-24">
            {/* W animado */}
            <div className="flex-shrink-0">
              <div className="relative inline-flex">
                <span className="absolute inline-flex h-full w-full rounded-full bg-brand-violet opacity-40 animate-ping" />
                <span className="relative inline-flex w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-brand-violet via-brand-purple to-brand-blue items-center justify-center text-white font-bold text-4xl md:text-5xl shadow-2xl ring-4 ring-brand-violet/20">
                  W
                </span>
              </div>
            </div>

            {/* Texto */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight">
                {isPt
                  ? 'Descubra em 2 minutos se a Eluvie é para você'
                  : 'Find out in 2 minutes if Eluvie is right for you'}
              </h2>
              <p className="text-gray-300 text-sm md:text-base max-w-xl mx-auto md:mx-0 mb-4">
                {isPt
                  ? 'O Wolly conversa com você e indica o plano ideal, sem formulário, sem compromisso.'
                  : 'Wolly chats with you and recommends the ideal plan, no forms, no commitment.'}
              </p>
              <div className="flex items-center justify-center md:justify-start gap-4 text-xs text-gray-400 mt-3 mb-5">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" /> {'< 2 min'}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {isPt ? 'Sem cadastro' : 'No sign-up'}
                </span>
              </div>
              <Button
                onClick={() => navigate(localPath('/diagnostic'))}
                className="text-sm h-11 px-6 bg-[image:var(--color-brand-gradient)] hover:opacity-90 shadow-lg shadow-brand-violet/30"
              >
                {isPt ? 'Fazer diagnóstico grátis' : 'Get free diagnostic'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DiagnosticCTASection;