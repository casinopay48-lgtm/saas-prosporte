# SaaSportes — Figma Starter

Este pacote contém tokens e especificações iniciais para importar no Figma e criar o design system mínimo para a Home (mobile).

Arquivos:
- `figma-starter.json` — tokens (cores, tipografia, espaçamentos) e componentes (BalanceCard, EventCard, OddsButton, BetSlip).

Como usar no Figma

Opção 1 — Figma Tokens plugin
1. Instale o plugin "Figma Tokens" (se ainda não tiver).
2. Abra o plugin no seu arquivo Figma.
3. Importe o JSON (`figma-starter.json`) usando a opção de importação de tokens.
4. O plugin criará as cores e espaçamentos; então crie estilos de texto manualmente com os valores em `typography`.

Opção 2 — Manual (designer)
1. Crie um novo Frame mobile (390x844).
2. Crie estilos de cor com os tokens listados em `tokens.colors`.
3. Crie Text Styles conforme `tokens.typography`.
4. Crie componentes:
   - `BalanceCard` seguindo a spec em `components.BalanceCard`.
   - `EventCard` com variantes (default, live, happening_gol).
   - `OddsButton` com estados: default, hover, selected, disabled.
   - `BetSlip` com variações (collapsed/expanded).

Notas de White-label
- O JSON inclui a seção `whiteLabel` indicando quais tokens devem ser sobrescrevíveis por banca: `colors.accent-500`, `colors.warn-400`, `typography` (se necessário).
- Não misturar identidades: cada banca deve aplicar seu próprio logo e paleta.

Próximos passos recomendados
- Gerar imagens Midjourney (renders) e importar como referência.
- Se aprovar, eu posso gerar um arquivo Figma starter mais completo (arquivo .fig ou JSON com camadas/componentes prontos) — para isso preciso de autorização para criar arquivos adicionais.

Contato
- Se quiser que eu gere o pacote Figma completo (componentes + instâncias), responda "Sim, gerar Figma completo".
