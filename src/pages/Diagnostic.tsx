import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, User, AlertTriangle, Sparkles, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { supabase } from '@/integrations/supabase/client';

type Lang = 'en' | 'pt-BR';

interface ChatMessage {
  id: string;
  from: 'wolly' | 'user' | 'card' | 'summary';
  text?: string;
  payload?: any;
}

type StepId =
  | 'intro' | 'consent'
  | 'q1' | 'q2_clients' | 'q2_projects'
  | 'q3' | 'q3_count'
  | 'q4' | 'q5' | 'q6' | 'q6_other'
  | 'summary' | 'summaryFix'
  | 'analyzing' | 'diagnosis'
  | 'leadAsk' | 'leadName' | 'leadCompany' | 'leadWhats' | 'leadEmail'
  | 'final' | 'declined';

interface Answers {
  tipo_negocio: string;
  tipo_negocio_label: string;
  clientes_ativos: string;
  projetos_mes: string;
  contratos_recorrentes: string;
  faturamento: string;
  faturamento_label: string;
  dores: string[];
  dores_labels: string[];
  controle_atual: string;
  controle_atual_label: string;
  ferramenta_atual: string;
}

const tx = (lang: Lang, pt: string, en: string) => (lang === 'pt-BR' ? pt : en);

// Number word maps
const PT_WORDS: Record<string, number> = {
  zero: 0, um: 1, uma: 1, dois: 2, duas: 2, tres: 3, 'três': 3, quatro: 4, cinco: 5,
  seis: 6, sete: 7, oito: 8, nove: 9, dez: 10, onze: 11, doze: 12, treze: 13,
  quatorze: 14, catorze: 14, quinze: 15, dezesseis: 16, dezessete: 17, dezoito: 18,
  dezenove: 19, vinte: 20, trinta: 30, quarenta: 40, cinquenta: 50, cem: 100,
};
const EN_WORDS: Record<string, number> = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7,
  eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14,
  fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20,
  thirty: 30, forty: 40, fifty: 50, hundred: 100,
};

const extractNumber = (input: string, lang: Lang): number | null => {
  const m = input.match(/\d+/);
  if (m) return parseInt(m[0], 10);
  const norm = input.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const dict = lang === 'pt-BR' ? PT_WORDS : EN_WORDS;
  for (const word of norm.split(/[^a-z]+/)) {
    if (word && dict[word] !== undefined) return dict[word];
  }
  return null;
};

