const fs = require('fs');
const path = require('path');

const appTsxPath = path.join(__dirname, 'src', 'App.tsx');
let appTsx = fs.readFileSync(appTsxPath, 'utf8');

const segments = [
  { id: 'salao-de-beleza', name: 'SalaoBelezaPage' },
  { id: 'barbearia', name: 'BarbeariaPage' },
  { id: 'manicure', name: 'ManicurePage' },
  { id: 'clinica-de-estetica', name: 'EsteticaPage' },
  { id: 'clinica-medica', name: 'ClinicaMedicaPage' },
  { id: 'dentista', name: 'DentistaPage' },
  { id: 'psicologo', name: 'PsicologoPage' },
  { id: 'terapeuta', name: 'TerapeutaPage' },
  { id: 'nutricionista', name: 'NutricionistaPage' },
  { id: 'fisioterapeuta', name: 'FisioterapeutaPage' },
  { id: 'fonoaudiologo', name: 'FonoaudiologoPage' },
  { id: 'dermatologista', name: 'DermatologistaPage' },
  { id: 'estudio-de-pilates', name: 'PilatesPage' },
  { id: 'personal-trainer', name: 'PersonalTrainerPage' },
  { id: 'quadra-esportiva', name: 'QuadraEsportivaPage' },
  { id: 'professor-particular', name: 'ProfessorParticularPage' },
  { id: 'advogado', name: 'AdvogadoPage' },
  { id: 'contador', name: 'ContadorPage' },
  { id: 'consultor', name: 'ConsultorPage' },
  { id: 'mentor', name: 'MentorPage' },
  { id: 'lava-car', name: 'LavaCarPage' },
  { id: 'estetica-automotiva', name: 'EsteticaAutomotivaPage' },
  { id: 'auto-escolas', name: 'AutoEscolaPage' },
  { id: 'pet-shop', name: 'PetShopPage' },
  { id: 'clinica-veterinaria', name: 'VeterinariaPage' },
  { id: 'adestrador-de-caes', name: 'AdestradorPage' },
  { id: 'dog-walker', name: 'DogWalkerPage' },
  { id: 'servico-de-limpeza', name: 'LimpezaPage' },
  { id: 'instaladores', name: 'InstaladoresPage' },
];

let imports = segments.map(s => `import ${s.name} from "./pages/lps/${s.name}";`).join('\n');
let routes = segments.map(s => `          <Route path="/sistema-de-agendamento-para-${s.id}" element={<${s.name} />} />`).join('\n');

// Injetar imports
if (!appTsx.includes('import SalaoBelezaPage')) {
  appTsx = appTsx.replace('const queryClient = new QueryClient();', imports + '\n\nconst queryClient = new QueryClient();');
}

// Injetar rotas antes de <Route path="/:slug" element={<BusinessPage />} />
if (!appTsx.includes('path="/sistema-de-agendamento-para-salao-de-beleza"')) {
  appTsx = appTsx.replace('<Route path="/:slug" element={<BusinessPage />} />', routes + '\n          <Route path="/:slug" element={<BusinessPage />} />');
}

fs.writeFileSync(appTsxPath, appTsx);
console.log('App.tsx atualizado com as rotas!');
