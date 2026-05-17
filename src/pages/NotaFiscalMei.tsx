import { useEffect, useState } from 'react';
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
import { FileText, ArrowRight, MessageCircle, CheckCircle2, Sparkles } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const SITE_URL = 'https://www.eluvie.com';
const PATH = '/nota-fiscal-mei';
const WHATSAPP = '5554991411584';

type ClientType = 'pf' | 'pj' | '';
type ValueRange = 'low' | 'mid' | 'high' | '';
type Recurring = 'no' | 'yes' | '';

const FAQS = [
  {
    q: 'MEI é obrigado a emitir nota fiscal?',
    a: 'O MEI é obrigado a emitir nota fiscal quando o cliente é pessoa jurídica (CNPJ). Para pessoa física, a emissão é opcional — mas recomendada para manter o controle do faturamento e comprovar receitas.',
  },
  {
    q: 'Como emitir nota fiscal MEI pelo celular?',
    a: 'A maioria das prefeituras disponibiliza o portal NFS-e em versão mobile pelo navegador. Algumas cidades, como São Paulo, têm app próprio. Basta acessar com seu CNPJ e a senha cadastrada na prefeitura.',
  },
  {
    q: 'MEI pode emitir nota fiscal para pessoa física?',
    a: 'Sim. O MEI pode emitir NFS-e normalmente para pessoa física informando CPF no lugar de CNPJ. A obrigatoriedade é só para clientes PJ, mas emitir para PF ajuda a comprovar receita e organizar a contabilidade.',
  },
  {
    q: 'Qual o limite de faturamento do MEI por nota fiscal?',
    a: 'Não há limite por nota individual, mas o MEI tem um teto anual de R$81.000 em 2025. Ultrapassar esse valor obriga a migração para Microempresa (ME), com mudança de regime tributário.',
  },
  {
    q: 'Como emitir nota fiscal MEI pelo Gov.br?',
    a: 'O Gov.br não emite nota fiscal diretamente — a emissão é municipal, pelo portal da prefeitura. O Gov.br serve para acessar dados do CNPJ, declarar o DASN-SIMEI e gerenciar sua conta MEI.',
  },
  {
    q: 'MEI pode ter mais de um cliente recorrente?',
    a: 'Pode, sem limite de quantidade. O que importa é não ultrapassar o teto anual de R$81.000 somando todas as receitas. Quanto mais clientes recorrentes, mais importante é ter um controle automatizado.',
  },
  {
    q: 'O que acontece se o MEI ultrapassar o limite de faturamento?',
    a: 'Se ultrapassar até 20% do teto (até R$97.200), você paga DAS adicional e migra para ME no ano seguinte. Acima de 20%, a migração é retroativa, com cobrança de impostos como ME desde janeiro.',
  },
  {
    q: 'Como controlar as notas fiscais emitidas todo mês?',
    a: 'O ideal é centralizar lançamentos, vencimentos e status de pagamento em uma única ferramenta. A Eluvie faz isso automaticamente: você cadastra o contrato recorrente uma vez e a plataforma gera os lançamentos mensais, te avisa de pagamentos e organiza tudo por cliente.',
  },
  {
    q: 'MEI precisa de contador para emitir nota fiscal?',
    a: 'Não. Um dos benefícios do MEI é justamente a simplicidade — você mesmo emite as notas pelo portal da prefeitura. Contador é opcional e útil principalmente para quem fatura próximo do teto.',
  },
  {
    q: 'Como saber qual código de serviço usar na nota fiscal?',
    a: 'O código vem da sua atividade principal cadastrada no CNPJ MEI, baseada na Lei Complementar 116/2003. Veja a tabela acima com os códigos mais comuns para criativos, ou consulte seu CCMEI no Portal do Empreendedor.',
  },
];

