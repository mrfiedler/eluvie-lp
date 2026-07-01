import { useMemo, useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGeolocation, type Currency } from '@/hooks/useGeolocation';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, ArrowRight } from 'lucide-react';

type PlanKey = 'solo' | 'standard' | 'studio';

const PLAN_PRICES: Record<PlanKey, Record<Currency, number>> = {
  solo: { BRL: 0, USD: 0, EUR: 0 },
  standard: { BRL: 73.5, USD: 59, EUR: 57 },
  studio: { BRL: 129, USD: 99, EUR: 99 },
};

const HOURLY_RATE: Record<Currency, number> = { BRL: 80, USD: 15, EUR: 14 };

const SYMBOL: Record<Currency, string> = { BRL: 'R$', USD: '$', EUR: '€' };

const formatMoney = (value: number, currency: Currency, language: string) => {
  const locale = currency === 'BRL' ? 'pt-BR' : currency === 'EUR' ? 'de-DE' : 'en-US';
  return `${SYMBOL[currency]} ${value.toLocaleString(locale, {
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
};

const SavingsCalculatorSection = () => {
  const { language, localPath } = useLanguage();
  const navigate = useNavigate();
  const { currency } = useGeolocation();
  const isPt = language === 'pt-BR';

  const [processes, setProcesses] = useState(3);
  const [hours, setHours] = useState(8);
  const [plan, setPlan] = useState<PlanKey>('standard');

  const annualLost = useMemo(() => hours * HOURLY_RATE[currency] * 52, [hours, currency]);
  const annualPlan = useMemo(() => PLAN_PRICES[plan][currency] * 12, [plan, currency]);
  const savings = annualLost - annualPlan;

  const planLabels: Record<PlanKey, { en: string; pt: string }> = {
    solo: { en: 'Solo', pt: 'Solo' },
    standard: { en: 'Standard', pt: 'Standard' },
    studio: { en: 'Studio', pt: 'Studio' },
  };

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-[#1a1a1a] via-[#181420] to-[#1a1a1a]">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            {isPt ? 'Quanto você está perdendo sem a Eluvie?' : 'How much is disorganization costing you?'}
          </h2>
          <p className="text-gray-300 md:text-lg">
            {isPt
              ? 'Descubra em segundos quanto custa a desorganização financeira do seu negócio criativo.'
              : 'Find out in seconds what financial chaos is really costing your creative business.'}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 bg-[#202020]/60 backdrop-blur border border-[#8e60e5]/20 rounded-3xl p-6 md:p-10 shadow-2xl">
          {/* Controles */}
          <div className="space-y-8">
            <div>
              <div className="flex items-baseline justify-between mb-2">
                <label className="text-sm font-medium text-white">
                  {isPt ? 'Quantos processos você ainda faz manualmente?' : 'How many processes do you still manage manually?'}
                </label>
                <span className="text-2xl font-bold text-[#d64ec2]">{processes}</span>
              </div>
              <p className="text-xs text-gray-400 mb-3">
                {isPt
                  ? 'Pense em: fluxo de caixa, gestão de contratos, orçamentos em andamento e controle de clientes recorrentes.'
                  : 'Think about: cash flow, contract management, open quotes and recurring client tracking.'}
              </p>
              <Slider min={1} max={4} step={1} value={[processes]} onValueChange={(v) => setProcesses(v[0])} />
            </div>

            <div>
              <div className="flex items-baseline justify-between mb-2">
                <label className="text-sm font-medium text-white">
                  {isPt ? 'Horas por semana perdidas com gestão manual' : 'Hours per week lost to manual management'}
                </label>
                <span className="text-2xl font-bold text-[#d64ec2]">{hours}h</span>
              </div>
              <Slider min={1} max={20} step={1} value={[hours]} onValueChange={(v) => setHours(v[0])} />
            </div>

            <div>
              <label className="text-sm font-medium text-white block mb-3">
                {isPt ? 'Plano Eluvie' : 'Eluvie Plan'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['solo', 'standard', 'studio'] as PlanKey[]).map((p) => {
                  const price = PLAN_PRICES[p][currency];
                  const selected = plan === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPlan(p)}
                      className={`rounded-xl border p-3 text-left transition-all ${
                        selected
                          ? 'border-[#ac2ee8] bg-[#ac2ee8]/15 ring-2 ring-[#ac2ee8]/40'
                          : 'border-gray-700 bg-[#1a1a1a] hover:border-gray-600'
                      }`}
                    >
                      <div className="text-sm font-semibold text-white">{planLabels[p][isPt ? 'pt' : 'en']}</div>
                      <div className={`text-xs mt-1 ${selected ? 'text-[#d64ec2]' : 'text-gray-400'}`}>
                        {price === 0 ? (isPt ? 'Grátis' : 'Free') : `${formatMoney(price, currency, language)}/mo`}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Resultado */}
          <div className="bg-[#1a1a1a] border border-[#8e60e5]/30 rounded-2xl p-6 md:p-8 flex flex-col justify-between">
            <div className="space-y-5">
              <div>
                <div className="text-xs uppercase tracking-wide text-gray-400 mb-1">
                  {isPt ? 'Custo anual da desorganização (em horas perdidas)' : 'Annual cost of disorganization (in lost hours)'}
                </div>
                <div className="text-2xl md:text-3xl font-bold text-brand-magenta transition-all">
                  {formatMoney(annualLost, currency, language)}
                </div>
              </div>

              <div>
                <div className="text-xs uppercase tracking-wide text-gray-400 mb-1">
                  {isPt ? 'Investimento anual na Eluvie' : 'Annual investment in Eluvie'}
                </div>
                <div className="text-xl md:text-2xl font-semibold text-gray-300">
                  {annualPlan === 0 ? (isPt ? 'Grátis' : 'Free') : formatMoney(annualPlan, currency, language)}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-800">
                <div className="text-xs uppercase tracking-wide text-gray-400 mb-1">
                  {isPt ? 'Sua economia estimada por ano' : 'Your estimated annual savings'}
                </div>
                {savings > 0 ? (
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-7 w-7 text-brand-violet" />
                    <span className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-brand-gradient transition-all">
                      {formatMoney(savings, currency, language)}
                    </span>
                  </div>
                ) : (
                  <p className="text-base text-gray-300 italic">
                    {isPt
                      ? 'Com poucos processos manuais, o maior ganho é o tempo de volta para criar.'
                      : 'With few manual processes, the biggest gain is getting time back to create.'}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-8">
              <Button
                asChild
                size="lg"
                className="w-full text-base py-6 shadow-lg shadow-brand-violet/30"
              >
                <a href="https://www.eluvie.app/">
                  {isPt ? 'Começar grátis agora' : 'Start for free now'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <p className="text-xs text-gray-400 text-center mt-3">
                {isPt ? 'Sem cartão de crédito. Sem compromisso.' : 'No credit card. No commitment.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SavingsCalculatorSection;
