## 1. Perguntas para Compreensão do Projeto

**Para entender melhor o projeto e suas necessidades:**

**Qual é o objetivo do site?**

- O site possuí três objetivos:

1. Captar Leads Qualificados
   A landing page tem como principal objetivo atrair visitantes interessados no aprendizado de idiomas e convertê-los em leads (contatos). Isso é feito por meio de ofertas atrativas, como aulas gratuitas, testes de nível ou materiais exclusivos, que incentivam o preenchimento de formulários. Assim, é possível iniciar um relacionamento estratégico e personalizado com o potencial aluno.

2. Vender com Credibilidade e Persuasão:
   A página deve apresentar o curso de forma profissional, transmitindo autoridade, confiança e qualidade. Isso inclui exibir depoimentos reais, resultados comprovados, certificações, metodologias eficazes e diferenciais da escola. Gatilhos mentais como prova social e escassez ajudam a aumentar a taxa de conversão. O foco é transformar o visitante em aluno, com uma jornada de decisão clara e confiável.

3. Ampliar o Alcance e Facilitar a Divulgação:
   Uma landing page bem estruturada também serve como uma vitrine digital facilmente compartilhável, sendo ideal para campanhas em redes sociais, e-mail marketing e tráfego pago. Isso permite que a divulgação do curso seja mais rápida, direcionada e escalável, alcançando novos públicos com muito mais eficiência do que meios tradicionais.

**Como serão as aulas e elas vão ser através do site?**

- As aulas serão 100% online e o site servirá somente como instrumento de divulgação e captção de novos alunos e para vender aulas agendadas. As aulas não serão dentro do site.

**Qual é o público-alvo do site? (Idade, interesses, nível de conhecimento em japonês)**

- O público alvo é diversificado e abrange conhecimento para todos os níveis, des do iniciante ao avançado para todos os generos e idades.

**Quais funcionalidades do projeto já funcionam?**

- O projeto já conta com uma base de frontend bem estruturada, que combina design responsivo e interatividade para oferecer uma experiência de navegação fluída, com cores e comunicação visual que casam bem com a proposta de venda de cursos para aprendizado de japonês online. As funcionalidades e estrutura do projeto atual fornecem uma base sólida para futuras melhorias, expansões e aplicações backend para enfim finalizar e entregar o projeto.

**Quais funcionalidades do projeto ainda precisam funcionar ou serem implantadas?**

- O projeto precisa de toda a implementação backend e banco de dados.

**Qual o grande problema que existe hoje no projeto e precisa de uma solução?**

- O grande problema que existe hoje no projeto é que por se tratar de aulas online, o professor Kengi trabalha com uma agenda apertada. Hoje ele já tem 50% do horários preechidos e a landinpage servirá como uma forma de preencher esses outros 50%, além de gerar uma fila de espera, para em caso de desistencias e cancelamentos, já tenha potenciais alunos para preencher os horarios novamente.
  E por que isso é grande problema? Porque precisamos implementar um sistema de `agenda` na página, que mostre para os alunos os horários que Kengi tem disponivel, antes que usuário efetive a compra, pois se o usuário fazer a compra e Kengi não tiver disponibilidade para aquele dia e horário, isso será um grande problema.

**Quais idéias você tem para resolver esse grande problema?**

- De ínicio, pensei no seguinte: Vamos imaginar que as aulas e `horários`fossem como se fossem `produtos`.
  Exemplos:

Aula Particular seria o pai
Planos (mensal, semestral e anual) seriam o complemento do pai
Dias da Semana seriam filhos
Horários (referente a cada dia da semana) subfilhos

Então digamos que o usuário escolha `Aulas Particular` > `Plano Mensal` > `Toda Segunda` > E dentro dessa segunda aparece os horários disponiveis como se fossem produtos, exemplo: `Das 11:00 ao 12:00` , `Das 14:00 as 15:00` , `Das 16:00 as 17:00`.

Ai digamos que o usuário comprasse `Aulas Particular` > `Plano Mensal` > `Toda Segunda` > `Das 11:00 ao 12:00`. Ai automáticamente, quando outro usuário tivesse interesse em `Aulas Particular` > `Plano Mensal` > `Toda Segunda` > Só teriam `Das 14:00 as 15:00` e `Das 16:00 as 17:00`, porque `Das 11:00 ao 12:00` foi vendido anteriormente.

