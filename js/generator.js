/**
 * generator.js
 * Contém funções para gerar senhas e avaliar sua força.
 */

/**
 * Gera um caractere aleatório a partir de uma string de caracteres.
 * @param {string} chars - Conjunto de caracteres para sortear.
 * @returns {string} Um caractere aleatório.
 * @example
 * randomChar('abc') // -> 'b'
 */
function randomChar(chars){
  return chars.charAt(Math.floor(Math.random()*chars.length));
}

/**
 * Gera uma senha segura com base nas opções fornecidas.
 * Garante que pelo menos um caractere de cada conjunto selecionado esteja presente.
 * @param {Object} options - Opções da senha
 * @param {number} options.length - Tamanho desejado da senha (4-128)
 * @param {boolean} options.upper - Incluir maiúsculas
 * @param {boolean} options.lower - Incluir minúsculas
 * @param {boolean} options.numbers - Incluir números
 * @param {boolean} options.symbols - Incluir símbolos
 * @param {boolean} options.avoidAmbiguous - Evitar caracteres ambíguos
 * @returns {string} Senha gerada
 * @example
 * generatePassword({length:12, upper:true, lower:true, numbers:true, symbols:false})
 */
export function generatePassword({length=16, upper=true, lower=true, numbers=true, symbols=true, avoidAmbiguous=false} = {}){
  const sets = [];
  const upperSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowerSet = 'abcdefghijklmnopqrstuvwxyz';
  const numberSet = '0123456789';
  const symbolSet = '!@#$%^&*()-_=+[]{};:,.<>?/\\|`~';
  const ambiguous = /[O0Il1]/g;

  if(upper) sets.push(upperSet);
  if(lower) sets.push(lowerSet);
  if(numbers) sets.push(numberSet);
  if(symbols) sets.push(symbolSet);

  if(sets.length === 0) throw new Error('Pelo menos um tipo de caractere deve ser selecionado.');

  // Garante um caractere de cada conjunto selecionado
  const guaranteed = sets.map(s => randomChar(s)); // usa map

  // Cria pool unificado de caracteres
  let pool = sets.join('');
  if(avoidAmbiguous) pool = pool.replace(ambiguous, '');

  // Preenche o restante
  const remainingCount = Math.max(0, length - guaranteed.length);
  const rest = Array.from({length: remainingCount}).map(()=> randomChar(pool)); // usa Array.map

  // Junta e embaralha
  const passwordArr = guaranteed.concat(rest);
  // Embaralhar com Fisher-Yates
  for(let i = passwordArr.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [passwordArr[i], passwordArr[j]] = [passwordArr[j], passwordArr[i]];
  }
  return passwordArr.join('');
}

/**
 * Avalia a força da senha retornando uma pontuação (0-100) e um rótulo.
 * Usa diversos critérios: comprimento, variedade de caracteres e presença de padrões.
 * @param {string} pwd - A senha a ser avaliada
 * @returns {{score:number,label:string}} Objeto com score (0-100) e label ('Fraca','Média','Forte','Excelente')
 * @example
 * evaluateStrength('Abc123!') // -> {score: 62, label: 'Média'}
 */
export function evaluateStrength(pwd){
  const checks = [
    {name:'length', pass: pwd.length >= 8, weight: 30},
    {name:'upper', pass: /[A-Z]/.test(pwd), weight: 15},
    {name:'lower', pass: /[a-z]/.test(pwd), weight: 15},
    {name:'number', pass: /[0-9]/.test(pwd), weight: 15},
    {name:'symbol', pass: /[^A-Za-z0-9]/.test(pwd), weight: 25}
  ];

  // soma dos pesos passados
  const score = Math.min(100, checks
    .filter(c => c.pass) // usa filter
    .map(c => c.weight) // usa map
    .reduce((acc, cur) => acc + cur, 0)); // usa reduce

  const label = score >= 85 ? 'Excelente' : score >= 65 ? 'Forte' : score >= 40 ? 'Média' : 'Fraca';

  return {score, label};
}

/**
 * Gera várias senhas (utilitário)
 * @param {Object} options - Mesmas opções de generatePassword
 * @param {number} count - Quantidade de senhas
 * @returns {string[]} Array com senhas geradas
 * @example
 * generateMultiple({length:12, upper:true}, 5)
 */
export function generateMultiple(options, count=5){
  return Array.from({length:count}).map(()=> generatePassword(options));
}