const Diagnostic = () => {
  const { language, t, currency } = useLanguage();
  const lang = language as Lang;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [step, setStep] = useState<StepId>('intro');
  const [typing, setTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [retries, setRetries] = useState(0);
  const [selectedPains, setSelectedPains] = useState<string[]>([]);
  const [leadData, setLeadData] = useState({ nome: '', empresa: '', whatsapp: '', email: '' });

  const [answers, setAnswers] = useState<Answers>({
    tipo_negocio: '', tipo_negocio_label: '',
    clientes_ativos: '', projetos_mes: '',
    contratos_recorrentes: '', faturamento: '', faturamento_label: '',
    dores: [], dores_labels: [],
    controle_atual: '', controle_atual_label: '',
    ferramenta_atual: '',
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);
  const langRef = useRef<Lang>(lang);

  useEffect(() => { langRef.current = lang; }, [lang]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const pushWolly = async (text: string, delay = 1000) => {
    setTyping(true);
    await wait(delay);
    setTyping(false);
    setMessages((m) => [...m, { id: crypto.randomUUID(), from: 'wolly', text }]);
  };

  const pushUser = (text: string) => {
    setMessages((m) => [...m, { id: crypto.randomUUID(), from: 'user', text }]);
  };

  // Bootstrap intro - WAIT for language detection (geolocation may set it async)
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    (async () => {
      // Small delay so language context can settle from geolocation
      await wait(150);
      const L = langRef.current;
      await pushWolly(
        tx(L,
          'Oi! Eu sou o Wolly, agente da Eluvie 👋 Vou te ajudar a entender como a Eluvie pode se encaixar no seu negócio criativo.',
          "Hey! I'm Wolly, Eluvie's agent 👋 I'm here to help you understand how Eluvie fits your creative business."
        ), 500
      );
      await pushWolly(
        tx(L, 'São só 2 minutinhos. Pode ser? 😊', "It'll take just 2 minutes. Ready? 😊"),
        900
      );
      setStep('consent');
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ===== Step handlers =====

  const handleConsent = async (yes: boolean) => {
    pushUser(yes ? tx(lang, 'Vamos lá!', "Let's go!") : tx(lang, 'Agora não', 'Maybe later'));
    if (!yes) {
      await pushWolly(tx(lang, 'Sem problema! Quando quiser, é só voltar aqui. 👋', "No worries! Come back whenever you'd like. 👋"));
      setStep('declined');
      return;
    }
    await pushWolly(tx(lang, 'Primeiro: como você se descreve?', 'First things first — how would you describe yourself?'));
    setStep('q1');
  };

  const handleQ1 = async (value: string, label: string) => {
    pushUser(label);
    setAnswers((a) => ({ ...a, tipo_negocio: value, tipo_negocio_label: label }));
    if (value === 'unknown') {
      await pushWolly(tx(lang, 'Tudo bem! Vamos descobrir juntos pelo caminho. 😉', "All good! We'll figure it out as we go. 😉"));
    }
    await pushWolly(tx(lang, 'Quantos clientes ativos você tem hoje?', 'How many active clients do you have right now?'));
    setRetries(0);
    setStep('q2_clients');
  };

  const submitNumber = async (
    field: 'clientes_ativos' | 'projetos_mes' | 'contratos_recorrentes',
    nextFn: () => Promise<void>,
  ) => {
    const raw = inputValue.trim();
    if (!raw) return;
    pushUser(raw);
    setInputValue('');
    const n = extractNumber(raw, lang);
    if (n !== null) {
      setAnswers((a) => ({ ...a, [field]: String(n) }));
      await pushWolly(tx(lang, `Anotado, ${n}! Seguindo...`, `Got it, ${n}! Moving on...`), 700);
      setRetries(0);
      await nextFn();
    } else {
      if (retries === 0) {
        setRetries(1);
        await pushWolly(tx(lang,
          'Hmm, não entendi bem. Pode me dizer um número aproximado? Não precisa ser exato!',
          "Hmm, I didn't quite get that. Can you give me a rough number? It doesn't have to be exact!"
        ));
      } else {
        setAnswers((a) => ({ ...a, [field]: tx(lang, 'não informado', 'not provided') }));
        await pushWolly(tx(lang,
          'Tudo bem, vamos seguir sem esse dado! Não vai comprometer seu diagnóstico.',
          "No worries, let's keep going without that one! It won't affect your diagnosis."
        ));
        setRetries(0);
        await nextFn();
      }
    }
  };

  const handleQ2Clients = () => submitNumber('clientes_ativos', async () => {
    await pushWolly(tx(lang, 'E em média, quantos projetos você fecha por mês?', 'And roughly how many projects do you close per month?'));
    setStep('q2_projects');
  });

  const handleQ2Projects = () => submitNumber('projetos_mes', async () => {
    await pushWolly(tx(lang,
      'Você tem contratos recorrentes ou de longo prazo? Tipo social media, retainer mensal, pacotes de 12 meses?',
      'Do you have any recurring or long-term contracts? Like social media management, monthly retainers, or 12-month packages?'
    ));
    setStep('q3');
  });

  const handleQ3 = async (val: 'yes' | 'no' | 'unknown') => {
    if (val === 'yes') {
      pushUser(tx(lang, 'Sim, tenho!', 'Yes!'));
      await pushWolly(tx(lang, 'Quantos?', 'How many?'));
      setRetries(0);
      setStep('q3_count');
    } else if (val === 'no') {
      pushUser(tx(lang, 'Não tenho', 'Not really'));
      setAnswers((a) => ({ ...a, contratos_recorrentes: '0' }));
      await goToQ4();
    } else {
      pushUser(tx(lang, 'Não sei / Nenhum dos anteriores', 'Not sure / None of the above'));
      setAnswers((a) => ({ ...a, contratos_recorrentes: tx(lang, 'não informado', 'not provided') }));
      await pushWolly(tx(lang, 'Sem stress, vamos seguir! 💜', "No stress, let's continue! 💜"));
      await goToQ4();
    }
  };

  const handleQ3Count = () => submitNumber('contratos_recorrentes', goToQ4);

  const goToQ4 = async () => {
    await pushWolly(tx(lang, 'E o seu faturamento mensal aproximado fica em qual faixa?', "What's your approximate monthly revenue?"));
    setStep('q4');
  };

  const handleQ4 = async (value: string, label: string) => {
    pushUser(label);
    setAnswers((a) => ({ ...a, faturamento: value, faturamento_label: label }));
    if (value === 'unknown') {
      await pushWolly(tx(lang, 'Sem problema, isso varia mesmo!', "All good, that varies a lot!"));
    }
    await pushWolly(tx(lang,
      'Qual é sua maior dor hoje na gestão do negócio? (pode marcar mais de uma)',
      "What's your biggest pain point managing your business? (you can pick more than one)"
    ));
    setStep('q5');
  };

  const togglePain = (value: string) => {
    setSelectedPains((s) => s.includes(value) ? s.filter((x) => x !== value) : [...s, value]);
  };

  const handleQ5Submit = async () => {
    if (selectedPains.length === 0) return;
    const opts = painOptions(lang);
    const labels = selectedPains.map((v) => opts.find((p) => p.value === v)?.label || v);
    pushUser(labels.join(', '));
    setAnswers((a) => ({ ...a, dores: selectedPains, dores_labels: labels }));
    await pushWolly(tx(lang, 'Como você controla isso hoje?', 'How do you currently manage all of this?'));
    setStep('q6');
  };

  const handleQ6 = async (value: string, label: string) => {
    pushUser(label);
    setAnswers((a) => ({ ...a, controle_atual: value, controle_atual_label: label }));
    if (value === 'other_app') {
      await pushWolly(tx(lang, 'Qual?', 'Which one?'));
      setStep('q6_other');
    } else {
      if (value === 'unknown') {
        await pushWolly(tx(lang, 'Tudo bem, isso já me ajuda!', 'No worries, that helps too!'));
      }
      await goToSummary({ ...answers, controle_atual: value, controle_atual_label: label, dores: selectedPains });
    }
  };

  const handleQ6Other = async () => {
    if (!inputValue.trim()) return;
    const v = inputValue.trim();
    pushUser(v);
    const next = { ...answers, ferramenta_atual: v, controle_atual: 'other_app', controle_atual_label: v, dores: selectedPains };
    setAnswers(next);
    setInputValue('');
    await goToSummary(next);
  };

  const goToSummary = async (a: Answers) => {
    await pushWolly(tx(lang,
      'Antes de mostrar seu diagnóstico, deixa eu confirmar o que você me contou:',
      'Before I show your diagnosis, let me confirm what you shared:'
    ));
    setMessages((m) => [...m, { id: crypto.randomUUID(), from: 'summary', payload: a }]);
    await wait(400);
    await pushWolly(tx(lang, 'Está tudo certo?', 'Does everything look right?'));
    setStep('summary');
  };

  const handleSummaryConfirm = async (yes: boolean) => {
    if (yes) {
      pushUser(tx(lang, 'Sim, está certo!', "Yes, that's right!"));
      await runDiagnosis();
    } else {
      pushUser(tx(lang, 'Quero corrigir algo', 'I want to fix something'));
      await pushWolly(tx(lang, 'Claro! Qual informação você quer ajustar?', 'Of course! Which information would you like to change?'));
      setStep('summaryFix');
    }
  };

  const handleFixField = async (field: StepId) => {
    setRetries(0);
    if (field === 'q1') {
      await pushWolly(tx(lang, 'Como você se descreve?', 'How would you describe yourself?'));
    } else if (field === 'q2_clients') {
      await pushWolly(tx(lang, 'Quantos clientes ativos?', 'How many active clients?'));
    } else if (field === 'q2_projects') {
      await pushWolly(tx(lang, 'Quantos projetos por mês?', 'How many projects per month?'));
    } else if (field === 'q3') {
      await pushWolly(tx(lang, 'Tem contratos recorrentes?', 'Any recurring contracts?'));
    } else if (field === 'q4') {
      await pushWolly(tx(lang, 'Qual a faixa de faturamento?', "What's your revenue range?"));
    } else if (field === 'q5') {
      setSelectedPains([]);
      await pushWolly(tx(lang, 'Quais são suas maiores dores hoje?', 'What are your biggest pain points?'));
    } else if (field === 'q6') {
      await pushWolly(tx(lang, 'Como você controla isso hoje?', 'How do you manage it today?'));
    }
    setStep(field);
  };

  const runDiagnosis = async () => {
    setStep('analyzing');
    await pushWolly(tx(lang, 'Perfeito! Deixa eu analisar o que você me contou... 🧠', 'Got it! Let me put this together for you... 🧠'));
    await wait(1800);
    const diag = buildDiagnosis(answers, lang, t);
    setMessages((m) => [...m, { id: crypto.randomUUID(), from: 'card', payload: diag }]);
    setStep('diagnosis');
    await wait(800);
    await pushWolly(tx(lang,
      'Quer que um especialista da Eluvie entre em contato para te ajudar a configurar tudo do jeito certo? 🙌',
      'Want one of our specialists to reach out and help you get set up the right way? 🙌'
    ));
    setStep('leadAsk');
  };

  const handleLeadAsk = async (yes: boolean) => {
    if (!yes) {
      pushUser(tx(lang, 'Agora não', 'No thanks'));
      await pushWolly(tx(lang, 'Tudo bem! Quando quiser, é só falar com a gente. 💜', "All good! Whenever you're ready, we're here. 💜"));
      setStep('final');
      return;
    }
    pushUser(tx(lang, 'Sim, quero!', 'Yes, please!'));
    await pushWolly(tx(lang, 'Qual o seu nome?', "What's your name?"));
    setStep('leadName');
  };

  const submitLeadField = async (field: 'nome' | 'empresa' | 'whatsapp' | 'email', value: string, optional = false) => {
    const v = value.trim();
    if (!optional && !v) return;
    if (v) pushUser(v);
    else pushUser(tx(lang, '— pular —', '— skip —'));
    setLeadData((d) => ({ ...d, [field]: v }));
    setInputValue('');
    return v;
  };

  const handleLeadName = async () => {
    const v = await submitLeadField('nome', inputValue);
    if (!v) return;
    await pushWolly(tx(lang, `Prazer, ${v}! Qual o nome da sua empresa? (opcional)`, `Nice to meet you, ${v}! What's your company name? (optional)`));
    setStep('leadCompany');
  };

  const handleLeadCompany = async () => {
    await submitLeadField('empresa', inputValue, true);
    await pushWolly(tx(lang, 'WhatsApp com DDD?', 'Your WhatsApp number with country code?'));
    setStep('leadWhats');
  };

  const handleLeadWhats = async () => {
    const v = await submitLeadField('whatsapp', inputValue);
    if (!v) return;
    await pushWolly(tx(lang, 'E o seu melhor e-mail? (opcional)', "And your best email? (optional)"));
    setStep('leadEmail');
  };

  const handleLeadEmail = async () => {
    const email = inputValue.trim();
    if (email) pushUser(email);
    else pushUser(tx(lang, '— pular —', '— skip —'));
    setInputValue('');

    const finalLead = { ...leadData, email };
    const diag = buildDiagnosis(answers, lang, t);

    try {
      const { error } = await supabase.from('diagnostic_leads').insert({
        nome: finalLead.nome,
        empresa: finalLead.empresa || null,
        whatsapp: finalLead.whatsapp,
        email: finalLead.email || null,
        tipo_negocio: answers.tipo_negocio_label,
        clientes_ativos: answers.clientes_ativos,
        projetos_mes: answers.projetos_mes,
        contratos_recorrentes: answers.contratos_recorrentes,
        faturamento: answers.faturamento_label,
        dores: answers.dores_labels,
        controle_atual: answers.controle_atual_label,
        ferramenta_atual: answers.ferramenta_atual || null,
        plano_recomendado: diag.plan,
        idioma: lang,
      });
      if (error) console.error('diagnostic lead insert error', error);
    } catch (e) {
      console.error(e);
    }

    await pushWolly(tx(lang,
      `Tudo certo, ${finalLead.nome}! Um especialista vai entrar em contato em até 1 dia útil. 🚀`,
      `You're all set, ${finalLead.nome}! A specialist will reach out within 1 business day. 🚀`
    ));
    setStep('final');
  };

  // ===== Progress =====
  const TOTAL = 8;
  const stepProgress: Partial<Record<StepId, number>> = {
    intro: 1, consent: 1,
    q1: 2,
    q2_clients: 3, q2_projects: 3,
    q3: 4, q3_count: 4,
    q4: 5,
    q5: 6,
    q6: 7, q6_other: 7,
    summary: 7, summaryFix: 7,
    analyzing: 8, diagnosis: 8,
    leadAsk: 8, leadName: 8, leadCompany: 8, leadWhats: 8, leadEmail: 8, final: 8, declined: 8,
  };
  const currentStep = stepProgress[step] || 1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a1a] via-[#181420] to-[#1a1a1a] text-gray-100 flex flex-col">
      <Navbar />

      {/* Progress dots */}
      <div className="pt-20 pb-2">
        <div className="container mx-auto px-4 flex justify-center gap-2">
          {Array.from({ length: TOTAL }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i < currentStep ? 'w-8 bg-gradient-to-r from-[#ac2ee8] to-[#d64ec2]' : 'w-4 bg-gray-700'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Chat area */}
      <main className="flex-1 flex justify-center">
        <div className="w-full max-w-[680px] flex flex-col">
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 md:px-6 py-4 space-y-3"
            style={{ minHeight: 'calc(100vh - 220px)', maxHeight: 'calc(100vh - 180px)' }}
          >
            {messages.map((m) => {
              if (m.from === 'card') return <DiagnosisCard key={m.id} data={m.payload} lang={lang} />;
              if (m.from === 'summary') return <SummaryCard key={m.id} data={m.payload} lang={lang} />;
              return <MessageBubble key={m.id} from={m.from as 'wolly' | 'user'} text={m.text || ''} />;
            })}
            {typing && <TypingBubble />}
          </div>

          {/* Input/actions footer */}
          <div className="border-t border-gray-800 bg-[#1a1a1a]/95 backdrop-blur p-3 md:p-4 sticky bottom-0">
            {renderActions()}
          </div>
        </div>
      </main>
    </div>
  );

  // ===== Renderers =====
  function renderActions() {
    if (typing) return <div className="text-xs text-gray-500 text-center min-h-[44px] flex items-center justify-center">Wolly {tx(lang, 'está digitando...', 'is typing...')}</div>;

    const NotSure = ({ onClick }: { onClick: () => void }) => (
      <ChoiceButton variant="ghost" onClick={onClick}>
        {tx(lang, 'Não sei / Nenhum dos anteriores', 'Not sure / None of the above')}
      </ChoiceButton>
    );

    switch (step) {
      case 'consent':
        return (
          <ButtonRow>
            <ChoiceButton onClick={() => handleConsent(true)}>{tx(lang, 'Vamos lá!', "Let's go!")}</ChoiceButton>
            <ChoiceButton variant="ghost" onClick={() => handleConsent(false)}>{tx(lang, 'Agora não', 'Maybe later')}</ChoiceButton>
          </ButtonRow>
        );
      case 'declined':
        return <Link to={localPath('/')} className="block"><Button className="w-full bg-gradient-to-r from-[#ac2ee8] to-[#d64ec2] hover:opacity-90 min-h-[44px]">{tx(lang, 'Voltar para o início', 'Back to home')}</Button></Link>;
      case 'q1':
        return (
          <ButtonRow>
            <ChoiceButton onClick={() => handleQ1('freelancer', tx(lang, 'Freelancer solo', 'Solo freelancer'))}>{tx(lang, 'Freelancer solo', 'Solo freelancer')}</ChoiceButton>
            <ChoiceButton onClick={() => handleQ1('small_agency', tx(lang, 'Agência pequena (1–5)', 'Small agency (1–5)'))}>{tx(lang, 'Agência pequena (1–5)', 'Small agency (1–5)')}</ChoiceButton>
            <ChoiceButton onClick={() => handleQ1('mid_studio', tx(lang, 'Estúdio médio (6–20)', 'Mid-size studio (6–20)'))}>{tx(lang, 'Estúdio médio (6–20)', 'Mid-size studio (6–20)')}</ChoiceButton>
            <NotSure onClick={() => handleQ1('unknown', tx(lang, 'Não sei / Nenhum dos anteriores', 'Not sure / None of the above'))} />
          </ButtonRow>
        );
      case 'q2_clients':
        return <TextInputRow placeholder={tx(lang, 'Ex: 5 (ou "uns cinco")', 'e.g. 5 (or "about five")')} onSubmit={handleQ2Clients} />;
      case 'q2_projects':
        return <TextInputRow placeholder={tx(lang, 'Ex: 3 por mês', 'e.g. 3 per month')} onSubmit={handleQ2Projects} />;
      case 'q3':
        return (
          <ButtonRow>
            <ChoiceButton onClick={() => handleQ3('yes')}>{tx(lang, 'Sim, tenho!', 'Yes!')}</ChoiceButton>
            <ChoiceButton onClick={() => handleQ3('no')}>{tx(lang, 'Não tenho', 'Not really')}</ChoiceButton>
            <NotSure onClick={() => handleQ3('unknown')} />
          </ButtonRow>
        );
      case 'q3_count':
        return <TextInputRow placeholder={tx(lang, 'Quantos contratos?', 'How many contracts?')} onSubmit={handleQ3Count} />;
      case 'q4':
        return (
          <ButtonRow>
            {revenueOptions(lang, currency).map((o) => (
              <ChoiceButton key={o.value} onClick={() => handleQ4(o.value, o.label)}>{o.label}</ChoiceButton>
            ))}
            <NotSure onClick={() => handleQ4('unknown', tx(lang, 'Não sei / Nenhum dos anteriores', 'Not sure / None of the above'))} />
          </ButtonRow>
        );
      case 'q5':
        return (
          <div className="space-y-3">
            <ButtonRow>
              {painOptions(lang).map((o) => {
                const active = selectedPains.includes(o.value);
                return (
                  <ChoiceButton key={o.value} active={active} onClick={() => togglePain(o.value)}>
                    {active ? '✓ ' : ''}{o.label}
                  </ChoiceButton>
                );
              })}
              <ChoiceButton
                variant="ghost"
                active={selectedPains.includes('unknown')}
                onClick={() => togglePain('unknown')}
              >
                {tx(lang, 'Não sei / Nenhum dos anteriores', 'Not sure / None of the above')}
              </ChoiceButton>
            </ButtonRow>
            <Button
              disabled={selectedPains.length === 0}
              onClick={handleQ5Submit}
              className="w-full min-h-[44px] bg-gradient-to-r from-[#ac2ee8] to-[#d64ec2] hover:opacity-90 disabled:opacity-40"
            >
              {tx(lang, 'Continuar', 'Continue')}
            </Button>
          </div>
        );
      case 'q6':
        return (
          <ButtonRow>
            <ChoiceButton onClick={() => handleQ6('spreadsheet', tx(lang, 'Planilha', 'Spreadsheet'))}>{tx(lang, 'Planilha', 'Spreadsheet')}</ChoiceButton>
            <ChoiceButton onClick={() => handleQ6('other_app', tx(lang, 'Outro aplicativo', 'Another app'))}>{tx(lang, 'Outro aplicativo', 'Another app')}</ChoiceButton>
            <ChoiceButton onClick={() => handleQ6('notes', tx(lang, 'Anotações / memória', 'Notes / memory'))}>{tx(lang, 'Anotações', 'Notes / memory')}</ChoiceButton>
            <ChoiceButton onClick={() => handleQ6('none', tx(lang, 'Não controlo ainda', "I don't really track it"))}>{tx(lang, 'Não controlo', "Don't track")}</ChoiceButton>
            <NotSure onClick={() => handleQ6('unknown', tx(lang, 'Não sei / Nenhum dos anteriores', 'Not sure / None of the above'))} />
          </ButtonRow>
        );
      case 'q6_other':
        return <TextInputRow placeholder={tx(lang, 'Qual ferramenta?', 'Which one?')} onSubmit={handleQ6Other} />;
      case 'summary':
        return (
          <ButtonRow>
            <ChoiceButton onClick={() => handleSummaryConfirm(true)}>{tx(lang, 'Sim, está certo!', "Yes, that's right!")}</ChoiceButton>
            <ChoiceButton variant="ghost" onClick={() => handleSummaryConfirm(false)}>{tx(lang, 'Quero corrigir algo', 'I want to fix something')}</ChoiceButton>
          </ButtonRow>
        );
      case 'summaryFix':
        return (
          <ButtonRow>
            <ChoiceButton onClick={() => handleFixField('q1')}>{tx(lang, 'Tipo de negócio', 'Business type')}</ChoiceButton>
            <ChoiceButton onClick={() => handleFixField('q2_clients')}>{tx(lang, 'Clientes ativos', 'Active clients')}</ChoiceButton>
            <ChoiceButton onClick={() => handleFixField('q2_projects')}>{tx(lang, 'Projetos por mês', 'Projects per month')}</ChoiceButton>
            <ChoiceButton onClick={() => handleFixField('q3')}>{tx(lang, 'Contratos recorrentes', 'Recurring contracts')}</ChoiceButton>
            <ChoiceButton onClick={() => handleFixField('q4')}>{tx(lang, 'Faturamento', 'Revenue')}</ChoiceButton>
            <ChoiceButton onClick={() => handleFixField('q5')}>{tx(lang, 'Dores', 'Pain points')}</ChoiceButton>
            <ChoiceButton onClick={() => handleFixField('q6')}>{tx(lang, 'Controle atual', 'Current management')}</ChoiceButton>
          </ButtonRow>
        );
      case 'leadAsk':
        return (
          <ButtonRow>
            <ChoiceButton onClick={() => handleLeadAsk(true)}>{tx(lang, 'Sim, quero!', 'Yes, please!')}</ChoiceButton>
            <ChoiceButton variant="ghost" onClick={() => handleLeadAsk(false)}>{tx(lang, 'Agora não', 'No thanks')}</ChoiceButton>
          </ButtonRow>
        );
      case 'leadName':
        return <TextInputRow placeholder={tx(lang, 'Seu nome', 'Your name')} onSubmit={handleLeadName} />;
      case 'leadCompany':
        return <TextInputRow placeholder={tx(lang, 'Nome da empresa (opcional)', 'Company name (optional)')} onSubmit={handleLeadCompany} allowEmpty />;
      case 'leadWhats':
        return <TextInputRow placeholder={tx(lang, '(11) 99999-9999', '+1 555 555 5555')} onSubmit={handleLeadWhats} />;
      case 'leadEmail':
        return <TextInputRow type="email" placeholder={tx(lang, 'voce@email.com (opcional)', 'you@email.com (optional)')} onSubmit={handleLeadEmail} allowEmpty />;
      case 'final':
        return <Link to={localPath('/')} className="block"><Button className="w-full min-h-[44px] bg-gradient-to-r from-[#ac2ee8] to-[#d64ec2] hover:opacity-90">{tx(lang, 'Conhecer a Eluvie', 'Explore Eluvie')}</Button></Link>;
      default:
        return <div className="min-h-[44px]" />;
    }
  }

  function TextInputRow({ placeholder, type = 'text', onSubmit, allowEmpty = false }: { placeholder: string; type?: string; onSubmit: () => void; allowEmpty?: boolean }) {
    return (
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="flex gap-2">
        <Input
          autoFocus
          type={type}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder}
          className="bg-[#202020] border-gray-700 text-gray-100 placeholder:text-gray-500 min-h-[44px]"
        />
        <Button type="submit" disabled={!allowEmpty && !inputValue.trim()} className="bg-gradient-to-r from-[#ac2ee8] to-[#d64ec2] hover:opacity-90 px-4 min-h-[44px] min-w-[44px] disabled:opacity-40">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    );
  }
};

// ===== Subcomponents =====

const MessageBubble = ({ from, text }: { from: 'wolly' | 'user'; text: string }) => {
  const isWolly = from === 'wolly';
  return (
    <div className={`flex items-end gap-2 animate-fade-in ${isWolly ? 'justify-start' : 'justify-end'}`}>
      {isWolly && <Avatar />}
      <div
        className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm md:text-[15px] leading-relaxed shadow ${
          isWolly
            ? 'bg-[#202020] border border-gray-800 text-gray-100 rounded-bl-sm'
            : 'bg-gradient-to-br from-[#ac2ee8] to-[#8e60e5] text-white rounded-br-sm'
        }`}
      >
        {text}
      </div>
    </div>
  );
};

const TypingBubble = () => (
  <div className="flex items-end gap-2 animate-fade-in">
    <Avatar />
    <div className="bg-[#202020] border border-gray-800 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  </div>
);

const Avatar = () => (
  <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-[#ac2ee8] to-[#5f8eea] flex items-center justify-center text-white text-xs font-semibold shrink-0 shadow">
    W
  </div>
);

const ButtonRow = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-wrap gap-2 md:justify-start">{children}</div>
);

const ChoiceButton = ({
  children, onClick, variant = 'default', active = false,
}: { children: React.ReactNode; onClick: () => void; variant?: 'default' | 'ghost'; active?: boolean }) => {
  const base = 'px-4 py-3 rounded-full text-sm font-medium transition-all border min-h-[44px] w-full md:w-auto';
  const styles = active
    ? 'bg-gradient-to-r from-[#ac2ee8] to-[#d64ec2] text-white border-transparent'
    : variant === 'ghost'
      ? 'bg-transparent text-gray-300 border-gray-700 hover:bg-gray-800'
      : 'bg-[#202020] text-gray-100 border-gray-700 hover:border-[#ac2ee8] hover:text-white';
  return <button type="button" onClick={onClick} className={`${base} ${styles}`}>{children}</button>;
};

const SummaryCard = ({ data, lang }: { data: Answers; lang: Lang }) => {
  const rows = [
    { label: tx(lang, 'Tipo de negócio', 'Business type'), value: data.tipo_negocio_label },
    { label: tx(lang, 'Clientes ativos', 'Active clients'), value: data.clientes_ativos },
    { label: tx(lang, 'Projetos por mês', 'Projects per month'), value: data.projetos_mes },
    { label: tx(lang, 'Contratos recorrentes', 'Recurring contracts'), value: data.contratos_recorrentes },
    { label: tx(lang, 'Faturamento', 'Revenue'), value: data.faturamento_label },
    { label: tx(lang, 'Dores', 'Pain points'), value: data.dores_labels.join(', ') || '—' },
    { label: tx(lang, 'Controle atual', 'Current management'), value: data.controle_atual_label },
  ];
  return (
    <div className="ml-10 max-w-[85%] bg-[#202020]/80 border border-gray-800 rounded-2xl p-4 space-y-2 animate-fade-in">
      {rows.map((r, i) => (
        <div key={i} className="flex justify-between gap-3 text-sm">
          <span className="text-gray-400">{r.label}</span>
          <span className="text-gray-100 font-medium text-right">{r.value || '—'}</span>
        </div>
      ))}
    </div>
  );
};

const DiagnosisCard = ({ data, lang }: { data: any; lang: Lang }) => (
  <div className="animate-fade-in mt-2 ml-10 max-w-[88%] bg-gradient-to-br from-[#202020] to-[#1f1830] border border-[#8e60e5]/40 rounded-2xl p-5 md:p-6 space-y-5 shadow-lg">
    <Section icon={<User className="h-4 w-4" />} title={tx(lang, 'Perfil do negócio', 'Business profile')}>
      <p className="text-gray-300 text-sm leading-relaxed">{data.profile}</p>
    </Section>
    <Section icon={<AlertTriangle className="h-4 w-4" />} title={tx(lang, 'Pontos de atenção', 'Watch-outs')}>
      <ul className="space-y-2">
        {data.risks.map((r: string, i: number) => (
          <li key={i} className="text-gray-300 text-sm leading-relaxed flex gap-2">
            <span className="text-[#d64ec2]">•</span><span>{r}</span>
          </li>
        ))}
      </ul>
    </Section>
    <Section icon={<Sparkles className="h-4 w-4" />} title={tx(lang, 'Plano recomendado', 'Recommended plan')}>
      <div className="bg-gradient-to-br from-[#ac2ee8]/20 to-[#5f8eea]/10 border border-[#ac2ee8]/40 rounded-xl p-4 mb-3">
        <div className="flex items-baseline gap-3 flex-wrap">
          <span className="text-2xl font-bold text-white">{data.plan}</span>
          <span className="text-xl font-semibold text-[#d64ec2]">{data.planPrice}</span>
        </div>
      </div>
      <p className="text-gray-300 text-sm leading-relaxed">{data.planReason}</p>
    </Section>
    <Section icon={<ArrowRight className="h-4 w-4" />} title={tx(lang, 'Próximo passo', 'Next step')}>
      <p className="text-gray-300 text-sm leading-relaxed">{data.nextStep}</p>
    </Section>
  </div>
);

const Section = ({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) => (
  <div>
    <h3 className="text-xs uppercase tracking-wider text-[#d64ec2] font-semibold mb-2 flex items-center gap-2">
      {icon}{title}
    </h3>
    {children}
  </div>
);

// ===== Options =====

const revenueOptions = (lang: Lang, currency: string) => {
  if (lang === 'pt-BR') {
    return [
      { value: 'under5k', label: 'Até R$5 mil' },
      { value: '5to15k', label: 'R$5k – R$15k' },
      { value: '15to30k', label: 'R$15k – R$30k' },
      { value: 'over30k', label: 'Acima de R$30k' },
    ];
  }
  if (currency === 'EUR') {
    return [
      { value: 'under5k', label: 'Under €1,000' },
      { value: '5to15k', label: '€1,000 – €3,000' },
      { value: '15to30k', label: '€3,000 – €6,000' },
      { value: 'over30k', label: 'Above €6,000' },
    ];
  }
  return [
    { value: 'under5k', label: 'Under $1,000' },
    { value: '5to15k', label: '$1,000 – $3,000' },
    { value: '15to30k', label: '$3,000 – $6,000' },
    { value: 'over30k', label: 'Above $6,000' },
  ];
};

const painOptions = (lang: Lang) => lang === 'pt-BR' ? [
  { value: 'contracts', label: 'Organizar contratos' },
  { value: 'payments', label: 'Controlar recebimentos' },
  { value: 'clients', label: 'Gestão de clientes' },
  { value: 'invoices', label: 'Emitir cobranças' },
  { value: 'all', label: 'Tudo junto 😅' },
] : [
  { value: 'contracts', label: 'Managing contracts' },
  { value: 'payments', label: 'Tracking payments' },
  { value: 'clients', label: 'Client management' },
  { value: 'invoices', label: 'Sending invoices' },
  { value: 'all', label: 'All of the above 😅' },
];

// ===== Diagnosis builder =====

function buildDiagnosis(a: Answers, lang: Lang, t: (key: string) => string) {
  const isFreelancer = a.tipo_negocio === 'freelancer';
  const isSmallAgency = a.tipo_negocio === 'small_agency';
  const recur = parseInt(a.contratos_recorrentes, 10) || 0;
  const ctrl = a.controle_atual;

  const profile = tx(lang,
    `Você toca um ${isFreelancer ? 'negócio solo' : isSmallAgency ? 'time enxuto' : 'estúdio em crescimento'} com ${a.clientes_ativos || 'alguns'} clientes ativos e cerca de ${a.projetos_mes || 'alguns'} projetos por mês${recur > 0 ? `, sustentado por ${recur} contrato(s) recorrente(s)` : ''}.`,
    `You're running a ${isFreelancer ? 'solo business' : isSmallAgency ? 'lean team' : 'growing studio'} with ${a.clientes_ativos || 'a few'} active clients and around ${a.projetos_mes || 'a few'} projects per month${recur > 0 ? `, sustained by ${recur} recurring contract(s)` : ''}.`
  );

  let risks: string[] = [];
  if (ctrl === 'notes' || ctrl === 'none' || ctrl === 'unknown') {
    risks = [
      tx(lang, 'Sem sistema formal, prazos de renovação e cobrança escapam fácil — em média 15–20% do faturamento somem sem você perceber.', 'Without a formal system, renewals and invoices slip through — on average 15–20% of revenue quietly disappears.'),
      tx(lang, 'Sem histórico estruturado por cliente, cada negociação recomeça do zero.', "Without structured history per client, every negotiation starts from scratch."),
    ];
  } else if (ctrl === 'spreadsheet') {
    risks = [
      tx(lang, 'Planilhas exigem que VOCÊ lembre de olhar. Com esse volume, o erro humano é só questão de tempo.', 'Spreadsheets rely on YOU remembering to check. At this volume, human error is just a matter of time.'),
      tx(lang, 'Não há lembretes automáticos nem alerta de contrato vencendo — você sempre joga no defensivo.', 'There are no automatic reminders or contract-expiry alerts — you always play defense.'),
    ];
  } else if (ctrl === 'other_app') {
    risks = [
      tx(lang, `Você já tem maturidade usando ${a.ferramenta_atual || 'outra ferramenta'}, mas ferramentas genéricas não falam de briefings e recorrência criativa.`, `You already have management maturity with ${a.ferramenta_atual || 'another tool'}, but generic tools don't speak briefings and creative recurrence.`),
    ];
  } else {
    risks = [tx(lang, 'Você merece uma ferramenta feita para o jeito criativo de operar.', 'You deserve a tool built for the creative way of working.')];
  }

  const fat = a.faturamento;
  let plan = 'Solo';
  let planKey = 'solo-price';
  let planReason = '';
  if (fat === 'over30k' || a.tipo_negocio === 'mid_studio') {
    plan = 'Studio';
    planKey = 'studio-price';
    planReason = tx(lang,
      'Time maior, múltiplos clientes e contratos recorrentes pedem visão consolidada e permissões por papel — exatamente o que o Studio entrega.',
      'A larger team, multiple clients and recurring contracts call for consolidated visibility and role-based permissions — exactly what Studio delivers.'
    );
  } else if (fat === '15to30k' || isSmallAgency || recur >= 3) {
    plan = 'Standard';
    planKey = 'standard-price';
    planReason = tx(lang,
      'Volume bom de clientes e recorrência ativa: o Standard cobre cobranças automáticas, contratos e fluxo financeiro sem te sobrecarregar.',
      'Healthy client volume and active recurrence: Standard covers automated billing, contracts and cash flow without overwhelming you.'
    );
  } else {
    plan = 'Solo';
    planKey = 'solo-price';
    planReason = tx(lang,
      'Pra começar com o pé direito e organizar o essencial, o Solo já te dá o básico bem feito — sem custo no primeiro momento.',
      'To start the right way and organize the essentials, Solo gives you a solid foundation — at no cost to begin with.'
    );
  }

  // Read price directly from the same translation system used by the pricing page
  const planPrice = t(planKey);

  const nextStep = tx(lang,
    'Liste agora seus 3 contratos mais importantes em um só lugar (clientes, valor mensal, próxima cobrança).',
    'Right now, list your 3 most important contracts in one place (clients, monthly value, next invoice).'
  );

  return { profile, risks, plan, planPrice, planReason, nextStep };
}

export default Diagnostic;