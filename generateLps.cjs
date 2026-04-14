const fs = require('fs');
const path = require('path');

const lpsDirectory = path.join(__dirname, 'src', 'pages', 'lps');

// Create directory if it doesn't exist
if (!fs.existsSync(lpsDirectory)) {
  fs.mkdirSync(lpsDirectory, { recursive: true });
}

// Array de nichos
const segments = [
  // Beleza
  { id: 'salao-de-beleza', name: 'SalaoBelezaPage', title: 'Salões de Beleza', short: 'o seu Salão de Beleza', imgKey: 'beauty-salon' },
  { id: 'barbearia', name: 'BarbeariaPage', title: 'Barbearias', short: 'a sua Barbearia', imgKey: 'barbershop' },
  { id: 'manicure', name: 'ManicurePage', title: 'Manicures e Nail Designers', short: 'o seu espaço de Beleza', imgKey: 'manicure' },
  { id: 'clinica-de-estetica', name: 'EsteticaPage', title: 'Clínicas de Estética', short: 'a sua Clínica de Estética', imgKey: 'esthetic-clinic' },
  
  // Saúde Física e Mental
  { id: 'clinica-medica', name: 'ClinicaMedicaPage', title: 'Clínicas Médicas', short: 'a sua Clínica', imgKey: 'medical-clinic' },
  { id: 'dentista', name: 'DentistaPage', title: 'Dentistas e Consultórios Odontológicos', short: 'o seu Consultório', imgKey: 'dentist' },
  { id: 'psicologo', name: 'PsicologoPage', title: 'Psicólogos', short: 'o seu Consultório de Psicologia', imgKey: 'psychologist' },
  { id: 'terapeuta', name: 'TerapeutaPage', title: 'Terapeutas Gerais', short: 'os seus atendimentos terapêuticos', imgKey: 'therapy' },
  { id: 'nutricionista', name: 'NutricionistaPage', title: 'Nutricionistas', short: 'a sua atuação como Nutricionista', imgKey: 'nutritionist' },
  { id: 'fisioterapeuta', name: 'FisioterapeutaPage', title: 'Fisioterapeutas', short: 'a sua Fisioterapia', imgKey: 'physiotherapy' },
  { id: 'fonoaudiologo', name: 'FonoaudiologoPage', title: 'Fonoaudiólogos', short: 'a sua Fonoaudiologia', imgKey: 'speech-therapist' },
  { id: 'dermatologista', name: 'DermatologistaPage', title: 'Dermatologistas', short: 'o seu Consultório Dermatológico', imgKey: 'dermatology' },

  // Esportes e Aulas
  { id: 'estudio-de-pilates', name: 'PilatesPage', title: 'Estúdios de Pilates', short: 'o seu Estúdio de Pilates', imgKey: 'pilates-studio' },
  { id: 'personal-trainer', name: 'PersonalTrainerPage', title: 'Personal Trainers', short: 'as suas aulas particulares', imgKey: 'personal-trainer' },
  { id: 'quadra-esportiva', name: 'QuadraEsportivaPage', title: 'Quadras Esportivas', short: 'a locação das suas Quadras', imgKey: 'sports-court' },
  { id: 'professor-particular', name: 'ProfessorParticularPage', title: 'Professores Particulares', short: 'as suas Aulas', imgKey: 'tutor' },

  // Serviços e Consultoria
  { id: 'advogado', name: 'AdvogadoPage', title: 'Advogados e Escritórios', short: 'o seu Escritório de Advocacia', imgKey: 'lawyer' },
  { id: 'contador', name: 'ContadorPage', title: 'Contadores', short: 'o seu Escritório de Contabilidade', imgKey: 'accountant' },
  { id: 'consultor', name: 'ConsultorPage', title: 'Consultores', short: 'a sua Consultoria', imgKey: 'consulting' },
  { id: 'mentor', name: 'MentorPage', title: 'Mentores', short: 'as suas Mentorias', imgKey: 'mentoring' },

  // Veículos
  { id: 'lava-car', name: 'LavaCarPage', title: 'Lava-rápidos (Lava-car)', short: 'o seu Lava-car', imgKey: 'car-wash' },
  { id: 'estetica-automotiva', name: 'EsteticaAutomotivaPage', title: 'Estética Automotiva', short: 'o seu espaço de Estética Automotiva', imgKey: 'auto-detailing' },
  { id: 'auto-escolas', name: 'AutoEscolaPage', title: 'Autoescolas', short: 'a frota e as aulas da sua Autoescola', imgKey: 'driving-school' },

  // Pets
  { id: 'pet-shop', name: 'PetShopPage', title: 'Pet Shops', short: 'o seu Pet Shop', imgKey: 'pet-shop' },
  { id: 'clinica-veterinaria', name: 'VeterinariaPage', title: 'Clínicas Veterinárias', short: 'a sua Clínica Veterinária', imgKey: 'veterinarian' },
  { id: 'adestrador-de-caes', name: 'AdestradorPage', title: 'Adestradores de Cães', short: 'os seus treinos com cães', imgKey: 'dog-trainer' },
  { id: 'dog-walker', name: 'DogWalkerPage', title: 'Dog Walkers', short: 'os seus passeios', imgKey: 'dog-walker' },

  // Serviços Domésticos e Fixos
  { id: 'servico-de-limpeza', name: 'LimpezaPage', title: 'Serviços de Limpeza', short: 'a rotina de Diaristas ou Limpeza de Estofados', imgKey: 'cleaning-service' },
  { id: 'instaladores', name: 'InstaladoresPage', title: 'Instaladores', short: 'os seus serviços de Instalação e Manutenção', imgKey: 'hvac' },
];

segments.forEach(segment => {
  const content = `import { SegmentLPTemplate } from "../SegmentLPTemplate";
import { Sparkles, CalendarClock, Globe, Users } from "lucide-react";

export default function ${segment.name}() {
  return (
    <SegmentLPTemplate
      nichoTitle="${segment.title}"
      nichoShort="${segment.short}"
      heroSubtitle="O fim das mensagens esquecidas no WhatsApp. Receba reservas 24 horas por dia e ocupe o topo das pesquisas na sua região."
      imageUrl="https://loremflickr.com/800/600/${segment.imgKey}?lock=1"
      imageAlt="Foto representativa para ${segment.title}"
      benefits={[
        {
          icon: CalendarClock,
          title: "Agenda funcionando 24h",
          desc: "Seus clientes veem os horários livres e marcam sozinhos, sem trocar mensagens com você."
        },
        {
          icon: Globe,
          title: "Diretório regional",
          desc: "Seu perfil aparece para novos clientes da sua área que estão buscando por ${segment.title.toLowerCase()}."
        },
        {
          icon: Users,
          title: "Fidelização de Clientes",
          desc: "Lembretes proativos pelo WhatsApp diminuem as faltas e esquecimentos em até 80%."
        }
      ]}
    />
  );
}
`;

  fs.writeFileSync(path.join(lpsDirectory, `${segment.name}.tsx`), content);
});

console.log('29 páginas geradas com sucesso!');
