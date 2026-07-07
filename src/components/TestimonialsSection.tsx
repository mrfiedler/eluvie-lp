
import { Star } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const TestimonialsSection = () => {
  const { t, language } = useLanguage();

  const testimonials = [
    {
      content: language === 'pt-BR' 
        ? "Já experimentei todos os aplicativos financeiros. A Eluvie é a única que parece ter sido feita para o fluxo de trabalho da minha agência criativa."
        : "I've tried every finance app out there. Eluvie is the only one that feels like it was made for my creative agency workflow.",
      author: language === 'pt-BR' ? "Natasha Silva" : "Natasha Singh",
      role: language === 'pt-BR' ? "Agência de Marketing Digital" : "Digital Marketing Agency",
      rating: 5,
      image: "https://randomuser.me/api/portraits/women/68.jpg"
    },
    {
      content: language === 'pt-BR'
        ? "Gerencio pacotes recorrentes de várias marcas ao mesmo tempo. A Eluvie deixou tudo em um só painel - nunca mais perdi um vencimento."
        : "I manage recurring packages for several brands at once. Eluvie put everything in one dashboard - I never miss a renewal anymore.",
      author: language === 'pt-BR' ? "Marcos Chen" : "Marcus Chen",
      role: language === 'pt-BR' ? "Profissional de Social Media" : "Social Media Professional",
      rating: 5,
      image: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      content: language === 'pt-BR'
        ? "O Eluvie parece um estúdio criativo, não um aplicativo bancário. Gerenciar as finanças do meu estúdio de design nunca foi tão intuitivo."
        : "Eluvie feels like a creative studio, not a bank app. Managing my design business finances has never been more intuitive.",
      author: language === 'pt-BR' ? "Sofia Martins" : "Sophia Martinez",
      role: language === 'pt-BR' ? "Proprietária de Estúdio de Design" : "Graphic Design Studio Owner",
      rating: 5,
      image: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      content: language === 'pt-BR'
        ? "Gerenciar as finanças do meu trabalho freela parece menos doloroso – e até divertido. Finalmente saio das planilhas."
        : "Managing my freelance finances feels less painful – and even fun. I finally left spreadsheets behind.",
      author: language === 'pt-BR' ? "Carlos Rodriguez" : "Carlos Rodriguez",
      role: language === 'pt-BR' ? "Freelancer Criativo" : "Creative Freelancer",
      rating: 5,
      image: "https://randomuser.me/api/portraits/men/75.jpg"
    }
  ];

  return (
    <section className="section bg-[#1a1a1a] relative overflow-hidden">
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">{t('what-creatives-saying')}</h2>
          <p className="text-lg text-gray-400">
            {t('testimonials-desc')}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-[#202020] rounded-xl p-6 shadow-md border border-gray-700 relative"
            >
              <div className="flex space-x-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
                {Array.from({ length: 5 - testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-gray-600" />
                ))}
              </div>
              
              <p className="text-gray-300 mb-6 italic">{testimonial.content}</p>
              
              <div className="flex items-center">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.author}
                  className="h-12 w-12 rounded-full mr-4 border border-gray-700" 
                />
                <div>
                  <div className="font-medium text-white">{testimonial.author}</div>
                  <div className="text-sm text-gray-400">{testimonial.role}</div>
                </div>
              </div>
              
              <div className="absolute top-4 right-6 opacity-10">
                <svg className="h-16 w-16 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-10zm-14 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.999v10h-9.999z" />
                </svg>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <a href="#" className="inline-flex items-center text-blue-400 hover:text-blue-300">
            <span>{t('read-more')}</span>
            <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