**Em qual local do site você pensou em implantar essa agenda?**

- Pensei em implantar e solução de `agenda` no passo _3._ descritos em **pagamento.html** no final da página.

**Quais tecnologias você deseja usar para resolver os problemas atuais e oque ainda precisa ser implantado?**

- Desejo usar a linguagem de programação C# com .Net8 para fazer toda estrutura do backend, MYSQL para o banco de dados e uma API segura e estruturada de banco e pagamentos para a aréa de pagamentos.

**Quais métricas de sucesso você gostaria de acompanhar? (Visitas, conversões, feedback dos usuários)**

- Gostaria de uma métrica de visitas e um site opmitizado para ser encontardo rápidamente através de pesquisas.

## 2. Visão Geral do Projeto

**Nome do Projeto:** Kengi Idiomas
_Descrição:_ O projeto é uma landing page de divulgação mas também serve como mini plataforma para venda online de ensino de japonês, oferecendo aulas para diferentes níveis (básico, intermediário e avançado). O site é responsivo e utiliza uma combinação de HTML, CSS e JavaScript para sua implementação.

## 3. Tecnologias Utilizadas

HTML: Estrutura básica do site, com uso de tags semânticas e metodologia BEM, para melhor acessibilidade e SEO.
CSS: Estilização do site utilizado em sua maioria CSS puro mas também com algumas partes em Tailwind CSS e estilos personalizados. O projeto utiliza um sistema de variáveis CSS bem como também uma arquitetura de pages css modular e separada para cada cada section a páginas, interligando-as com import para facilitar e padronizar a manutenção das cores, fontes e reaproveitar partes que se repetem no site, como no caso o header e o footer que são iguais em todas as páginas.
JavaScript: Implementação de interatividade, como menus responsivos, carrosséis de depoimentos e formulários de contato. Também seguem uma estrtura modular de acordo com sections e insteligadas por imports e exports.
Frameworks e Bibliotecas:
Tailwind CSS: Para estilização rápida e responsiva.
Swiper.js: Para carrosséis de depoimentos e planos.
Font Awesome: Para ícones.
Node também está instalado no projeto, contando com a pasta node_modules.

## 4. Funcionalidades do Site

**Sections Globais**
Header: Menu de navegação com links com id's linkados para diferentes seções do site. conta também com Ícone de menu hamburguer para dispositivos móveis.

Footer: Informações de contato, links para redes sociais e informações legais.

Obs: < Essas duas sections estão e dever estar em todas páginas da projeto.>

    ** Seções Principais:**
    Home: Apresentação do professor e descrição do curso.
    Curso: Detalhes sobre a metodologia de ensino.
    Planos: Apresentação dos diferentes planos de aulas (particular, em grupo, semestral, anual).
    Sobre: Informações sobre o professor Kengi.
    Depoimentos: Carrossel com feedback de alunos.

    **Seção Importante**
    Contato: Formulário estilizado e apresentado em tela para que os usuários possam entrar em contato e enviar um email direto para o professor Kengi, sem que aja necessidade de fazer um login ou cadastro. Ponto chave do site para o usuário tirar dúvidas dobre como é curso, como comprar e etc.. diretamente com o professor, que mantém um contato ativo e tem o costume de responder os emails rapidamente. (Essa parte não está funcional e [precisa} ser impletado essa função. Obs.: o email do professor que receberá os emails dos alunos é: kengiteruya@gmail.com)

## 5. Estrutura de Estilos (CSS)

Global Styles: Arquivo global.css que importa outros arquivos de estilo, como variáveis, fontes e estilos de header e footer.
Responsividade: Utilização de media queries para adaptar o layout em diferentes tamanhos de tela.
Estilos Específicos: Cada página possui seu próprio arquivo CSS para estilos adicionais.

## 6. Scripts JavaScript

Interatividade:
header.js: Gerencia a abertura e fechamento do menu hamburguer.
footer.js: Implementa a funcionalidade de compartilhamento nas redes sociais.
contact.js: Gerencia o formulário de contato.
especial.js: Configura o carrossel de planos.
studants.js: Configura o carrossel de depoimentos.

