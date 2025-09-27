# Gerador de Senhas Seguras

Aplicativo web simples para gerar senhas seguras com validação, histórico e cópia para área de transferência.

## Como executar

1. Baixe/copiei os arquivos para uma pasta local (mantenha a estrutura `js/` e `images/`).
2. Abra `index.html` em um navegador moderno (Chrome, Edge, Firefox). Alguns navegadores podem bloquear módulos ESM via `file://` — se tiver problema rode um servidor local simples:

```bash
# Python 3
python -m http.server 8000
# depois abra http://localhost:8000
```

## O que o projeto faz

- Recebe dados do usuário via formulário (tamanho, tipos de caracteres, evitar ambiguidades).
- Valida entradas (tamanho entre 4–128 e pelo menos um tipo selecionado).
- Gera senhas e garante que cada tipo selecionado apareça pelo menos uma vez.
- Avalia a força da senha (retorna score e rótulo).
- Permite copiar senhas e salva um histórico no `localStorage`.

## Observações técnicas

- JavaScript modular (ES modules): `type="module"` em `index.html`.
- Documentação das funções em JSDoc (veja `js/generator.js` e `js/utils.js`).
- Usa métodos nativos do JS: `map`, `filter`, `reduce`, `forEach`, `sort`, `find` (exemplos distribuídos nos arquivos JS).
