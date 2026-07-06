import { useEffect } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useLanguage } from '@/contexts/LanguageContext';

type QA = { q: string; a: string };

const FAQ: Record<'pt-BR' | 'en', QA[]> = {
  'pt-BR': [
    { q: 'Para quem a Eluvie foi feita?', a: 'A Eluvie foi feita principalmente para agências de marketing, profissionais de social media (gestores e criadores de conteúdo) e estúdios de design. Freelancers criativos também são bem-vindos e usam a mesma plataforma. Os planos se adaptam ao tamanho do seu negócio.' },
    { q: 'Preciso ter CNPJ para usar a Eluvie?', a: 'Não. Você pode usar a Eluvie como pessoa física ou jurídica. O que importa é organizar seu negócio, não o seu regime tributário.' },
    { q: 'Consigo controlar contratos de longo prazo, como pacotes de social media de 12 meses?', a: 'Sim. A Eluvie foi feita exatamente para isso. Você acompanha contratos recorrentes, datas de renovação e recebimentos mensais em um só lugar, sem depender de planilha ou memória.' },
    { q: 'Tenho tudo em planilha hoje. Como faço a transição?', a: 'É mais simples do que parece. Você cadastra seus clientes e contratos na Eluvie no seu ritmo, sem pressa. A maioria dos usuários faz a transição em uma tarde e nunca mais volta para a planilha.' },
    { q: 'A Eluvie substitui meu sistema de cobranças?', a: 'A Eluvie centraliza o controle dos seus recebimentos e contratos. Para emissão de nota fiscal, recomendamos manter seu contador ou sistema fiscal atual integrado à rotina.' },
    { q: 'Como acompanho prazos e renovações dentro da Eluvie?', a: 'Todos os seus contratos ficam organizados em um painel visual com datas de vencimento e renovação sempre à vista. Você consulta quando quiser e nunca precisa depender de memória ou post-it.' },
    { q: 'Quanto tempo leva para começar a usar?', a: 'A maioria dos usuários configura a conta e cadastra os primeiros clientes em menos de 30 minutos.' },
    { q: 'Posso cancelar quando quiser?', a: 'Sim, sem burocracia. O plano renova automaticamente a cada ano. Para não ser cobrado no próximo ciclo, basta cancelar antes da data de renovação. Você encontra essa informação direto na sua conta.' },
  ],
  en: [
    { q: 'Who is Eluvie built for?', a: 'Eluvie is built primarily for marketing agencies, social media professionals (managers and content creators) and design studios. Creative freelancers are welcome too and use the same platform. Plans adapt to the size of your business.' },
    { q: 'Do I need a registered business to use Eluvie?', a: 'No. You can use Eluvie whether you are operating as an individual or a company. What matters is getting your business organized, not your legal structure.' },
    { q: 'Can I track long-term contracts, like 12-month social media retainers?', a: 'Yes, that is exactly what Eluvie was built for. You can manage recurring contracts, renewal dates, and monthly payments all in one place. No spreadsheet or memory required.' },
    { q: 'I currently use a spreadsheet. How do I make the switch?', a: 'It is simpler than it sounds. You add your clients and contracts to Eluvie at your own pace. Most users make the switch in an afternoon and never go back to the spreadsheet.' },
    { q: 'Does Eluvie replace my invoicing system?', a: 'Eluvie centralizes your payment tracking and contract management. For tax invoicing, we recommend keeping your current accounting setup integrated into your workflow.' },
    { q: 'How do I keep track of deadlines and renewals in Eluvie?', a: 'All your contracts are organized in a visual dashboard with expiration and renewal dates always visible. Check anytime you want. No memory or sticky notes required.' },
    { q: 'How long does it take to get started?', a: 'Most users set up their account and add their first clients in under 30 minutes.' },
    { q: 'Can I cancel anytime?', a: 'Yes, no hassle. The plan renews automatically each year. To avoid being charged for the next cycle, just cancel before your renewal date. You can find that info directly in your account.' },
  ],
};

const FAQSection = () => {
  const { language, t } = useLanguage();
  const items = FAQ[language];

  useEffect(() => {
    const data = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: items.map((it) => ({
        '@type': 'Question',
        name: it.q,
        acceptedAnswer: { '@type': 'Answer', text: it.a },
      })),
    };
    let el = document.getElementById('ld-faq') as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement('script');
      el.id = 'ld-faq';
      el.type = 'application/ld+json';
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(data);
    return () => { el?.remove(); };
  }, [items]);

  return (
    <section id="faq" className="py-16 md:py-24 bg-[#1a1a1a]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-white">{t('faq-title')}</h2>
          <Accordion type="single" collapsible className="space-y-3">
            {items.map((it, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="bg-[#202020] border border-gray-800 rounded-xl px-5 data-[state=open]:border-[#8e60e5]/60"
              >
                <AccordionTrigger className="text-left text-base md:text-lg font-medium text-white hover:no-underline py-5 min-h-[56px]">
                  {it.q}
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 text-sm md:text-base leading-relaxed pb-5">
                  {it.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;