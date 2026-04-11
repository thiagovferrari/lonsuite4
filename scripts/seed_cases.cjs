const { createClient } = require('@supabase/supabase-js');
const { randomUUID } = require('crypto');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Precisa de VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no arquivo .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const generateUUID = () => randomUUID();

const generateCases = () => {
  const specialities = [
    { spec: 'Cardiologia', tags: ['Coração', 'Arritmia', 'Hipertensão', 'Aorta'], conditions: ['Infarto Agudo do Miocárdio', 'Fibrilação Atrial', 'Insuficiência Cardíaca Congestiva'] },
    { spec: 'Neurologia', tags: ['Cérebro', 'Nervo', 'Déficit', 'Cognitivo'], conditions: ['Acidente Vascular Cerebral', 'Esclerose Múltipla', 'Doença de Parkinson'] },
    { spec: 'Ortopedia', tags: ['Osso', 'Fratura', 'Articulação', 'Trauma'], conditions: ['Fratura Exposta de Fêmur', 'Osteoartrite Severa', 'Ruptura de Ligamento Cruzado'] },
    { spec: 'Pediatria', tags: ['Criança', 'Infantil', 'Crescimento', 'Vacina'], conditions: ['Bronquiolite Viral Aguda', 'Sarampo', 'Desnutrição Infantil Moderada'] },
    { spec: 'Oncologia', tags: ['Câncer', 'Tumor', 'Metástase', 'Quimioterapia'], conditions: ['Carcinoma Basocelular', 'Leucemia Linfoblástica Aguda', 'Adenocarcinoma Colorretal'] },
    { spec: 'Gastroenterologia', tags: ['Estômago', 'Intestino', 'Fígado', 'Digestão'], conditions: ['Úlcera Péptica Perfurada', 'Hepatite C Crônica', 'Síndrome do Intestino Irritável'] },
    { spec: 'Pneumologia', tags: ['Pulmão', 'Respiração', 'Vias Aéreas', 'Tosse'], conditions: ['Pneumonia Adquirida na Comunidade', 'Doença Pulmonar Obstrutiva Crônica', 'Asma Brônquica Severa'] }
  ];

  const cases = [];
  const statusOptions = ['em_andamento', 'completo', 'arquivado'];
  
  for (let i = 0; i < 20; i++) {
    const s = specialities[i % specialities.length];
    const condition = s.conditions[i % s.conditions.length];
    
    // Create random blocks
    const blocks = [];
    blocks.push({ id: generateUUID(), type: 'title', content: `Caso Clínico: ${condition} - ${s.spec}` });
    blocks.push({ id: generateUUID(), type: 'subtitle', content: 'História Clínica e Apresentação Inicial' });
    blocks.push({ 
      id: generateUUID(), 
      type: 'text', 
      content: `Paciente de ${Math.floor(Math.random() * 60) + 10} anos, sexo ${Math.random() > 0.5 ? 'masculino' : 'feminino'}, chega à emergência apresentando sintomas agudos relacionados à sua especialidade (${s.spec}). Sinais vitais instáveis, necessitando intervenção imediata.`
    });
    
    // Add a references block randomly
    if (Math.random() > 0.3) {
      blocks.push({ 
        id: generateUUID(), 
        type: 'reference', 
        content: `Guidelines da Sociedade Brasileira de ${s.spec}: https://exemplo.org.br/guidelines. Referência complementar no livro de base.` 
      });
    }

    // Add an image block (placeholder)
    if (Math.random() > 0.2) {
      blocks.push({
        id: generateUUID(),
        type: 'image',
        content: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=600',
        caption: `Ressonância Magnética Ilustrativa - Exame preliminar demonstrando alterações esperadas em ${condition}.`
      })
    }
    
    // Add conclusion text
    blocks.push({ 
      id: generateUUID(), 
      type: 'text', 
      content: `Evolução: Após 48 horas de internação o paciente evolui bem. A reavaliação laboratorial e clínica aponta sucesso terapêutico inicial. Alta programada para o 5º dia de internação com acompanhamento ambulatorial via especialista de ${s.spec}.`
    });

    const now = new Date();
    // Offset creation date just to show variety
    now.setDate(now.getDate() - Math.floor(Math.random() * 30));

    const selectedTags = ['Caso', s.spec, s.tags[Math.floor(Math.random() * s.tags.length)]];

    cases.push({
      id: generateUUID(),
      title: `Caso Clinico: ${condition}`,
      description: `Discussão detalhada e manejo clínico de um paciente com ${condition} na área de ${s.spec}.`,
      blocks: blocks,
      tags: selectedTags,
      status: statusOptions[Math.floor(Math.random() * statusOptions.length)],
      visibility: 'public', // Set to public so the user can easily see them
      owner_id: 'seeder-bot', // dummy owner
      owner_name: 'Dr. Auto-Seeder',
      created_at: now.toISOString()
    });
  }
  
  return cases;
}

const seedDatabase = async () => {
  console.log('Iniciando o seeding de 20 casos detalhados no Supabase...');
  const newCases = generateCases();
  
  const { data, error } = await supabase.from('cases').upsert(newCases);
  if (error) {
    console.error('Erro ao inserir múltiplos cases:', error);
  } else {
    console.log(`✅ Sucesso! Inseridos/atualizados ${newCases.length} casos clínicos na interface.`);
  }
}

seedDatabase();