## 7. Arquitetura Estrtural Completa do Projeto Atual

landing_page_kengi-idiomas/
├── .vercelignore # Arquivo de configuração para Vercel
├── assets/
│ ├── CSS/
│ │ ├── global/ # Estilos globais
│ │ │ ├── fonts.css # Importação de fontes
│ │ │ ├── footer.css # Estilos do footer
│ │ │ ├── header.css # Estilos do header
│ │ │ ├── global.css # Estilos globais
│ │ │ └── variables.css # Variáveis de estilo
│ │ └── pages/ # Estilos específicos de páginas
│ │ ├── comunidade/ # Estilos da página comunidade
│ │ │ ├── community.css # Estilos da comunidade
│ │ │ └── partials_community/ # Estilos parciais da comunidade
│ │ ├── espera/ # Estilos da página espera
│ │ │ ├── wait.css # Estilos da espera
│ │ │ └── partials_wait/ # Estilos parciais da espera
│ │ ├── grupo/ # Estilos da página grupo
│ │ │ ├── group.css # Estilos do grupo
│ │ │ └── partials_group/ # Estilos parciais do grupo
│ │ ├── index/ # Estilos da página inicial
│ │ │ ├── index.css # Estilos da página inicial
│ │ │ └── partials/ # Estilos parciais da página inicial
│ │ │ ├── about.css # Estilos da seção sobre
│ │ │ ├── contact.css # Estilos da seção contato
│ │ │ ├── course.css # Estilos da seção curso
│ │ │ ├── plans.css # Estilos da seção planos
│ │ │ ├── testimonials.css # Estilos da seção depoimentos
│ │ │ └── home.css # Estilos da seção home
│ ├── favicons/ # Ícones do site
│ │ └── icon.PNG # Ícone principal
│ ├── fonts/ # Fontes utilizadas
│ │ └── UD_Digi_Kyokasho_NP-B.ttf # Fonte personalizada
│ └── images/ # Imagens utilizadas no site
│ ├── footer_images/ # Imagens do footer
│ │ └── kengi_logo.svg # Logo do Kengi
│ ├── index_images/ # Imagens da página inicial
│ │ ├── about/ # Imagens da seção sobre
│ │ │ ├── about_elipse-image.PNG # Imagem em elipse
│ │ │ └── about_photo.svg # Foto da seção sobre
│ │ ├── contact/ # Imagens da seção contato
│ │ │ ├── background_contact.svg # Fundo do formulário de contato
│ │ │ ├── background_contact2.svg # Segundo fundo do formulário
│ │ │ ├── background_contact3.svg # Terceiro fundo do formulário
│ │ │ ├── photos_contact.svg # Fotos de contato
│ │ │ └── photos_contact2.svg # Segunda foto de contato
│ │ ├── course/ # Imagens da seção curso
│ │ │ └── image_course.svg # Imagem do curso
│ │ ├── header/ # Imagens do header
│ │ │ └── logo_header.svg # Logo do header
│ │ ├── home/ # Imagens da seção home
│ │ │ ├── aluns-photo_home.svg # Foto de alunos
│ │ │ ├── photo_home.svg # Foto principal da home
│ │ │ ├── quote_home.svg # Ícone de citação
│ │ │ └── whatsapp_home.svg # Ícone do WhatsApp
│ │ ├── particular_images/ # Imagens da seção particular
│ │ │ ├── cards/ # Imagens dos cards
│ │ │ │ ├── anual_card.svg # Card anual
│ │ │ │ ├── mensal_card.svg # Card mensal
│ │ │ │ └── semetral_card.svg # Card semestral
│ │ │ ├── div0.svg # Imagem de div
│ │ │ └── div1.svg # Outra imagem de div
│ │ ├── payment_images/ # Imagens da seção de pagamento
│ │ │ ├── Anual.png # Imagem do plano anual
│ │ │ ├── plano mensal.png # Imagem do plano mensal
│ │ │ ├── product**info-image.png # Imagem do produto
│ │ │ ├── product**plan-image.png # Imagem do plano
│ │ │ └── Semestral.png # Imagem do plano semestral
│ │ ├── plans_images/ # Imagens da seção de planos
│ │ │ ├── image (1).jpg # Imagem 1
│ │ │ ├── image (2).jpg # Imagem 2
│ │ │ └── plans_background.svg # Fundo dos planos
│ │ │ ├── plans_especial.png # Imagem do plano especial
│ │ │ └── plans_group.png # Imagem do plano em grupo
├── index.html # Página inicial do site
├── comunidade.html # Página da comunidade
├── espera.html # Página de espera
├── grupo.html # Página do grupo
├── pagamento.html # Página de pagamento
├── particular.html # Página particular
└── node_modules/ # Dependências do projeto

