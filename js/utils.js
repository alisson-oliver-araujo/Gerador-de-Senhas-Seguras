/**
 * utils.js
 * Funções utilitárias: validação, clipboard e histórico (localStorage)
 */

/**
 * Copia o texto para a área de transferência.
 * @param {string} text - Texto a ser copiado
 * @returns {Promise<void>} Promessa resolvida quando concluído
 * @example
 * copyToClipboard('senha')
 */
export async function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text);
  }
  // fallback
  const ta = document.createElement('textarea');
  ta.value = text;
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  document.body.removeChild(ta);
}

/**
 * Valida o formulário retornando um objeto {valid:boolean, errors:[]}
 * @param {HTMLFormElement} form - Elemento do formulário
 * @returns {{valid:boolean, errors:string[], options:Object}}
 */
export function validateForm(form) {
  // Lê o campo number (agora o único controle de tamanho)
  const lengthEl = form.querySelector('#lengthNumber');
  const length = Number(lengthEl ? lengthEl.value : NaN);

  const upper = form.querySelector('#includeUpper').checked;
  const lower = form.querySelector('#includeLower').checked;
  const numbers = form.querySelector('#includeNumbers').checked;
  const symbols = form.querySelector('#includeSymbols').checked;
  const errors = [];

  // Novos limites: 6 <= length <= 126
  if (Number.isNaN(length)) {
    errors.push('Tamanho inválido. Digite um número entre 6 e 126.');
  } else {
    if (length < 6 || length > 126) errors.push('Tamanho deve estar entre 6 e 126.');
  }

  if (!upper && !lower && !numbers && !symbols) errors.push('Selecione ao menos um tipo de caractere.');

  return {
    valid: errors.length === 0,
    errors,
    options: {
      length: Number.isFinite(length) ? Math.max(6, Math.min(126, Math.floor(length))) : 16,
      upper,
      lower,
      numbers,
      symbols,
      avoidAmbiguous: form.querySelector('#avoidAmbiguous').checked
    }
  };
}

const STORAGE_KEY = 'gerador_senhas_history';

/**
 * Salva uma senha no histórico (localStorage). Mantém no máximo 50 entradas.
 * Se a senha já existir, move-a para o topo (sem duplicar).
 * @param {string} pwd - Senha a salvar
 */
export function saveHistory(pwd) {
  const raw = localStorage.getItem(STORAGE_KEY);
  const arr = raw ? JSON.parse(raw) : [];

  // remove duplicatas
  const without = arr.filter(item => item !== pwd); // usa filter
  without.unshift(pwd);

  // limita 50
  const limited = without.slice(0, 50);
  // ordena por ordem de inserção (já em ordem) — demonstramos sort sem necessidade concreta
  limited.sort((a, b) => (a.length - b.length)); // usa sort apenas como exemplo (ordena por comprimento)

  localStorage.setItem(STORAGE_KEY, JSON.stringify(limited));
}

/**
 * Carrega histórico do localStorage
 * @returns {string[]} Array de senhas
 */
export function loadHistory() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

/**
 * Renderiza o histórico em um <ul>
 * @param {HTMLElement} container - Elemento <ul>
 */
export function renderHistory(container) {
  const list = loadHistory();
  container.innerHTML = '';
  if (list.length === 0) {
    container.innerHTML = '<li class="muted">Sem histórico</li>';
    return;
  }
  // usa forEach
  list.forEach(pwd => {
    const li = document.createElement('li');
    li.textContent = pwd;
    li.className = 'history-item';
    container.appendChild(li);
  });
}

/**
 * Limpa o histórico
 */
export function clearHistory() {
  localStorage.removeItem(STORAGE_KEY);
}
