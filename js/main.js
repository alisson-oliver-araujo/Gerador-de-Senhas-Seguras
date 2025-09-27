import { generatePassword, evaluateStrength, generateMultiple } from './generator.js';
import { copyToClipboard, validateForm, saveHistory, renderHistory, loadHistory, clearHistory } from './utils.js';

const form = document.getElementById('passwordForm');
const results = document.getElementById('results');
const historyList = document.getElementById('historyList');

const lengthNumber = document.getElementById('lengthNumber');
const lengthWarning = document.getElementById('lengthWarning');

const generateBtn = document.getElementById('generateBtn');
const generateMultipleBtn = document.getElementById('generateMultipleBtn');

// função utilitária: verifica o valor e retorna { valid, message }
function validateLengthValue(n) {
  if (n === '' || n === null || Number.isNaN(Number(n))) {
    return { valid: false, message: 'Digite um número entre 6 e 126.' };
  }
  const num = Number(n);
  if (num < 6) return { valid: false, message: 'O tamanho precisa ser maior ou igual a 6.' };
  if (num > 126) return { valid: false, message: 'O tamanho precisa ser menor ou igual a 126.' };
  return { valid: true, message: '' };
}

// valida em tempo real e atualiza UI (warning + desabilita botões)
function handleLengthInput() {
  const raw = lengthNumber.value;
  const res = validateLengthValue(raw);

  if (!res.valid) {
    lengthWarning.textContent = res.message;
    lengthWarning.classList.remove('hidden');
    lengthNumber.classList.add('invalid');
    generateBtn.disabled = true;
    generateMultipleBtn.disabled = true;
  } else {
    lengthWarning.textContent = '';
    lengthWarning.classList.add('hidden');
    lengthNumber.classList.remove('invalid');
    generateBtn.disabled = false;
    generateMultipleBtn.disabled = false;
  }
}

// inicial validação ao carregar (caso valor inicial seja inválido)
handleLengthInput();

// event listeners
lengthNumber.addEventListener('input', () => {
  // permitimos que o usuário esteja digitando; mas exibimos o aviso em tempo real
  handleLengthInput();
});

form.addEventListener('submit', (ev) => {
  ev.preventDefault();

  // usa a validação consolidada de utils.js (garante options corretos)
  const v = validateForm(form);
  if (!v.valid) {
    // Mostra os erros (a validação de comprimento também é refletida aqui)
    // Exibimos warnings inline para comprimento e alert para outros erros breves
    const lenError = v.errors.find(e => e.toLowerCase().includes('tamanho'));
    if (lenError) {
      lengthWarning.textContent = lenError;
      lengthWarning.classList.remove('hidden');
      lengthNumber.classList.add('invalid');
    }
    const otherErrors = v.errors.filter(e => !e.toLowerCase().includes('tamanho'));
    if (otherErrors.length > 0) {
      alert('Erros:\n' + otherErrors.join('\n'));
    }
    return;
  }

  const pwd = generatePassword(v.options);
  renderResult(pwd);
  saveHistory(pwd);
  renderHistory(historyList);
});

document.getElementById('generateMultipleBtn').addEventListener('click', () => {
  const v = validateForm(form);
  if (!v.valid) {
    const lenError = v.errors.find(e => e.toLowerCase().includes('tamanho'));
    if (lenError) {
      lengthWarning.textContent = lenError;
      lengthWarning.classList.remove('hidden');
      lengthNumber.classList.add('invalid');
    }
    const otherErrors = v.errors.filter(e => !e.toLowerCase().includes('tamanho'));
    if (otherErrors.length > 0) {
      alert('Erros:\n' + otherErrors.join('\n'));
    }
    return;
  }

  const list = generateMultiple(v.options, 5);
  results.innerHTML = '';
  list.forEach(pwd => {
    renderResult(pwd, false);
    saveHistory(pwd);
  });
  renderHistory(historyList);
});

function renderResult(pwd, scroll = true) {
  const item = document.createElement('div');
  item.className = 'result-item';

  const text = document.createElement('div');
  text.className = 'text';
  text.textContent = pwd;

  const actions = document.createElement('div');
  actions.style.display = 'flex';
  actions.style.gap = '8px';

  const copyBtn = document.createElement('button');
  copyBtn.textContent = 'Copiar';
  copyBtn.addEventListener('click', async () => {
    await copyToClipboard(pwd);
    copyBtn.textContent = 'Copiado!';
    setTimeout(() => copyBtn.textContent = 'Copiar', 1500);
  });

  actions.appendChild(copyBtn);
  item.appendChild(text);
  item.appendChild(actions);
  results.prepend(item);

  // Atualiza força com a última senha
  const { score, label } = evaluateStrength(pwd);
  const strengthLabel = document.getElementById('strengthLabel');
  const strengthMeter = document.getElementById('strengthMeter');

  strengthLabel.textContent = label + ' (' + score + '%)';
  strengthMeter.value = score;

  if (scroll) item.scrollIntoView({ behavior: 'smooth' });
}

// histórico na inicialização
renderHistory(historyList);

// limpar histórico
document.getElementById('clearHistory').addEventListener('click', () => {
  if (confirm('Limpar todo o histórico de senhas?')) {
    clearHistory();
    renderHistory(historyList);
  }
});
