// ==UserScript==
// @name         Episódios Removidos - SBT
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  Adiciona uma aba personalizada com episódios removidos e mantém funcionando com dropdown dinâmico
// @author       Você
// @match        https://mais.sbt.com.br/serie/6363758492112*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const episodiosRemovidos = [
    {
      titulo: "Os carpinteiros - Parte 1",
      descricao: "Reviva e descubra os momentos mais icônicos de Chaves e sua turma, agora com conteúdo rotativo aqui.",
      exp_date: "20/04/2025",
      duracao: "25min",
      capa: "https://i.ibb.co/GQTRKB7r/vlcsnap-2025-05-04-03h37m50s567.png"
    },
    {
      titulo: "Quanto mais quente pior - Parte 2",
      descricao: "Reviva e descubra os momentos mais icônicos de Chaves e sua turma, agora com conteúdo rotativo aqui.",
      exp_date: "20/04/2025",
      duracao: "17min",
      capa: "https://i.ibb.co/N6VWksNz/vlcsnap-2025-05-04-03h38m10s302.png"
    }
  ];

  function adicionarOpcaoNoDropdown(dropdown) {
    if (!dropdown || dropdown.querySelector('[data-id="episodios-removidos"]')) return;

    const novaOpcao = document.createElement('div');
    novaOpcao.className = "group hover:bg-bg-tertiary pl-4 pr-28 lg:pr-4 my-2 cursor-pointer";
    novaOpcao.setAttribute('data-id', 'episodios-removidos');
    novaOpcao.innerHTML = `
      <div class="font-sans select-none lg:font-normal lg:leading-[1.4rem] lg:text-body-medium font-medium leading-[1.4rem] text-mobile-body-medium text-accent-tertiary
           px-4 py-3 group-hover:text-accent-primary whitespace-nowrap">
        <span class="pointer-events-none">Episódios removidos</span>
      </div>
    `;

    novaOpcao.addEventListener('click', () => {
      exibirEpisodiosRemovidos();
      dropdown.style.display = 'none';
    });

    dropdown.appendChild(novaOpcao);
    console.log('✅ Aba "Episódios removidos" adicionada!');
  }

function exibirEpisodiosRemovidos() {
  // Oculta todos os grupos principais
  document.querySelectorAll('.flex.h-full.w-full.flex-col').forEach(el => el.style.display = 'none');

// Atualiza título principal para "Episódios removidos"
const tituloElemento = Array.from(document.querySelectorAll('div.lg\\:text-title-small span'))
  .find(el => el.textContent.trim().includes('Episódios'));
if (tituloElemento) tituloElemento.textContent = 'Episódios removidos';

// Atualiza número de episódios
const contadorElemento = Array.from(document.querySelectorAll('div.lg\\:text-button span'))
  .find(el => el.textContent.trim().match(/^Episódios\s*\(\d+\)/));
if (contadorElemento) contadorElemento.textContent = `Episódios (${episodiosRemovidos.length})`;

  // Verifica se já existe o container
  let container = document.getElementById('episodios-removidos');
  if (container) {
    container.style.display = 'flex';
    return;
  }

  // Cria container novo com estilo semelhante
  container = document.createElement('div');
  container.id = 'episodios-removidos';
  container.className = 'flex h-full w-full flex-col items-center gap-x-4 gap-y-8 text-accent-primary/80 lg:mb-16 p-4';

episodiosRemovidos.forEach(ep => {
  const wrapper = document.createElement('div');
  wrapper.className = 'w-full';

  const card = document.createElement('div');
  card.className = 'w-full flex flex-col md:flex-row min-h-[140px] gap-4 max-w-[1200px]';

  card.innerHTML = `
    <div class="relative rounded-xl w-[251px] lg:w-[325px] max-h-[140px] lg:max-h-[182px] h-full overflow-hidden h-auto flex-shrink-0 group cursor-pointer outline outline-4 outline-accent-primary/0 hover:outline-accent-primary">
    <div class="absolute p-4 w-[56px] h-[56px] m-auto left-0 right-0 top-0 bottom-0  hidden group-hover:flex text-accent-primary bg-bg-secondary  flex flex-center rounded-full " bis_skin_checked="1"><div class="h-6 w-6 m-auto  select-none" bis_skin_checked="1"><img alt="playBold" loading="lazy" width="24" height="24" decoding="async" data-nimg="1" class="w-full h-full" src="https://mais.sbt.com.br/assets/icons/play_bold.svg" style="color: transparent;"></div></div>
      <img src="${ep.capa}" alt="${ep.titulo}" class="rounded-lg w-full h-full object-cover" />
      <div class="top-[5px] left-[6px] absolute bg-bg-secondary/[85%] rounded-[6px] h-[24px] w-fit">
        <div class="font-sans select-none font-medium text-sm text-accent-primary/[85%] py-0.5 px-2">
          ${ep.duracao}
        </div>
      </div>
    </div>
    <div class="flex flex-col justify-between">
      <div>
        <div class="text-lg font-bold text-accent-primary mb-1">${ep.titulo}</div>
        <div class="text-mobile-body-medium mb-2">${ep.descricao}</div>
      </div>
      <div class="text-sm text-accent-primary bg-bg-tertiary rounded-lg w-fit px-2 py-[2px]">
        Disponível até: ${ep.exp_date}
      </div>
    </div>
  `;

  // Linha divisória fora do card
  const linha = document.createElement('div');
  linha.className = 'bg-bg-tertiary border-none h-[1px] w-full mt-8 border-l-[1px] border-accent-tertiary';

  // Monta estrutura: wrapper > card + linha
  wrapper.appendChild(card);
  wrapper.appendChild(linha);

  // Adiciona ao container final
  container.appendChild(wrapper);
});


  // Insere o container na página
  const destino = document.querySelector('main .flex.h-full.w-full.flex-col');
  if (destino && destino.parentNode) {
    destino.parentNode.appendChild(container);
  } else {
    document.body.appendChild(container); // fallback
  }
}


  function restaurarConteudoOriginal() {
    document.querySelectorAll('main .flex.h-full.w-full.flex-col').forEach(el => el.style.display = '');
    const container = document.getElementById('episodios-removidos');
    if (container) container.style.display = 'none';
  }

  const observer = new MutationObserver(() => {
    const dropdown = document.querySelector('.bg-bg-secondary.absolute.rounded-lg.z-30');
    if (dropdown) adicionarOpcaoNoDropdown(dropdown);
  });

  observer.observe(document.body, { childList: true, subtree: true });

  document.addEventListener('click', (e) => {
    const alvo = e.target.closest('.cursor-pointer');
    if (alvo && !alvo.hasAttribute('data-id')) {
      setTimeout(restaurarConteudoOriginal, 100);
    }
  });
})();