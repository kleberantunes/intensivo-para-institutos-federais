window.IF_DATA = {
  states: [
    ['AC','Acre','IFAC'],['AL','Alagoas','IFAL'],['AP','Amapá','IFAP'],['AM','Amazonas','IFAM'],
    ['BA','Bahia','IFBA / IF Baiano'],['CE','Ceará','IFCE'],['DF','Distrito Federal','IFB'],
    ['ES','Espírito Santo','IFES'],['GO','Goiás','IFG / IF Goiano'],['MA','Maranhão','IFMA'],
    ['MT','Mato Grosso','IFMT'],['MS','Mato Grosso do Sul','IFMS'],['MG','Minas Gerais','IFMG / IFSULDEMINAS / IFTM / IFNMG / IF Sudeste MG'],
    ['PA','Pará','IFPA'],['PB','Paraíba','IFPB'],['PR','Paraná','IFPR'],['PE','Pernambuco','IFPE / IF Sertão-PE'],
    ['PI','Piauí','IFPI'],['RJ','Rio de Janeiro','IFRJ / IFF'],['RN','Rio Grande do Norte','IFRN'],
    ['RS','Rio Grande do Sul','IFRS / IFSul / IFFar'],['RO','Rondônia','IFRO'],['RR','Roraima','IFRR'],
    ['SC','Santa Catarina','IFSC / IFC'],['SP','São Paulo','IFSP'],['SE','Sergipe','IFS'],['TO','Tocantins','IFTO']
  ],
  institutions: {
    RS: ['IFRS — Instituto Federal do Rio Grande do Sul','IFSul — Instituto Federal Sul-rio-grandense','IFFar — Instituto Federal Farroupilha'],
    SC: ['IFSC — Instituto Federal de Santa Catarina','IFC — Instituto Federal Catarinense']
  },
  sources: {
    RS: [
      {institution:'IFRS',title:'Provas e gabaritos anteriores',detail:'Cursos integrados, subsequentes e superiores · 2014–2026',url:'https://ingresso.ifrs.edu.br/2027/provas-e-gabaritos-anteriores/',verified:true},
      {institution:'MEC',title:'Rede Federal no Brasil',detail:'Mapa e informações oficiais dos Institutos Federais',url:'https://www.gov.br/mec/pt-br/assuntos/ept/rede-federal/institutos-federais-de-educacao-ciencia-e-tecnologia',verified:true}
    ],
    SC: [
      {institution:'IFSC',title:'Provas e gabaritos anteriores',detail:'Exames de classificação para cursos técnicos integrados e subsequentes',url:'https://www.sepei.ifsc.edu.br/web/campus-joinville/provas-e-gabaritos',verified:true},
      {institution:'MEC',title:'Rede Federal no Brasil',detail:'Mapa e informações oficiais dos Institutos Federais',url:'https://www.gov.br/mec/pt-br/assuntos/ept/rede-federal/institutos-federais-de-educacao-ciencia-e-tecnologia',verified:true}
    ]
  },
  questions: [
    {region:'BR',subject:'Matemática',topic:'Porcentagem',text:'Em um processo seletivo com 40 questões, uma candidata acertou 70%. Quantas questões ela acertou?',options:['24','26','28','30'],answer:2,explanation:'70% de 40 = 0,7 × 40 = 28.'},
    {region:'BR',subject:'Matemática',topic:'Proporção',text:'Uma planta usa escala 1:200. Uma distância de 3 cm na planta corresponde a quantos metros?',options:['3 m','6 m','60 m','600 m'],answer:1,explanation:'3 × 200 = 600 cm, que equivalem a 6 m.'},
    {region:'BR',subject:'Matemática',topic:'Equação',text:'O triplo de um número menos 5 é 31. Qual é esse número?',options:['9','10','12','14'],answer:2,explanation:'3x − 5 = 31; 3x = 36; x = 12.'},
    {region:'BR',subject:'Matemática',topic:'Geometria',text:'Um laboratório retangular mede 8 m por 6 m. Qual é sua área?',options:['14 m²','28 m²','48 m²','56 m²'],answer:2,explanation:'Área do retângulo = 8 × 6 = 48 m².'},
    {region:'BR',subject:'Linguagens',topic:'Interpretação',text:'“A biblioteca ampliou seu horário para que mais estudantes possam utilizá-la após as aulas.” Qual é a finalidade da ampliação?',options:['Diminuir o acervo','Atender mais estudantes','Encerrar as aulas','Substituir professores'],answer:1,explanation:'O trecho informa diretamente que o objetivo é ampliar o acesso dos estudantes.'},
    {region:'BR',subject:'Linguagens',topic:'Argumentação',text:'Em “A escola deve separar resíduos, pois essa prática reduz impactos ambientais”, qual trecho apresenta o argumento?',options:['A escola','deve separar','essa prática','pois essa prática reduz impactos ambientais'],answer:3,explanation:'O trecho iniciado por “pois” fornece a razão que sustenta a proposta.'},
    {region:'BR',subject:'Ciências da Natureza',topic:'Ecologia',text:'Qual ação contribui diretamente para reduzir a contaminação de rios?',options:['Descartar óleo na pia','Tratar o esgoto antes do despejo','Queimar resíduos','Retirar mata ciliar'],answer:1,explanation:'O tratamento remove poluentes antes que o efluente alcance os rios.'},
    {region:'BR',subject:'Ciências Humanas',topic:'Cidadania',text:'A participação em conselhos e audiências públicas é uma forma de:',options:['Censura','Participação cidadã','Poder hereditário','Isolamento político'],answer:1,explanation:'Esses espaços permitem que a população acompanhe e influencie decisões públicas.'},
    {region:'RS',subject:'Matemática',topic:'Tratamento da informação',text:'Uma turma registrou temperaturas de 18 °C, 20 °C, 22 °C e 24 °C. Qual foi a média?',options:['20 °C','21 °C','22 °C','23 °C'],answer:1,explanation:'A soma é 84; dividindo pelos quatro registros, a média é 21 °C.',source:'Questão autoral inspirada nas áreas cobradas em provas de cursos integrados do IFRS.'},
    {region:'RS',subject:'Ciências Humanas',topic:'Geografia regional',text:'O bioma predominante na porção sul do Rio Grande do Sul é:',options:['Caatinga','Cerrado','Pampa','Pantanal'],answer:2,explanation:'O Pampa ocupa grande parte da metade sul do Rio Grande do Sul.',source:'Questão autoral de contextualização regional.'},
    {region:'SC',subject:'Matemática',topic:'Razão',text:'Uma trilha de 12 km foi percorrida em 3 horas, com velocidade média constante. Qual foi a média por hora?',options:['3 km','4 km','6 km','9 km'],answer:1,explanation:'12 ÷ 3 = 4 km por hora.',source:'Questão autoral alinhada ao nível dos exames de classificação do IFSC.'},
    {region:'SC',subject:'Ciências Humanas',topic:'Geografia regional',text:'A atividade portuária tem grande importância econômica em Santa Catarina. Qual cidade abriga um dos principais portos do estado?',options:['Lages','Chapecó','Itajaí','Concórdia'],answer:2,explanation:'Itajaí possui um dos principais complexos portuários catarinenses.',source:'Questão autoral de contextualização regional.'}
  ]
};
