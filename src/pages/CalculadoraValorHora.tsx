import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGeolocation } from '@/hooks/useGeolocation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Calculator, Share2, MessageCircle, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

type Lang = 'en' | 'pt-BR';
const tx = (lang: Lang, pt: string, en: string) => (lang === 'pt-BR' ? pt : en);

const SITE_URL = 'https://www.eluvie.com';
const PATH = '/calculadora-valor-hora';

const WHATSAPP = '5554991411584';

interface CalcState {
  rent: number;
  tools: number;
  taxes: number;
  other: number;
  hoursPerDay: number;
  daysPerMonth: number;
  billablePct: number;
  profit: number;
  currentRate: number;
  recurring: 'yes' | 'no' | 'starting' | '';
}

const DEFAULT_STATE: CalcState = {
  rent: 0,
  tools: 0,
  taxes: 0,
  other: 0,
  hoursPerDay: 8,
  daysPerMonth: 22,
  billablePct: 65,
  profit: 0,
  currentRate: 0,
  recurring: '',
};

const parseNum = (v: string): number => {
  const n = Number(String(v).replace(/[^\d.,-]/g, '').replace(',', '.'));
  return isFinite(n) ? n : 0;
};

const CalculadoraValorHora = () => {
  const { language } = useLanguage();
  const lang = language as Lang;
  const { currency } = useGeolocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const symbol = currency === 'BRL' ? 'R$' : currency === 'EUR' ? '€' : '$';
  const localeFmt = currency === 'BRL' ? 'pt-BR' : currency === 'EUR' ? 'de-DE' : 'en-US';

  // Load from URL params if present
  const initial: CalcState = useMemo(() => {
    const s = { ...DEFAULT_STATE };
    const keys: (keyof CalcState)[] = [
      'rent','tools','taxes','other','hoursPerDay','daysPerMonth','billablePct','profit','currentRate',
    ];
    keys.forEach((k) => {
      const v = searchParams.get(k);
      if (v != null) (s as any)[k] = parseNum(v);
    });
    const r = searchParams.get('recurring');
    if (r === 'yes' || r === 'no' || r === 'starting') s.recurring = r;
    return s;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [state, setState] = useState<CalcState>(initial);

  const update = (patch: Partial<CalcState>) => setState((s) => ({ ...s, ...patch }));

  // Derived calculations
  const fixedCosts = state.rent + state.tools + state.taxes + state.other;
  const totalHours = Math.max(0, state.hoursPerDay * state.daysPerMonth);
  const billableHours = Math.max(1, totalHours * (state.billablePct / 100));
  const costPerHour = fixedCosts / billableHours;
  const minRate = costPerHour; // mínimo sem lucro
  const idealRate = (fixedCosts + state.profit) / billableHours;
  const estMonthlyRevenue = idealRate * billableHours;

  const undercharging = state.currentRate > 0 && idealRate > 0
    ? Math.max(0, ((idealRate - state.currentRate) / idealRate) * 100)
    : 0;

  // Lead temperature
  type Temp = 'cold' | 'warm' | 'hot';
  const temp: Temp = (() => {
    if (state.recurring === 'yes') return 'hot';
    if (state.recurring === 'starting') return 'cold';
    if (estMonthlyRevenue >= 10000) return 'hot';
    if (estMonthlyRevenue >= 3000) return 'warm';
    return 'cold';
  })();

  // SEO
  useEffect(() => {
    const title = tx(lang,
      'Calculadora de valor/hora para criativos | Eluvie',
      'Hourly rate calculator for creative businesses | Eluvie');
    const desc = tx(lang,
      'Descubra quanto cobrar por hora com base nos custos reais da sua agência, estúdio ou operação criativa.',
      'Find out what to charge per hour based on the real costs of your agency, studio or creative operation.');
    const selfPath = lang === 'en' ? '/en/hourly-rate-calculator' : PATH;
    const selfUrl = SITE_URL + selfPath;
    document.title = title;

    const setMeta = (sel: string, attr: string, val: string) => {
      let el = document.head.querySelector(sel) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        const [type, name] = sel.replace(/[\[\]"]/g, '').split('=');
        el.setAttribute(type, name);
        document.head.appendChild(el);
      }
      el.setAttribute(attr, val);
    };
    const setLink = (rel: string, href: string) => {
      let el = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
      }
      el.setAttribute('href', href);
    };
    setMeta('meta[name="description"]', 'content', desc);
    setMeta('meta[property="og:title"]', 'content', title);
    setMeta('meta[property="og:description"]', 'content', desc);
    setMeta('meta[property="og:url"]', 'content', selfUrl);
    setMeta('meta[property="og:type"]', 'content', 'website');
    setLink('canonical', selfUrl);

    // FAQ JSON-LD
    const faqs = getFaqs(lang);
    const data = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    };
    let script = document.getElementById('ld-faq-calc') as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = 'ld-faq-calc';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);

    return () => {
      const s = document.getElementById('ld-faq-calc');
      if (s) s.remove();
    };
  }, [lang]);

  const fmt = (n: number) => {
    if (!isFinite(n) || n <= 0) return `${symbol} 0`;
    return `${symbol} ${n.toLocaleString(localeFmt, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const handleShare = async () => {
    const params = new URLSearchParams();
    (['rent','tools','taxes','other','hoursPerDay','daysPerMonth','billablePct','profit','currentRate'] as const)
      .forEach((k) => {
        if ((state as any)[k]) params.set(k, String((state as any)[k]));
      });
    if (state.recurring) params.set('recurring', state.recurring);
    setSearchParams(params, { replace: true });
    const url = `${window.location.origin}${PATH}?${params.toString()}`;
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: tx(lang, 'Link copiado!', 'Link copied!'),
        description: tx(lang, 'Cole onde quiser para compartilhar ou salvar.', 'Paste anywhere to share or save.'),
      });
    } catch {
      toast({
        title: tx(lang, 'Copie o link', 'Copy the link'),
        description: url,
      });
    }
  };

  const whatsappHotMessage = encodeURIComponent(
    tx(lang,
      'Oi! Usei a calculadora de valor/hora da Eluvie. Tenho clientes recorrentes e quero entender como a plataforma pode organizar meu financeiro.',
      "Hi! I used Eluvie's hourly rate calculator. I have recurring clients and want to understand how the platform can organize my finances.")
  );
  const whatsappHotUrl = `https://wa.me/${WHATSAPP}?text=${whatsappHotMessage}`;
  const whatsappSpecialistUrl = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
    tx(lang, 'Quero falar com um especialista da Eluvie.', "I'd like to talk to an Eluvie specialist.")
  )}`;

  // ---- Cold lead email opt-in ----
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const submitEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast({ title: tx(lang, 'E-mail inválido', 'Invalid email'), variant: 'destructive' });
      return;
    }
    setEmailSent(true);
    toast({
      title: tx(lang, 'Pronto!', 'Done!'),
      description: tx(lang, 'Em breve você receberá dicas de precificação.', "You'll soon receive pricing tips."),
    });
  };

  // ---- Inputs labels ----
  const L = {
    hero: {
      h1: tx(lang, 'Quanto você deveria cobrar por hora?', 'What should you charge per hour?'),
      sub: tx(lang,
        'A calculadora gratuita que usa seus custos reais para descobrir seu valor/hora ideal, e ainda qualifica se você está cobrando abaixo do mercado.',
        "The free calculator that uses your real costs to find your ideal hourly rate, and shows if you're undercharging."),
    },
    hook: tx(lang,
      `Você cobra ${symbol}80 por hora porque "parece justo". Mas justo para quem? Sem contar seus custos fixos, horas não produtivas e margem de lucro, você provavelmente está trabalhando no prejuízo sem perceber. Esta calculadora muda isso em 2 minutos.`,
      `You charge ${symbol}20/hour because it "feels right". But right for who? Without accounting for fixed costs, non-billable hours and profit margin, you're probably working at a loss without realizing it. This calculator changes that in 2 minutes.`),
    calc: {
      title: tx(lang, 'Calcule seu valor/hora ideal', 'Calculate your ideal hourly rate'),
      sub: tx(lang, 'Preencha com seus números reais', 'Fill in with your real numbers'),
      blockA: tx(lang, 'Custos mensais', 'Monthly costs'),
      blockB: tx(lang, 'Horas produtivas', 'Productive hours'),
      blockC: tx(lang, 'Margem desejada', 'Desired profit'),
      blockD: tx(lang, 'Qualificação', 'Qualification'),
      rent: tx(lang, 'Aluguel ou home office', 'Rent or home office'),
      tools: tx(lang, 'Internet, telefone, ferramentas e softwares', 'Internet, phone, tools and software'),
      taxes: tx(lang,
        `Impostos e contador (MEI: ~${symbol}70/mês)`,
        'Taxes and accountant'),
      other: tx(lang, 'Outros custos fixos', 'Other fixed costs'),
      hoursPerDay: tx(lang, 'Quantas horas por dia você trabalha?', 'How many hours per day do you work?'),
      daysPerMonth: tx(lang, 'Quantos dias por mês?', 'How many days per month?'),
      billable: tx(lang, 'Quantos % do seu tempo é realmente faturável?', 'What % of your time is actually billable?'),
      billableHelp: tx(lang,
        'Desconte reuniões, prospecção, admin, em média 30 a 40% do tempo é não faturável.',
        'Discount meetings, prospecting, admin, on average 30 to 40% is non-billable.'),
      profit: tx(lang, 'Quanto você quer lucrar por mês além dos custos?', 'How much profit do you want per month beyond costs?'),
      currentRate: tx(lang, 'Quanto você cobra atualmente por hora? (opcional)', 'What do you charge per hour today? (optional)'),
      recurringQ: tx(lang, 'Você tem clientes com contratos mensais recorrentes?', 'Do you have clients with recurring monthly contracts?'),
      yes: tx(lang, 'Sim, tenho', 'Yes, I do'),
      no: tx(lang, 'Não ainda', 'Not yet'),
      starting: tx(lang, 'Estou começando', "I'm just starting"),
    },
    result: {
      title: tx(lang, 'Seu resultado', 'Your result'),
      cost: tx(lang, 'Seu custo/hora real', 'Your real cost/hour'),
      min: tx(lang, 'Valor/hora mínimo (sem lucro)', 'Minimum hourly rate (no profit)'),
      ideal: tx(lang, 'Valor/hora ideal', 'Ideal hourly rate'),
      share: tx(lang, 'Compartilhar resultado', 'Share result'),
      undercharging: (p: number) => tx(lang,
        `Você está cobrando ${p.toFixed(0)}% abaixo do ideal.`,
        `You're charging ${p.toFixed(0)}% below the ideal.`),
      emptyHint: tx(lang,
        'Preencha os campos ao lado para ver seu valor ideal.',
        'Fill in the fields to see your ideal rate.'),
    },
    lead: {
      coldText: tx(lang,
        'Você está na fase de estruturação. O próximo passo é garantir que cada real que entra está sendo registrado.',
        "You're in the structuring phase. The next step is making sure every dollar coming in is being recorded."),
      coldCta: tx(lang, 'Receber dicas de precificação por e-mail', 'Get pricing tips by email'),
      warmText: tx(lang,
        'Você já tem uma operação rodando. Com esse volume, controlar manualmente começa a custar caro em tempo e erros.',
        'You already have an operation running. At this volume, manual control starts costing you in time and errors.'),
      warmCta: tx(lang, 'Ver como a Eluvie organiza isso pra você', 'See how Eluvie organizes this for you'),
      hotText: tx(lang,
        'Com clientes recorrentes nesse ticket, cada contrato não controlado é dinheiro saindo pelo ralo. A Eluvie controla automaticamente os lançamentos mensais de cada cliente.',
        'With recurring clients at this level, every uncontrolled contract is money slipping away. Eluvie automatically tracks each client\'s monthly entries.'),
      hotCta: tx(lang, 'Falar com a Eluvie no WhatsApp', 'Talk to Eluvie on WhatsApp'),
    },
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <Navbar />

      {/* HERO */}
      <section className="pt-32 pb-12 px-4 md:px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-violet/15 border border-brand-violet/30 mb-6">
            <Calculator className="w-4 h-4 text-brand-violet" />
            <span className="text-xs font-medium text-brand-violet">
              {tx(lang, 'Ferramenta gratuita', 'Free tool')}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-brand-violet via-brand-purple to-brand-magenta bg-clip-text text-transparent">
              {L.hero.h1}
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {L.hero.sub}
          </p>
        </div>
      </section>

      {/* HOOK */}
      <section className="px-4 md:px-6 pb-12">
        <div className="container mx-auto max-w-3xl">
          <div className="bg-[#222] border border-gray-800 rounded-2xl p-6 md:p-8 text-gray-300 leading-relaxed text-base md:text-lg">
            {L.hook}
          </div>
        </div>
      </section>

      {/* CALCULATOR */}
      <section className="px-4 md:px-6 pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">{L.calc.title}</h2>
            <p className="text-gray-400">{L.calc.sub}</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* INPUTS */}
            <div className="space-y-8">
              <CalcBlock title={L.calc.blockA}>
                <NumberField label={L.calc.rent} symbol={symbol} value={state.rent} onChange={(v) => update({ rent: v })} />
                <NumberField label={L.calc.tools} symbol={symbol} value={state.tools} onChange={(v) => update({ tools: v })} />
                <NumberField label={L.calc.taxes} symbol={symbol} value={state.taxes} onChange={(v) => update({ taxes: v })} />
                <NumberField label={L.calc.other} symbol={symbol} value={state.other} onChange={(v) => update({ other: v })} />
              </CalcBlock>

              <CalcBlock title={L.calc.blockB}>
                <NumberField label={L.calc.hoursPerDay} value={state.hoursPerDay} onChange={(v) => update({ hoursPerDay: v })} />
                <NumberField label={L.calc.daysPerMonth} value={state.daysPerMonth} onChange={(v) => update({ daysPerMonth: v })} />
                <NumberField label={L.calc.billable} suffix="%" value={state.billablePct} onChange={(v) => update({ billablePct: v })} />
                <p className="text-xs text-gray-500 -mt-2">{L.calc.billableHelp}</p>
              </CalcBlock>

              <CalcBlock title={L.calc.blockC}>
                <NumberField label={L.calc.profit} symbol={symbol} value={state.profit} onChange={(v) => update({ profit: v })} />
                <NumberField label={L.calc.currentRate} symbol={symbol} value={state.currentRate} onChange={(v) => update({ currentRate: v })} />
              </CalcBlock>

              <CalcBlock title={L.calc.blockD}>
                <p className="text-sm text-gray-300 mb-3">{L.calc.recurringQ}</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {([['yes', L.calc.yes], ['no', L.calc.no], ['starting', L.calc.starting]] as const).map(([v, label]) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => update({ recurring: v })}
                      className={`px-4 py-2 rounded-lg border text-sm transition-all ${
                        state.recurring === v
                          ? 'border-brand-violet bg-brand-violet/15 text-white'
                          : 'border-gray-700 text-gray-300 hover:border-gray-500'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </CalcBlock>
            </div>

            {/* RESULT */}
            <div className="lg:sticky lg:top-24 self-start">
              <div className="rounded-2xl p-[1px] bg-gradient-to-br from-brand-violet via-brand-purple to-brand-magenta">
                <div className="bg-[#1a1a1a] rounded-2xl p-6 md:p-8">
                  <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-brand-violet" />
                    {L.result.title}
                  </h3>

                  {fixedCosts === 0 && state.profit === 0 ? (
                    <p className="text-gray-400 text-sm">{L.result.emptyHint}</p>
                  ) : (
                    <div className="space-y-5">
                      <ResultRow label={L.result.cost} value={fmt(costPerHour)} />
                      <ResultRow label={L.result.min} value={fmt(minRate)} />

                      <div className="pt-4 border-t border-gray-800">
                        <p className="text-sm text-gray-400 mb-1">{L.result.ideal}</p>
                        <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-brand-violet to-brand-magenta bg-clip-text text-transparent">
                          {fmt(idealRate)}
                        </p>
                      </div>

                      {undercharging > 0 && (
                        <div className="mt-4 p-3 rounded-lg bg-brand-magenta/10 border border-brand-magenta/30 text-sm text-brand-magenta">
                          {L.result.undercharging(undercharging)}
                        </div>
                      )}

                      <Button
                        type="button"
                        variant="brandSecondary"
                        size="sm"
                        onClick={handleShare}
                        className="mt-4"
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        {L.result.share}
                      </Button>

                      {/* Lead temperature CTA */}
                      <div className="mt-6 pt-6 border-t border-gray-800">
                        {temp === 'cold' && (
                          <div>
                            <p className="text-sm text-gray-300 mb-3">{L.lead.coldText}</p>
                            {emailSent ? (
                              <div className="flex items-center gap-2 text-brand-violet text-sm">
                                <CheckCircle2 className="w-4 h-4" />
                                {tx(lang, 'Inscrito com sucesso!', 'Successfully subscribed!')}
                              </div>
                            ) : (
                              <form onSubmit={submitEmail} className="flex flex-col sm:flex-row gap-2">
                                <Input
                                  type="email"
                                  placeholder={tx(lang, 'seu@email.com', 'your@email.com')}
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  className="bg-[#222] border-gray-700 text-white"
                                  maxLength={255}
                                />
                                <Button type="submit" variant="brand" size="sm">
                                  {L.lead.coldCta}
                                </Button>
                              </form>
                            )}
                          </div>
                        )}
                        {temp === 'warm' && (
                          <div>
                            <p className="text-sm text-gray-300 mb-3">{L.lead.warmText}</p>
                            <Button asChild variant="brand" size="sm">
                              <a href="/">
                                {L.lead.warmCta} <ArrowRight className="w-4 h-4 ml-2" />
                              </a>
                            </Button>
                          </div>
                        )}
                        {temp === 'hot' && (
                          <div>
                            <p className="text-sm text-gray-300 mb-3">{L.lead.hotText}</p>
                            <Button asChild variant="brand" size="sm">
                              <a
                                href={`${whatsappHotUrl}&lead=quente&origem=calculadora-hora`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <MessageCircle className="w-4 h-4 mr-2" />
                                {L.lead.hotCta}
                              </a>
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEO CONTENT */}
      <section className="px-4 md:px-6 pb-20">
        <div className="container mx-auto max-w-3xl prose prose-invert">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            {tx(lang, 'Por que a maioria dos freelancers cobra errado', 'Why most freelancers price it wrong')}
          </h2>

          <h3 className="text-xl font-semibold mt-8 mb-3 text-white">
            {tx(lang, 'O erro mais comum: cobrar pelo que acha justo', 'The most common mistake: charging what feels fair')}
          </h3>
          <p className="text-gray-300 leading-relaxed">
            {tx(lang,
              'A precificação por intuição é o atalho que sai mais caro. Sem números, você ancora o preço em comparações com colegas, em propostas antigas ou no medo de perder o cliente. O resultado é uma operação que parece saudável no caixa, mas consome suas horas sem deixar margem para crescer. Usar custo real é o único método sustentável.',
              'Pricing by gut feeling is the shortcut that costs the most. Without numbers, you anchor on peer comparisons, old proposals or fear of losing the client. The result is an operation that looks healthy in cash, but eats your hours without leaving margin to grow. Real-cost pricing is the only sustainable method.')}
          </p>

          <h3 className="text-xl font-semibold mt-10 mb-3 text-white">
            {tx(lang, 'Os 3 componentes do valor/hora real', 'The 3 components of a real hourly rate')}
          </h3>
          <ol className="text-gray-300 space-y-2 list-decimal pl-6 leading-relaxed">
            <li>{tx(lang, 'Custo de operação (fixos + variáveis)', 'Operating cost (fixed + variable)')}</li>
            <li>{tx(lang, 'Horas realmente produtivas (não confundir com horas trabalhadas)', 'Truly productive hours (not the same as hours worked)')}</li>
            <li>{tx(lang, 'Margem de lucro desejada', 'Desired profit margin')}</li>
          </ol>

          <h3 className="text-xl font-semibold mt-10 mb-3 text-white">
            {tx(lang, 'A armadilha dos clientes recorrentes mal precificados', 'The trap of mispriced recurring clients')}
          </h3>
          <p className="text-gray-300 leading-relaxed">
            {tx(lang,
              `Quando você fecha um contrato de social media por ${symbol}1.500/mês, parece bom. Mas se você não sabe exatamente quantas horas está dedicando a esse cliente, em 6 meses pode descobrir que está ganhando ${symbol}20/hora, abaixo do salário mínimo.`,
              `When you close a social media contract for ${symbol}1,500/month, it looks great. But if you don't know exactly how many hours you're spending on that client, in 6 months you may find you're making ${symbol}20/hour, below minimum wage.`)}
          </p>
          <p className="text-gray-300 leading-relaxed mt-3">
            {tx(lang,
              'A Eluvie conecta seus contratos recorrentes ao financeiro automaticamente: você vê o que cada cliente representa no seu faturamento mensal, sem precisar calcular na mão.',
              'Eluvie connects your recurring contracts to your financials automatically: you see what each client represents in monthly revenue, without manual math.')}
          </p>
          <Button asChild variant="brand" size="sm" className="mt-4">
            <a href="/">
              {tx(lang, 'Ver demonstração da Eluvie', 'See an Eluvie demo')}
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </Button>

          <h3 className="text-xl font-semibold mt-10 mb-3 text-white">
            {tx(lang, 'Como reajustar seus preços sem perder clientes', 'How to raise prices without losing clients')}
          </h3>
          <p className="text-gray-300 leading-relaxed">
            {tx(lang,
              'Reajuste de forma gradual, comunique com antecedência mínima de 30 dias, ancore o novo preço em entregas e resultados (não em custos seus), e ofereça uma janela curta de transição para contratos antigos. Clientes que valorizam o trabalho aceitam; os que saem provavelmente já eram pouco rentáveis.',
              'Raise gradually, communicate at least 30 days in advance, anchor the new price in outcomes (not your costs), and offer a short transition window for old contracts. Clients who value the work stay; those who leave were likely unprofitable anyway.')}
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 md:px-6 pb-20">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            {tx(lang, 'Perguntas frequentes', 'Frequently asked questions')}
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {getFaqs(lang).map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-gray-800">
                <AccordionTrigger className="text-left text-white hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 leading-relaxed">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-4 md:px-6 pb-24">
        <div className="container mx-auto max-w-5xl">
          <div className="rounded-3xl p-8 md:p-14 text-center relative overflow-hidden"
               style={{ background: 'linear-gradient(135deg, rgba(172,46,232,0.18), rgba(142,96,229,0.12), rgba(214,78,194,0.18))' }}>
            <div className="absolute inset-0 border border-brand-violet/30 rounded-3xl pointer-events-none" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4 relative">
              {tx(lang,
                'Agora que você sabe quanto vale, garanta que está recebendo tudo.',
                "Now that you know what you're worth, make sure you're getting paid for all of it.")}
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto mb-8 relative">
              {tx(lang,
                'A Eluvie controla todos os seus contratos e recebimentos em um único painel, para você parar de adivinhar e começar a crescer.',
                'Eluvie tracks all your contracts and payments in one dashboard, so you can stop guessing and start growing.')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center relative">
              <Button asChild variant="brand" size="lg">
                <a href="https://www.eluvie.app/">
                  {tx(lang, 'Começar grátis', 'Start free')}
                </a>
              </Button>
              <Button asChild variant="brandSecondary" size="lg">
                <a href={whatsappSpecialistUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  {tx(lang, 'Falar com especialista', 'Talk to a specialist')}
                </a>
              </Button>
            </div>
            <p className="text-xs text-gray-400 mt-6 relative">
              {tx(lang, 'Sem cartão de crédito. Sem compromisso.', 'No credit card. No commitment.')}
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

// --- Subcomponents ---
const CalcBlock = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-[#222] border border-gray-800 rounded-xl p-5 md:p-6">
    <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-violet mb-4">{title}</h3>
    <div className="space-y-4">{children}</div>
  </div>
);

const NumberField = ({
  label, value, onChange, symbol, suffix,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  symbol?: string;
  suffix?: string;
}) => (
  <label className="block">
    <span className="block text-sm text-gray-300 mb-1.5">{label}</span>
    <div className="relative">
      {symbol && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">
          {symbol}
        </span>
      )}
      <Input
        type="number"
        inputMode="decimal"
        min={0}
        value={value === 0 ? '' : value}
        onChange={(e) => onChange(parseNum(e.target.value))}
        className={`bg-[#1a1a1a] border-gray-700 text-white ${symbol ? 'pl-9' : ''} ${suffix ? 'pr-9' : ''}`}
      />
      {suffix && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">
          {suffix}
        </span>
      )}
    </div>
  </label>
);

const ResultRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-baseline justify-between gap-4">
    <span className="text-sm text-gray-400">{label}</span>
    <span className="text-lg font-semibold text-white">{value}</span>
  </div>
);

// --- FAQ data ---
const getFaqs = (lang: Lang) => {
  if (lang === 'pt-BR') {
    return [
      { q: 'Como calcular o valor da hora trabalhada?', a: 'Some todos os seus custos fixos mensais (aluguel, ferramentas, impostos), some a margem de lucro que deseja, e divida pelo número de horas faturáveis no mês. Horas faturáveis ≠ horas trabalhadas: tipicamente 60-70% do total.' },
      { q: 'Quanto cobrar por hora como freelancer?', a: 'Não existe valor universal. O valor correto é aquele que cobre seus custos reais, paga sua margem de lucro e respeita as horas que você realmente consegue faturar por mês. Use a calculadora acima para chegar ao seu número exato.' },
      { q: 'Como saber se estou cobrando muito barato?', a: 'Se você trabalha mais de 40h por semana e ainda assim não sobra dinheiro no fim do mês, ou se sua hora atual é menor do que o valor calculado com base nos seus custos, você está cobrando abaixo do mercado.' },
      { q: 'Vale a pena ter cliente com contrato mensal fixo?', a: 'Sim, recorrência traz previsibilidade, mas só se for bem precificada. Um contrato mensal mal calculado pode te trancar em horas a fio por um valor abaixo do ideal. Sempre meça quantas horas o cliente consome.' },
      { q: 'Como reajustar meus preços sem perder clientes?', a: 'Reajuste gradualmente, comunique com 30 dias de antecedência, justifique pelo valor entregue (não pelos seus custos) e ofereça uma janela de transição. Clientes que valorizam ficam.' },
      { q: 'Qual a diferença entre horas trabalhadas e horas faturáveis?', a: 'Horas trabalhadas incluem reuniões, prospecção, e-mails, admin. Horas faturáveis são apenas aquelas que vão diretamente para um projeto pago. Em média, apenas 60-70% do tempo é faturável.' },
      { q: 'Como controlar quanto cada cliente me paga por mês?', a: 'O ideal é centralizar todos os contratos em uma só ferramenta com lançamentos automáticos. A Eluvie faz isso: conecta seus contratos recorrentes ao seu financeiro e mostra automaticamente o quanto cada cliente representa no seu faturamento mensal.' },
    ];
  }
  return [
    { q: 'How do I calculate my hourly rate?', a: 'Add all your fixed monthly costs (rent, tools, taxes), add the profit margin you want, and divide by your billable hours per month. Billable hours ≠ hours worked: typically 60-70% of the total.' },
    { q: 'How much should I charge per hour as a freelancer?', a: "There's no universal number. The right rate covers your real costs, pays your profit margin, and respects the hours you actually bill per month. Use the calculator above to find your exact number." },
    { q: "How do I know if I'm charging too little?", a: "If you work over 40 hours a week and still have no money left at month-end, or your current rate is below what your costs require, you're charging below market." },
    { q: 'Are recurring monthly contracts worth it?', a: 'Yes, recurring revenue brings predictability, but only if priced well. A poorly calculated monthly contract can lock you into endless hours for less than ideal pay. Always track hours per client.' },
    { q: 'How can I raise prices without losing clients?', a: 'Raise gradually, communicate 30 days ahead, justify by value delivered (not your costs), and offer a transition window. Clients who value you stay.' },
    { q: 'What is the difference between hours worked and billable hours?', a: 'Hours worked include meetings, prospecting, emails, admin. Billable hours are only those that go directly into a paid project. On average, only 60-70% of time is billable.' },
    { q: 'How do I track how much each client pays me monthly?', a: 'The ideal approach is to centralize all contracts in one tool with automatic entries. Eluvie does exactly this: it connects your recurring contracts to your financials and automatically shows how much each client represents in your monthly revenue.' },
  ];
};

export default CalculadoraValorHora;