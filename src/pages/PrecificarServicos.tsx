import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Target, ArrowRight, MessageCircle, Sparkles, Calculator, FileText } from 'lucide-react';

type Lang = 'en' | 'pt-BR';
const tx = (lang: Lang, pt: string, en: string) => (lang === 'pt-BR' ? pt : en);

const SITE_URL = 'https://www.eluvie.com';
const PATH = '/precificar-servicos';
const WHATSAPP = '5554991411584';

type Q1 = 'project' | 'recurring' | 'hourly' | 'mix' | '';
type Q2 = 'lt1k' | '1to5k' | '5to15k' | 'gt15k' | '';
type Q3 = '1to3' | '4to8' | '9to15' | 'gt15' | '';
type Q4 = 'noprice' | 'cheap' | 'lose' | 'control' | '';

const PrecificarServicos = () => {
  const { language } = useLanguage();
  const lang = language as Lang;

  const [q1, setQ1] = useState<Q1>('');
  const [q2, setQ2] = useState<Q2>('');
  const [q3, setQ3] = useState<Q3>('');
  const [q4, setQ4] = useState<Q4>('');

  const allAnswered = !!(q1 && q2 && q3 && q4);

  type Temp = 'cold' | 'warm' | 'hot';
  const temp: Temp | null = (() => {
    if (!allAnswered) return null;
    if (q1 === 'recurring' || q4 === 'control') return 'hot';
    if (q2 === 'gt15k' || q3 === 'gt15' || q3 === '9to15') return 'hot';
    if (q1 === 'project' && (q2 === '1to5k' || q2 === '5to15k') && (q3 === '4to8' || q3 === '9to15')) return 'warm';
    if (q4 === 'noprice' && (q2 === 'lt1k') && (q3 === '1to3')) return 'cold';
    if (q1 === 'hourly') return 'cold';
    return 'warm';
  })();

  const FAQS = getFaqs(lang);

  useEffect(() => {
    const title = tx(lang,
      'Como precificar serviços criativos: guia + diagnóstico grátis | Eluvie',
      'How to price creative services: guide + free diagnostic | Eluvie');
    const desc = tx(lang,
      'Os 3 métodos de precificação para freelancers e agências criativas, com diagnóstico interativo gratuito para descobrir qual funciona para você.',
      'The 3 pricing methods for creative freelancers and agencies, with a free interactive diagnostic to find what works for you.');
    document.title = title;
    document.documentElement.lang = lang === 'pt-BR' ? 'pt-BR' : 'en';

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
    setMeta('meta[property="og:url"]', 'content', SITE_URL + PATH);
    setMeta('meta[property="og:type"]', 'content', 'article');
    setLink('canonical', SITE_URL + PATH);

    const data = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQS.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    };
    let script = document.getElementById('ld-faq-precificar') as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = 'ld-faq-precificar';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
    return () => {
      const s = document.getElementById('ld-faq-precificar');
      if (s) s.remove();
    };
  }, [lang]);

  const whatsappHot = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
    tx(lang,
      'Oi! Fiz o diagnóstico de precificação da Eluvie. Tenho contratos recorrentes e quero entender como organizar melhor meu financeiro.',
      "Hi! I did Eluvie's pricing diagnostic. I have recurring contracts and want to understand how to better organize my finances.")
  )}&lead=quente&origem=precificar-servicos`;
  const whatsappSpecialist = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
    tx(lang, 'Quero falar com um especialista da Eluvie.', "I'd like to talk to an Eluvie specialist.")
  )}`;

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <Navbar />

      {/* HERO */}
      <section className="pt-32 pb-12 px-4 md:px-6">
        <div className="container mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-violet/15 border border-brand-violet/30 mb-6">
            <Target className="w-4 h-4 text-brand-violet" />
            <span className="text-xs font-medium text-brand-violet">
              {tx(lang, 'Guia + diagnóstico', 'Guide + diagnostic')}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-brand-violet via-brand-purple to-brand-magenta bg-clip-text text-transparent">
              {tx(lang,
                'Como precificar serviços criativos sem perder cliente nem dinheiro',
                'How to price creative services without losing clients or money')}
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
            {tx(lang,
              'Os 3 métodos que agências e freelancers usam para precificar com confiança, e o diagnóstico gratuito para descobrir qual funciona para o seu negócio.',
              'The 3 methods agencies and freelancers use to price with confidence, and the free diagnostic to find out which works for your business.')}
          </p>
        </div>
      </section>

      {/* HOOK */}
      <section className="px-4 md:px-6 pb-12">
        <div className="container mx-auto max-w-3xl">
          <div className="bg-[#222] border border-gray-800 rounded-2xl p-6 md:p-8 text-gray-300 leading-relaxed text-base md:text-lg">
            {tx(lang,
              "Você acabou de perder um cliente por cobrar 'caro demais'. Na semana passada, fechou um projeto por um valor que, na hora de entregar, percebeu que era barato demais.",
              "You just lost a client for charging 'too much'. Last week, you closed a project at a price that, on delivery, you realized was too cheap.")}
            <br /><br />
            <strong className="text-white">
              {tx(lang, 'Não é falta de talento. É falta de método.', "It's not lack of talent. It's lack of method.")}
            </strong>
            <br /><br />
            {tx(lang,
              'Este guia te dá os 3 métodos de precificação que profissionais criativos usam para cobrar com confiança, e um diagnóstico gratuito para descobrir qual se encaixa no seu modelo de negócio.',
              'This guide gives you the 3 pricing methods creative professionals use to charge with confidence, and a free diagnostic to find out which fits your business model.')}
          </div>
        </div>
      </section>

      {/* 3 METHODS */}
      <section className="px-4 md:px-6 pb-16">
        <article className="container mx-auto max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-10">
            {tx(lang, 'Os 3 métodos de precificação para serviços criativos', 'The 3 pricing methods for creative services')}
          </h2>

          {/* METHOD 1 */}
          <h3 className="text-2xl font-semibold mt-10 mb-4 text-white">
            {tx(lang, 'Método 1, Precificação por hora (valor/hora)', 'Method 1, Hourly pricing (rate/hour)')}
          </h3>
          <p className="text-gray-300 leading-relaxed">
            {tx(lang,
              'O método mais simples e o mais usado como base para os outros. Funciona bem para consultoria, suporte avulso e serviços com escopo aberto. O risco: se você não controla suas horas reais, vira armadilha.',
              'The simplest method and the foundation for the others. Works well for consulting, ad-hoc support and open-scope work. The risk: if you don\'t track real hours, it becomes a trap.')}
          </p>
          <div className="my-4 p-4 rounded-lg bg-[#222] border border-gray-800 text-sm text-gray-300 font-mono">
            {tx(lang,
              '(Custos fixos mensais + margem desejada) ÷ horas produtivas mensais = valor/hora mínimo',
              '(Monthly fixed costs + desired margin) ÷ monthly productive hours = minimum rate')}
          </div>
          <p className="text-gray-300 leading-relaxed">
            {tx(lang, 'Quer calcular o seu agora?', 'Want to calculate yours now?')}{' '}
            <Link to="/calculadora-valor-hora" className="text-brand-violet hover:text-brand-magenta underline">
              {tx(lang, 'Use a calculadora gratuita', 'Use the free calculator')}
            </Link>.
          </p>

          {/* METHOD 2 */}
          <h3 className="text-2xl font-semibold mt-12 mb-4 text-white">
            {tx(lang, 'Método 2, Precificação por projeto (escopo fechado)', 'Method 2, Project pricing (fixed scope)')}
          </h3>
          <p className="text-gray-300 leading-relaxed">
            {tx(lang,
              'Você define escopo, prazo e entregáveis, depois calcula. Recomendado adicionar 20 a 30% de margem de risco para imprevistos: revisões extras, escopo que cresce, atrasos do cliente.',
              'You define scope, deadline and deliverables, then calculate. Add 20 to 30% risk margin for unexpected issues: extra revisions, scope creep, client delays.')}
          </p>
          <div className="my-4 p-4 rounded-lg bg-[#222] border border-gray-800 text-sm text-gray-300 font-mono">
            {tx(lang,
              '(Horas estimadas × valor/hora) + margem de risco + custos variáveis = preço do projeto',
              '(Estimated hours × hourly rate) + risk margin + variable costs = project price')}
          </div>
          <p className="text-gray-300 leading-relaxed">
            {tx(lang,
              'Projetos fechados exigem controle de parcelas e prazos. Na Eluvie, quando você aprova um orçamento, a plataforma gera automaticamente os lançamentos financeiros futuros com as datas e valores de cada parcela, sem precisar lançar manualmente.',
              'Fixed projects require installment and deadline control. In Eluvie, when you approve a quote, the platform automatically generates the future financial entries with dates and amounts for each installment, without manual entry.')}
          </p>
          <Button asChild variant="brand" size="sm" className="mt-4">
            <a href="/">{tx(lang, 'Ver como funciona', 'See how it works')} <ArrowRight className="w-4 h-4 ml-2" /></a>
          </Button>

          {/* METHOD 3 */}
          <h3 className="text-2xl font-semibold mt-12 mb-4 text-white">
            {tx(lang, 'Método 3, Precificação por recorrência (retainer/assinatura)', 'Method 3, Recurring pricing (retainer/subscription)')}
          </h3>
          <p className="text-gray-300 leading-relaxed">
            {tx(lang,
              'O modelo mais previsível para social media, tráfego, design mensal e suporte. Cliente paga todo mês, você entrega um pacote de horas ou entregáveis recorrentes. Previsibilidade vale dinheiro, então pode (e deve) ser precificada.',
              'The most predictable model for social media, paid media, monthly design and support. Client pays monthly, you deliver a recurring package of hours or assets. Predictability is worth money, so it can (and should) be priced in.')}
          </p>
          <div className="my-4 p-4 rounded-lg bg-[#222] border border-gray-800 text-sm text-gray-300 font-mono">
            {tx(lang,
              '(Horas mensais estimadas × valor/hora) + margem + valor da previsibilidade = mensalidade ideal',
              '(Monthly estimated hours × hourly rate) + margin + predictability premium = ideal monthly fee')}
          </div>
          <p className="text-gray-300 leading-relaxed">
            {tx(lang,
              'Contratos recorrentes são a base da previsibilidade financeira, mas só se você souber exatamente quantos tem ativos, quem renova quando, e quem está atrasado.',
              'Recurring contracts are the base of financial predictability, but only if you know exactly how many are active, who renews when, and who is overdue.')}
          </p>
          <p className="text-gray-300 leading-relaxed mt-3">
            {tx(lang,
              'A Eluvie foi construída para isso: cada contrato recorrente gera lançamentos automáticos todo mês, e você vê em tempo real o que vai entrar e o que está pendente.',
              'Eluvie was built for this: each recurring contract generates automatic monthly entries, and you see in real time what is coming in and what is pending.')}
          </p>
          <Button asChild variant="brand" size="sm" className="mt-4">
            <a href="/">{tx(lang, 'Conhecer a Eluvie', 'Discover Eluvie')} <ArrowRight className="w-4 h-4 ml-2" /></a>
          </Button>
        </article>
      </section>

      {/* DIAGNOSTIC */}
      <section id="diagnostico" className="px-4 md:px-6 pb-20">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              {tx(lang, 'Qual método de precificação é o certo para você?', 'Which pricing method is right for you?')}
            </h2>
            <p className="text-gray-400">{tx(lang, 'Responda 4 perguntas e descubra', 'Answer 4 questions and find out')}</p>
          </div>

          <div className="bg-[#222] border border-gray-800 rounded-2xl p-6 md:p-8 space-y-8">
            <ToolQuestion
              number={1}
              question={tx(lang, 'Como você entrega seu serviço principal?', 'How do you deliver your main service?')}
              options={[
                { value: 'project', label: tx(lang, 'Projeto com início e fim definido', 'Project with defined start and end') },
                { value: 'recurring', label: tx(lang, 'Serviço mensal contínuo (social media, suporte, etc.)', 'Continuous monthly service (social, support, etc.)') },
                { value: 'hourly', label: tx(lang, 'Consultorias e horas avulsas', 'Consulting and ad-hoc hours') },
                { value: 'mix', label: tx(lang, 'Misto dos anteriores', 'Mix of the above') },
              ]}
              selected={q1}
              onSelect={(v) => setQ1(v as Q1)}
            />
            <ToolQuestion
              number={2}
              question={tx(lang, 'Qual é o seu ticket médio por cliente?', 'What is your average ticket per client?')}
              options={[
                { value: 'lt1k', label: tx(lang, 'Até R$1.000', 'Up to $200') },
                { value: '1to5k', label: tx(lang, 'R$1.000 a R$5.000', '$200 to $1,000') },
                { value: '5to15k', label: tx(lang, 'R$5.000 a R$15.000', '$1,000 to $3,000') },
                { value: 'gt15k', label: tx(lang, 'Acima de R$15.000', 'Above $3,000') },
              ]}
              selected={q2}
              onSelect={(v) => setQ2(v as Q2)}
            />
            <ToolQuestion
              number={3}
              question={tx(lang, 'Quantos clientes ativos você tem hoje?', 'How many active clients do you have today?')}
              options={[
                { value: '1to3', label: '1 a 3' },
                { value: '4to8', label: '4 a 8' },
                { value: '9to15', label: '9 a 15' },
                { value: 'gt15', label: tx(lang, 'Mais de 15', 'More than 15') },
              ]}
              selected={q3}
              onSelect={(v) => setQ3(v as Q3)}
            />
            <ToolQuestion
              number={4}
              question={tx(lang, 'Qual é sua maior dor hoje na precificação?', 'What is your biggest pricing pain today?')}
              options={[
                { value: 'noprice', label: tx(lang, 'Não sei quanto cobrar', "I don't know how much to charge") },
                { value: 'cheap', label: tx(lang, 'Cobro barato e fico sem tempo', 'I charge cheap and run out of time') },
                { value: 'lose', label: tx(lang, 'Perco clientes quando subo o preço', 'I lose clients when I raise prices') },
                { value: 'control', label: tx(lang, 'Tenho dificuldade de controlar o que já fechei', 'I struggle to control what I already closed') },
              ]}
              selected={q4}
              onSelect={(v) => setQ4(v as Q4)}
            />

            <div
              className={`transition-all duration-500 overflow-hidden ${
                temp ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              {temp === 'cold' && (
                <ResultCard color="violet" title={tx(lang, 'Método recomendado: valor/hora', 'Recommended method: hourly rate')}>
                  <p className="text-gray-200 leading-relaxed mb-4">
                    {tx(lang,
                      'Você está na fase de estruturação da precificação. Comece pelo valor/hora para ter uma base sólida antes de fechar projetos maiores.',
                      "You're in the pricing structuring phase. Start with the hourly rate to build a solid base before closing larger projects.")}
                  </p>
                  <Button asChild variant="brand" size="sm">
                    <Link to="/calculadora-valor-hora">
                      <Calculator className="w-4 h-4 mr-2" />
                      {tx(lang, 'Calcular meu valor/hora agora', 'Calculate my hourly rate now')}
                    </Link>
                  </Button>
                </ResultCard>
              )}
              {temp === 'warm' && (
                <ResultCard color="purple" title={tx(lang, 'Método recomendado: projeto com escopo', 'Recommended method: project with scope')}>
                  <p className="text-gray-200 leading-relaxed mb-4">
                    {tx(lang,
                      'Você já tem volume para trabalhar com projetos estruturados. O próximo passo é controlar automaticamente as parcelas e prazos de cada projeto.',
                      'You already have volume to work with structured projects. The next step is to automatically control installments and deadlines of each project.')}
                  </p>
                  <Button asChild variant="brand" size="sm">
                    <a href="/">
                      {tx(lang, 'Ver como a Eluvie controla seus projetos', 'See how Eluvie controls your projects')}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </ResultCard>
              )}
              {temp === 'hot' && (
                <ResultCard color="magenta" title={tx(lang, 'Método recomendado: retainer/assinatura', 'Recommended method: retainer/subscription')}>
                  <p className="text-gray-200 leading-relaxed mb-4">
                    {tx(lang,
                      'Você tem uma operação recorrente que precisa de controle real. Com esse volume, cada contrato não monitorado é receita em risco.',
                      'You have a recurring operation that needs real control. At this volume, every unmonitored contract is revenue at risk.')}
                  </p>
                  <Button asChild variant="brand" size="sm">
                    <a href={whatsappHot} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      {tx(lang, 'Falar com a Eluvie no WhatsApp', 'Talk to Eluvie on WhatsApp')}
                    </a>
                  </Button>
                </ResultCard>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* INTERNAL LINKS CLUSTER */}
      <section className="px-4 md:px-6 pb-20">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">{tx(lang, 'Continue aprendendo', 'Keep learning')}</h2>
            <p className="text-gray-400">{tx(lang, 'Conteúdo gratuito para profissionais criativos', 'Free content for creative professionals')}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <ClusterCard
              to="/calculadora-valor-hora"
              icon={<Calculator className="w-6 h-6" />}
              title={tx(lang, 'Calcule seu valor/hora agora', 'Calculate your hourly rate now')}
              desc={tx(lang, 'Ferramenta gratuita baseada nos seus custos reais.', 'Free tool based on your real costs.')}
            />
            <ClusterCard
              to="/nota-fiscal-mei"
              icon={<FileText className="w-6 h-6" />}
              title={tx(lang, 'Como emitir nota fiscal sendo MEI', 'MEI invoice guide (Brazil)')}
              desc={tx(lang, 'Guia completo + ferramenta para descobrir qual NF emitir.', 'Complete guide + tool to find out which invoice to issue.')}
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 md:px-6 pb-20">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            {tx(lang, 'Perguntas frequentes', 'Frequently asked questions')}
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((f, i) => (
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
          <div
            className="rounded-3xl p-8 md:p-14 text-center relative overflow-hidden"
            style={{
              background:
                'linear-gradient(135deg, rgba(172,46,232,0.18), rgba(142,96,229,0.12), rgba(214,78,194,0.18))',
            }}
          >
            <div className="absolute inset-0 border border-brand-violet/30 rounded-3xl pointer-events-none" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4 relative">
              {tx(lang, 'Método na precificação. Controle no financeiro.', 'Method in pricing. Control in finance.')}
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto mb-8 relative">
              {tx(lang,
                'A Eluvie conecta sua precificação ao seu financeiro real: orçamentos, contratos, recorrência e fluxo de caixa em um único painel.',
                'Eluvie connects your pricing to your real financials: quotes, contracts, recurring revenue and cash flow in a single dashboard.')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center relative">
              <Button asChild variant="brand" size="lg">
                <a href="/#waitlist">{tx(lang, 'Começar grátis', 'Start free')}</a>
              </Button>
              <Button asChild variant="brandSecondary" size="lg">
                <a href={whatsappSpecialist} target="_blank" rel="noopener noreferrer">
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

const ToolQuestion = ({
  number, question, options, selected, onSelect,
}: {
  number: number;
  question: string;
  options: { value: string; label: string }[];
  selected: string;
  onSelect: (v: string) => void;
}) => (
  <div>
    <p className="text-sm text-gray-400 mb-2">
      {/* eslint-disable-next-line */}
      {`Pergunta ${number}`}
    </p>
    <p className="text-white font-medium mb-4">{question}</p>
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onSelect(opt.value)}
          className={`px-4 py-2 rounded-lg border text-sm transition-all ${
            selected === opt.value
              ? 'border-brand-violet bg-brand-violet/15 text-white'
              : 'border-gray-700 text-gray-300 hover:border-gray-500'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  </div>
);

const ResultCard = ({
  color, title, children,
}: {
  color: 'violet' | 'purple' | 'magenta';
  title: string;
  children: React.ReactNode;
}) => {
  const styles = {
    violet: 'border-brand-violet/40 bg-brand-violet/5 text-brand-violet',
    purple: 'border-brand-purple/40 bg-brand-purple/5 text-brand-purple',
    magenta: 'border-brand-magenta/40 bg-brand-magenta/5 text-brand-magenta',
  }[color];
  return (
    <div className={`rounded-xl p-6 border ${styles}`}>
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-5 h-5" />
        <span className="text-sm font-semibold uppercase tracking-wide">{title}</span>
      </div>
      {children}
    </div>
  );
};

const ClusterCard = ({
  to, icon, title, desc,
}: { to: string; icon: React.ReactNode; title: string; desc: string }) => (
  <Link
    to={to}
    className="group bg-[#222] border border-gray-800 hover:border-brand-violet/50 rounded-2xl p-6 transition-all flex items-start gap-4"
  >
    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-brand-violet/15 text-brand-violet flex items-center justify-center">
      {icon}
    </div>
    <div className="flex-1">
      <h3 className="text-white font-semibold mb-1 flex items-center gap-2">
        {title}
        <ArrowRight className="w-4 h-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-brand-violet" />
      </h3>
      <p className="text-gray-400 text-sm">{desc}</p>
    </div>
  </Link>
);

const getFaqs = (lang: Lang) => {
  if (lang === 'pt-BR') {
    return [
      { q: 'Como precificar um serviço criativo?', a: 'Comece pelo seu custo/hora real (custos fixos + margem ÷ horas faturáveis). Depois escolha o método que melhor se encaixa: hora, projeto ou recorrência. Nunca precifique apenas pelo que "parece justo".' },
      { q: 'Qual a diferença entre precificação por hora e por projeto?', a: 'Hora cobra por tempo entregue, com escopo aberto. Projeto cobra por entregável fechado, com escopo definido e margem de risco. Projeto é mais previsível para o cliente; hora é mais previsível para você.' },
      { q: 'Como calcular o preço de um serviço mensal?', a: 'Estime as horas mensais médias do cliente, multiplique pelo seu valor/hora, some uma margem de previsibilidade (5 a 15%) e considere desconto por volume se fizer sentido.' },
      { q: 'Como reajustar preços sem perder clientes?', a: 'Comunique com 30 dias de antecedência, ancore no valor entregue (não nos seus custos), faça reajustes graduais e ofereça uma janela curta de transição para contratos antigos.' },
      { q: 'Vale mais a pena cobrar por projeto ou mensalidade?', a: 'Depende do tipo de serviço. Entregáveis pontuais (site, identidade visual) funcionam melhor por projeto. Serviços contínuos (social, suporte, tráfego) ganham em previsibilidade no modelo mensal.' },
      { q: 'Como saber se estou precificando abaixo do mercado?', a: 'Se você trabalha mais de 40h por semana e mal sobra dinheiro, ou se seu valor/hora atual é menor que o calculado pelos seus custos reais, você está cobrando abaixo do mercado.' },
      { q: 'Como controlar contratos recorrentes sem perder prazos?', a: 'O ideal é centralizar contratos, lançamentos e vencimentos em uma única ferramenta. A Eluvie faz isso automaticamente: cada contrato recorrente gera lançamentos mensais com data, valor e status de pagamento, sem precisar lançar na mão.' },
    ];
  }
  return [
    { q: 'How do I price a creative service?', a: 'Start from your real cost/hour (fixed costs + margin ÷ billable hours). Then pick the method that fits best: hourly, project or recurring. Never price by what "feels fair".' },
    { q: 'What is the difference between hourly and project pricing?', a: 'Hourly charges for time delivered with open scope. Project charges for a defined deliverable with a fixed scope and risk margin. Project is more predictable for the client; hourly is more predictable for you.' },
    { q: 'How do I calculate the price of a monthly service?', a: 'Estimate the average monthly hours per client, multiply by your hourly rate, add a predictability premium (5 to 15%), and consider a volume discount if it makes sense.' },
    { q: 'How can I raise prices without losing clients?', a: 'Announce 30 days in advance, anchor in value delivered (not your costs), raise gradually, and offer a short transition window for old contracts.' },
    { q: 'Is project or monthly pricing better?', a: 'Depends on the service. One-off deliverables (website, branding) work better as projects. Continuous services (social, support, paid media) gain predictability with monthly pricing.' },
    { q: 'How do I know if I am pricing below market?', a: 'If you work over 40h/week and barely have money left, or your current hourly rate is below what your real costs require, you are pricing below market.' },
    { q: 'How do I track recurring contracts without missing deadlines?', a: 'The ideal approach is centralizing contracts, entries and due dates in a single tool. Eluvie does this automatically: each recurring contract generates monthly entries with date, amount and payment status, no manual entry needed.' },
  ];
};

export default PrecificarServicos;