
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import translations from '@/translations/about';
import { Target, Compass } from 'lucide-react';

const About = () => {
  const { language } = useLanguage();
  
  // Content is now hardcoded instead of using localStorage
  const aboutContent = {
    title: {
      en: 'About Eluvie',
      'pt-BR': 'Sobre a Eluvie'
    },
    description: {
      en: 'Eluvie wasn\'t created to fix finances, but to reinvent your relationship with them. We don\'t want to compete with spreadsheets, dashboards, or old platforms disguised as modern ones. We started with a question: "What if taking care of money was as fluid as sketching or creating a new project?" Born from the minds of creatives who also run businesses, Eluvie transforms financial control into something visual, human, and surprisingly enjoyable. It\'s not about becoming a finance expert, it\'s about feeling in tune with your numbers without losing your rhythm. We are the result of when creativity finally meets clarity.',
      'pt-BR': 'A Eluvie não foi criada para consertar as finanças, mas para reinventar sua relação com elas. Não queremos competir com planilhas, dashboards ou plataformas antigas disfarçadas de modernas. Começamos com uma pergunta: "E se cuidar do dinheiro fosse tão fluido quanto rabiscar ou criar um novo projeto?" Nascida da cabeça de criativos que também tocam negócios, a Eluvie transforma o controle financeiro em algo visual, humano e, surpreendentemente, prazeroso. Não é sobre virar expert em finanças, é sobre se sentir em sintonia com os seus números sem perder o ritmo. Nós somos o resultado de quando a criatividade finalmente encontra a clareza.'
    },
    mission: {
      en: 'More Freedom, Fewer Problems. We believe that financial control should not stifle your creativity. Eluvie gives you the power to make smart decisions without relying on confusing spreadsheets. Marketing agencies, social media professionals, design studios — and creative freelancers too — Eluvie was made for those who think visually and work intuitively. It\'s not just about controlling money, it\'s about feeling good doing it.',
      'pt-BR': 'Mais Liberdade, Menos Problemas. Acreditamos que o controle financeiro não deve sufocar sua criatividade. A Eluvie dá o poder de tomar decisões inteligentes sem depender de planilhas confusas. Agências de marketing, profissionais de social media, estúdios de design — e também freelancers criativos — a Eluvie foi feita para quem pensa de forma visual e trabalha de forma intuitiva. Não é só sobre controlar dinheiro, é sobre se sentir bem fazendo isso.'
    },
    story: {
      en: 'Eluvie was created by a creative entrepreneur and agency owner tired of overly complicated and technical financial tools. The goal? A platform that would bring to finances the same fluidity and clarity that creatives expect from the tools they love.',
      'pt-BR': 'A Eluvie foi criada por um empreendedor criativo e dono de agência cansado de ferramentas financeiras complicadas e técnicas demais. O objetivo? Uma plataforma que trouxesse para as finanças a mesma fluidez e clareza que os criativos esperam das ferramentas que amam.'
    },
    values_title: {
      en: 'In summary, we are committed to:',
      'pt-BR': 'Em resumo, nos comprometemos com:'
    },
    values_headers: {
      en: ['Flow Clarity,', 'Attractive Visuals,', 'Creative Control,'],
      'pt-BR': ['Clareza de Fluxo,', 'Visual atrativo,', 'Controle Criativo,']
    },
    values_content: {
      en: [
        'because understanding your money should not interrupt your rhythm, but enhance it.',
        'because numbers should speak your language, with graphics, not fine print.',
        'because confidence is born when your finances are as intuitive as your art.'
      ],
      'pt-BR': [
        'porque entender seu dinheiro não deve interromper seu ritmo, mas sim aprimorá-lo.',
        'porque os números devem falar a sua língua, com gráficos, não com letras miúdas.',
        'porque a confiança nasce quando suas finanças são tão intuitivas quanto sua arte.'
      ]
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-gray-100">
      <Navbar />

      <main className="pt-24 pb-20">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full bg-[#ac2ee8]/20 blur-3xl" />
            <div className="absolute top-20 right-0 w-[360px] h-[360px] rounded-full bg-[#5f8eea]/20 blur-3xl" />
          </div>
          <div className="container mx-auto px-4 md:px-6 py-16 md:py-24">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#ac2ee8] via-[#d64ec2] to-[#5f8eea]">
                {aboutContent.title[language]}
              </h1>
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                {aboutContent.description[language]}
              </p>
            </div>
          </div>
        </section>

        {/* Mission + Story */}
        <section className="container mx-auto px-4 md:px-6 py-8 md:py-12">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl bg-[#202020] border border-gray-800 hover:border-brand-purple/60 transition-colors p-8 h-full flex flex-col">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-[#ac2ee8] to-[#d64ec2] mb-5">
                <Target className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">
                {translations['our-mission'][language]}
              </h2>
              <p className="text-gray-300 leading-relaxed">
                {aboutContent.mission[language]}
              </p>
            </div>
            <div className="rounded-2xl bg-[#202020] border border-gray-800 hover:border-brand-blue/60 transition-colors p-8 h-full flex flex-col">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-[#8e60e5] to-[#5f8eea] mb-5">
                <Compass className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">
                {translations['our-story'][language]}
              </h2>
              <p className="text-gray-300 leading-relaxed">
                {aboutContent.story[language]}
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="container mx-auto px-4 md:px-6 py-12 md:py-16">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-white text-center">
                {aboutContent.values_title[language]}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {aboutContent.values_headers[language].map((header, index) => (
                <div
                  key={index}
                  className="relative rounded-2xl bg-gradient-to-br from-[#202020] to-[#1a1a1a] border border-gray-800 p-6 pt-7 hover:-translate-y-1 transition-transform overflow-hidden"
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-brand-gradient" />
                  <div className="absolute top-4 right-4 text-5xl font-bold bg-clip-text text-transparent bg-brand-gradient opacity-30">
                    0{index + 1}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {header.replace(/,$/, '')}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {aboutContent.values_content[language][index]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