const SERVICE_CODES: { servico: string; codigo: string }[] = [
  { servico: 'Design gráfico', codigo: 'LC 116 — 23.01 / CNAE 7410-2/02' },
  { servico: 'Social media', codigo: 'LC 116 — 17.06 / CNAE 7319-0/03' },
  { servico: 'Desenvolvimento web', codigo: 'LC 116 — 1.04 / CNAE 6201-5/01' },
  { servico: 'Produção de conteúdo', codigo: 'LC 116 — 17.02 / CNAE 7490-1/99' },
  { servico: 'Consultoria de marketing', codigo: 'LC 116 — 17.01 / CNAE 7020-4/00' },
  { servico: 'Fotografia', codigo: 'LC 116 — 13.03 / CNAE 7420-0/01' },
  { servico: 'Edição de vídeo', codigo: 'LC 116 — 13.02 / CNAE 5912-0/01' },
];

const NotaFiscalMei = () => {
  const [client, setClient] = useState<ClientType>('');
  const [value, setValue] = useState<ValueRange>('');
  const [recurring, setRecurring] = useState<Recurring>('');
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const allAnswered = client && value && recurring;

  type Temp = 'cold' | 'warm' | 'hot';
  const temp: Temp | null = (() => {
    if (!allAnswered) return null;
    if (recurring === 'yes' && value === 'high') return 'hot';
    if (client === 'pj' && value !== 'low') return 'warm';
    if (recurring === 'yes') return 'warm';
    return 'cold';
  })();

  useEffect(() => {
    const title = 'Como emitir nota fiscal MEI: guia completo 2025 | Eluvie';
    const desc = 'Guia completo de nota fiscal MEI: passo a passo, códigos de serviço, limites e ferramenta gratuita para descobrir qual NF emitir.';
    document.title = title;
    document.documentElement.lang = 'pt-BR';

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
    let script = document.getElementById('ld-faq-nfmei') as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = 'ld-faq-nfmei';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
    return () => {
      const s = document.getElementById('ld-faq-nfmei');
      if (s) s.remove();
    };
  }, []);

  const submitEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast({ title: 'E-mail inválido', variant: 'destructive' });
      return;
    }
    setEmailSent(true);
    toast({
      title: 'Checklist enviado!',
      description: 'Em instantes você recebe o passo a passo no seu e-mail.',
    });
  };

  const whatsappHot = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
    'Oi! Vim da página de nota fiscal MEI da Eluvie. Tenho serviços recorrentes e quero entender como a plataforma pode me ajudar a controlar meu faturamento.'
  )}&lead=quente&origem=nf-mei`;
  const whatsappSpecialist = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
    'Quero falar com um especialista da Eluvie.'
  )}`;

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <Navbar />

      {/* HERO */}
      <section className="pt-32 pb-12 px-4 md:px-6">
        <div className="container mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-violet/15 border border-brand-violet/30 mb-6">
            <FileText className="w-4 h-4 text-brand-violet" />
            <span className="text-xs font-medium text-brand-violet">Guia completo MEI</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-brand-violet via-brand-purple to-brand-magenta bg-clip-text text-transparent">
              Como emitir nota fiscal sendo MEI (sem dor de cabeça)
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
            O guia completo que nenhum contador te deu — com ferramenta grátis para descobrir exatamente qual NF você precisa emitir.
          </p>
        </div>
      </section>

      {/* HOOK */}
      <section className="px-4 md:px-6 pb-12">
        <div className="container mx-auto max-w-3xl">
          <div className="bg-[#222] border border-gray-800 rounded-2xl p-6 md:p-8 text-gray-300 leading-relaxed text-base md:text-lg">
            Você fechou o projeto, o cliente pediu nota, e você travou. MEI pode emitir NF? Para pessoa jurídica? E para pessoa física?
            <br /><br />
            Esse guia responde tudo isso — e no final, uma ferramenta gratuita descobre exatamente qual nota você precisa emitir em menos de 1 minuto.
          </div>
        </div>
      </section>

      {/* GUIDE */}
      <section className="px-4 md:px-6 pb-16">
        <article className="container mx-auto max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Tudo que você precisa saber sobre nota fiscal MEI</h2>

          <h3 className="text-2xl font-semibold mt-10 mb-4 text-white">O que é nota fiscal e por que o MEI precisa emitir</h3>
          <p className="text-gray-300 leading-relaxed">
            Nota fiscal é o documento que registra oficialmente uma venda ou serviço prestado. Para o MEI, dois tipos importam: a <strong className="text-white">NFS-e</strong> (Nota Fiscal de Serviços Eletrônica), usada para serviços e emitida pela prefeitura do seu município, e a <strong className="text-white">NF-e</strong> (Nota Fiscal Eletrônica), usada para venda de produtos e emitida pela Sefaz estadual.
          </p>
          <p className="text-gray-300 leading-relaxed mt-3">
            A maioria dos MEIs criativos (designers, social media, devs, fotógrafos) presta serviços, então a NFS-e é a relevante. A emissão é <strong className="text-white">obrigatória</strong> quando o cliente é pessoa jurídica (CNPJ) e <strong className="text-white">opcional, mas recomendada</strong>, para pessoa física.
          </p>

          <h3 className="text-2xl font-semibold mt-10 mb-4 text-white">Passo a passo para emitir nota fiscal MEI</h3>
          <ol className="text-gray-300 space-y-3 list-decimal pl-6 leading-relaxed">
            <li>Acesse o portal de NFS-e da prefeitura da sua cidade.</li>
            <li>Cadastre-se como prestador de serviços usando seu CNPJ MEI.</li>
            <li>Preencha os dados do tomador (CPF ou CNPJ do cliente).</li>
            <li>Informe o serviço prestado, o código de serviço e o valor.</li>
            <li>Emita a nota e envie em PDF ao cliente.</li>
          </ol>
          <div className="mt-4 p-4 rounded-lg bg-brand-violet/10 border border-brand-violet/30 text-sm text-gray-300">
            <strong className="text-brand-violet">Atenção:</strong> os portais variam por cidade. São Paulo usa o NFe.io / NFS-e São Paulo. Rio de Janeiro usa o sistema próprio da prefeitura. Para outros municípios, busque <em>"NFS-e + nome da sua cidade"</em>.
          </div>

          <h3 className="text-2xl font-semibold mt-10 mb-4 text-white">MEI pode emitir nota para pessoa física?</h3>
          <p className="text-gray-300 leading-relaxed">
            <strong className="text-white">Sim, pode.</strong> A única diferença prática é o campo do tomador: você informa o CPF no lugar de CNPJ e, em alguns municípios, os campos de endereço se tornam opcionais. Tudo o mais é igual à emissão para PJ.
          </p>

          <h3 className="text-2xl font-semibold mt-10 mb-4 text-white">MEI tem limite para emitir notas?</h3>
          <p className="text-gray-300 leading-relaxed">
            Não existe limite de quantidade de notas, mas existe um <strong className="text-white">teto anual de faturamento de R$81.000</strong>. Ultrapassar significa migrar para Microempresa (ME) com mudança de regime tributário. Controlar esse limite manualmente — em planilhas ou na cabeça — é arriscado: muitos MEIs só descobrem que estouraram em janeiro do ano seguinte, quando já é tarde.
          </p>

          <h3 className="text-2xl font-semibold mt-10 mb-4 text-white">E quando o projeto é recorrente? Social media, tráfego, design mensal?</h3>
          <p className="text-gray-300 leading-relaxed">
            Emitir uma nota pontual é simples. O problema começa quando você tem 8 clientes recorrentes, cada um com data diferente, valor diferente, e você precisa lembrar de emitir todo mês.
          </p>
          <p className="text-gray-300 leading-relaxed mt-3">
            É aqui que a maioria dos MEIs perde dinheiro — não por não saber emitir, mas por <strong className="text-white">esquecer, atrasar, ou perder o controle</strong> do que já foi faturado.
          </p>
          <p className="text-gray-300 leading-relaxed mt-3">
            A Eluvie resolve exatamente isso: você cadastra o contrato recorrente uma vez, e a plataforma controla automaticamente os lançamentos mensais, vencimentos e status de pagamento de cada cliente.
          </p>

          {/* Inline CTA card */}
          <div className="mt-6 rounded-2xl p-[1px] bg-gradient-to-r from-brand-violet to-brand-magenta">
            <div className="bg-[#1a1a1a] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-white font-semibold text-lg">Quer ver como funciona na prática?</p>
                <p className="text-gray-400 text-sm mt-1">Veja a Eluvie em ação em menos de 2 minutos.</p>
              </div>
              <Button asChild variant="brand" size="sm">
                <a href="/">
                  Conhecer a Eluvie <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </div>
          </div>

          <h3 className="text-2xl font-semibold mt-12 mb-4 text-white">Qual código de serviço usar na nota fiscal MEI?</h3>
          <p className="text-gray-300 leading-relaxed mb-4">
            Abaixo, os códigos mais comuns para o público criativo. Use como referência — o código exato depende da atividade principal cadastrada no seu CCMEI.
          </p>
          <div className="overflow-x-auto rounded-xl border border-gray-800">
            <table className="w-full text-sm">
              <thead className="bg-brand-violet/10 text-brand-violet">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold">Serviço</th>
                  <th className="text-left px-4 py-3 font-semibold">Código (LC 116 / CNAE)</th>
                </tr>
              </thead>
              <tbody>
                {SERVICE_CODES.map((row, i) => (
                  <tr key={row.servico} className={i % 2 === 0 ? 'bg-[#1a1a1a]' : 'bg-[#222]'}>
                    <td className="px-4 py-3 text-white">{row.servico}</td>
                    <td className="px-4 py-3 text-gray-300 font-mono text-xs">{row.codigo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>

      {/* INTERACTIVE TOOL */}
      <section className="px-4 md:px-6 pb-20">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Descubra qual nota fiscal você precisa emitir</h2>
            <p className="text-gray-400">Responda 3 perguntas e saiba exatamente o que fazer</p>
          </div>

          <div className="bg-[#222] border border-gray-800 rounded-2xl p-6 md:p-8 space-y-8">
            <ToolQuestion
              number={1}
              question="Seu cliente é pessoa física ou jurídica (empresa)?"
              options={[
                { value: 'pf', label: 'Pessoa física' },
                { value: 'pj', label: 'Pessoa jurídica (CNPJ)' },
              ]}
              selected={client}
              onSelect={(v) => setClient(v as ClientType)}
            />
            <ToolQuestion
              number={2}
              question="Qual é o valor do serviço?"
              options={[
                { value: 'low', label: 'Até R$500' },
                { value: 'mid', label: 'R$500 a R$2.000' },
                { value: 'high', label: 'Acima de R$2.000' },
              ]}
              selected={value}
              onSelect={(v) => setValue(v as ValueRange)}
            />
            <ToolQuestion
              number={3}
              question="Esse serviço se repete todo mês?"
              options={[
                { value: 'no', label: 'Não, é pontual' },
                { value: 'yes', label: 'Sim, é recorrente' },
              ]}
              selected={recurring}
              onSelect={(v) => setRecurring(v as Recurring)}
            />

            {/* RESULT */}
            <div
              className={`transition-all duration-500 overflow-hidden ${
                temp ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              {temp === 'cold' && (
                <div className="rounded-xl p-6 border border-brand-violet/30 bg-brand-violet/5">
                  <div className="flex items-center gap-2 mb-3 text-brand-violet">
                    <Sparkles className="w-5 h-5" />
                    <span className="text-sm font-semibold uppercase tracking-wide">Seu resultado</span>
                  </div>
                  <p className="text-gray-200 leading-relaxed mb-4">
                    Você precisa emitir uma <strong className="text-white">NFS-e pela prefeitura da sua cidade</strong>. É simples e gratuito. Baixe nosso checklist com o passo a passo completo para não errar nada.
                  </p>
                  {emailSent ? (
                    <div className="flex items-center gap-2 text-brand-violet text-sm">
                      <CheckCircle2 className="w-4 h-4" /> Checklist enviado para o seu e-mail!
                    </div>
                  ) : (
                    <>
                      <form onSubmit={submitEmail} className="flex flex-col sm:flex-row gap-2">
                        <Input
                          type="email"
                          placeholder="seu@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="bg-[#1a1a1a] border-gray-700 text-white"
                          maxLength={255}
                        />
                        <Button type="submit" variant="brand" size="sm">
                          Baixar checklist gratuito
                        </Button>
                      </form>
                      <p className="text-xs text-gray-500 mt-2">Sem spam. Só o que você precisa.</p>
                    </>
                  )}
                </div>
              )}

              {temp === 'warm' && (
                <div className="rounded-xl p-6 border border-brand-purple/40 bg-brand-purple/5">
                  <div className="flex items-center gap-2 mb-3 text-brand-purple">
                    <Sparkles className="w-5 h-5" />
                    <span className="text-sm font-semibold uppercase tracking-wide">Seu resultado</span>
                  </div>
                  <p className="text-gray-200 leading-relaxed mb-4">
                    Você precisa emitir <strong className="text-white">NFS-e</strong> e pode precisar de <strong className="text-white">RPS</strong> dependendo da sua cidade. Veja como a Eluvie ajuda você a nunca mais esquecer um lançamento.
                  </p>
                  <Button asChild variant="brand" size="sm">
                    <a href="/">
                      Ver como a Eluvie funciona <ArrowRight className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </div>
              )}

              {temp === 'hot' && (
                <div className="rounded-xl p-6 border border-brand-magenta/40 bg-brand-magenta/5">
                  <div className="flex items-center gap-2 mb-3 text-brand-magenta">
                    <Sparkles className="w-5 h-5" />
                    <span className="text-sm font-semibold uppercase tracking-wide">Seu resultado</span>
                  </div>
                  <p className="text-gray-200 leading-relaxed mb-4">
                    Você tem uma operação recorrente que precisa de controle real. Emitir nota é só o começo — o que você realmente precisa é saber exatamente quanto vai entrar todo mês, quem já pagou e quem está atrasado.
                  </p>
                  <Button asChild variant="brand" size="sm">
                    <a href={whatsappHot} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Falar com a Eluvie no WhatsApp
                    </a>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 md:px-6 pb-20">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Perguntas frequentes sobre nota fiscal MEI</h2>
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
              Você já sabe emitir nota. Agora precisa controlar o que entra.
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto mb-8 relative">
              A Eluvie organiza seus clientes, contratos e faturamento recorrente em um único lugar — para você parar de gerenciar no papel e começar a crescer de verdade.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center relative">
              <Button asChild variant="brand" size="lg">
                <a href="/#waitlist">Começar grátis</a>
              </Button>
              <Button asChild variant="brandSecondary" size="lg">
                <a href={whatsappSpecialist} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Falar com especialista
                </a>
              </Button>
            </div>
            <p className="text-xs text-gray-400 mt-6 relative">Sem cartão de crédito. Sem compromisso.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

const ToolQuestion = ({
  number,
  question,
  options,
  selected,
  onSelect,
}: {
  number: number;
  question: string;
  options: { value: string; label: string }[];
  selected: string;
  onSelect: (v: string) => void;
}) => (
  <div>
    <p className="text-sm text-gray-400 mb-2">Pergunta {number}</p>
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

export default NotaFiscalMei;