## 8. Descrição mais Importantes da do Estrutura do Projeto

**Arquitetura de Pastas:**

- /assets: Contém todos os recursos estáticos, como CSS, imagens e fontes.

- /CSS: Contém os arquivos de estilo, organizados em subpastas para global e páginas específicas.

- /js: Contém scripts JavaScript para funcionalidades específicas do site.

- index.html: Página principal do site.

- comunidade.html, espera.html : Páginas adicionais que fazem parte da plataforma.

- grupo.html e particular.html (aqui onde o backend [precisa} começar a ser implementado) :
  · Páginas que remetem a escolha do `modo` do curso e que especificam ao usuários sobre as diferenças , características e preços entre os dois `modos`.
  · Em cada uma delas, o usuário terá `3 opções`, totalizando `6 opções` de escolha para compra, sendo em cada um dos `modos` : `Plano Mensal` , `Semestral` e `Anual`.
  · Ao escolher, o usuário será encaminhado a página para pagamento.

- pagamento.html (parte mais importante do projeto , e onde o backend [precisará} ser implementado fortemente e funcionar perefeitamente pois é aqui onde usuário irá se cadastrar, logar e enfim efetivar a compra):
  · Página de `destino final` do usuário após escolher o `modo`(se as aulas serão `particulares` ou se vão ser em `grupos`) e o `plano` de curso (`mensal` , `semestral` ou `anual`).
  · Essa página tem quatro etapas imporantes sendo:
  _1._ Login : Sem o login o usuário não poderá dar presseguimento na compra. É aqui onde ele irá se cadastrar com um e-mail e senha ou poderá `continuar com Google` (essa parte [precisa} aplicar a API da Google).
  _2._ Escolha seu plano : Ao chegar aqui usúario já terá o `modo` e `plano` de curso selecionado, plano esse que será herdado de sua escolha anterior dentre as páginas `grupo.html` e `particular.html`. Aqui o usúario poderá prosseguir para a fase _3_ com o plano já escolhido anteriormente mas também poderá ter a sua última chance de mudar de idéia e alterar sua escolha de `modo` e `plano`.
  _3._ **Agenda** : Seria aqui onde seria implantado a solução para resolver o grande **problema** que projeto tem. Aqui é onde o usúario poderia ver quais os horários disponíveis dentro do `modo` > `plano` que ele escolheu, para no final ficar: `modo` > `plano` > `dia` > `horário` ou seja `Aulas Particular` > `Plano Mensal` > `Toda Segunda` > `Das 11:00 ao 12:00`.
  _4._ Pagamento : Nessa etapa o curso escolhido pelo usário vai estar selecionado já com os preços aplicados e prontos para o usuário efim efetivar o pagamemento e consequentemente a compra. O usuário deverá ter um ambiente seguro, seguindo as normas OAuth 2.0 e OpenID Connect e ter as seguintes opções de pagamento:
  · Cartão de crédito (com opções de parcelamento).
  · Pix.
  · Boleto.
  _5._ Confirmação : Nessa etapa o usuário deverá receber uma mensagem confirmando a compra e que receberá uma confirmação automática dos detalhes da compra e detalhes de como o professor irá entrar em contato em seu email (que usuário usou para fazer o login). (essa parte [precisa} funcionar bem e além do usuário e professor também deverá receber um email automático com detalhes de quem comprou, hora que comprou, detalhes do pagemnto e etc..).

- espera.html : Essa página será deverá entrar automáticamente para o usuário, caso o horário e data escolhida por ele estiver índisponível e consequentemente o usuário entrará em uma lista de espera e ficará no aguardo do professor Kengi entrar em contato para dizer no futuro que o `horário` e `modo` desejado pelo usuário esteja disponível.
