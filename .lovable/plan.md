

## Análise das Correções de Segurança Propostas

Analisei cada item em detalhe contra o código atual. Algumas fazem sentido, outras já estão implementadas, e uma é **perigosa e quebraria a funcionalidade**.

---

### 1. `.env` no `.gitignore` — **Aplicar**
O `.env` não está no `.gitignore`. Embora seja gerenciado automaticamente pelo Lovable, é boa prática incluí-lo.

### 2. RLS de bookings — **NÃO aplicar como proposto** ⚠️
A sugestão de remover "Anyone can view bookings" **quebraria o fluxo público de agendamento**. O componente `DateTimeStep.tsx` faz `SELECT booking_time FROM bookings` para mostrar horários já ocupados, e `BookingFlow.tsx` verifica conflitos antes de inserir. Sem SELECT público, clientes não conseguiriam agendar.

**Alternativa segura**: Manter o SELECT público mas restringir as colunas visíveis não é possível via RLS (RLS opera por linha, não coluna). A política atual já é funcional — bookings não contêm dados sensíveis além de nome/email/telefone do cliente. Se quisermos restringir, seria necessário refatorar o fluxo de agendamento para usar uma função `security definer` que verifica slots sem expor dados.

Sobre categories: a policy "Authenticated users can manage categories" **não existe** — já temos "Only admins can manage categories" e "Anyone can view". Nada a corrigir.

### 3. AdminPanel — **Já implementado** ✅
O `App.tsx` já tem um componente `AdminRoute` que verifica `useAuth` + `useUserRole` (isAdmin). Se não for admin, redireciona para `/painel`. Se não estiver logado, redireciona para `/login`. Nada a fazer.

### 4. Edge Functions — mascarar erros internos — **Aplicar**
Boa prática. Substituir `err.message` por mensagem genérica nos catch blocks de todas as edge functions, mantendo `console.error` para debugging.

**Arquivos afetados**: `create-checkout`, `create-user-manual`, `create-professional-user`, `send-booking-email`, `lookup-user-by-email`.

### 5. Domínio do email — **Aplicar**
Trocar `noreply@seudominio.com.br` por `noreply@reservagram.com.br` no `send-booking-email`.

### 6. Senha mínima 8 caracteres — **Aplicar**
Alterar validação de 6 para 8 em `create-user-manual` e `create-professional-user`.

---

### Resumo do plano

| # | Correção | Ação |
|---|----------|------|
| 1 | .gitignore | Adicionar `.env` |
| 2 | RLS bookings | **Não aplicar** — quebraria agendamento público |
| 3 | AdminPanel | Já protegido — nada a fazer |
| 4 | Edge Functions erros | Mascarar em 5 funções |
| 5 | Email domain | Trocar domínio |
| 6 | Senha mínima | 6 → 8 caracteres |

### Detalhes técnicos

- **Edge Functions**: Alterar o `catch` final de cada função para `console.error("error:", err)` + resposta genérica
- **Redeployment**: Após editar as edge functions, será necessário redeploy de todas as 5 funções
- **.gitignore**: Adicionar `.env`, `.env.local`, `.env.*.local`
- **send-booking-email**: Atualizar campo `from`
- **create-user-manual + create-professional-user**: Validação `password.length < 8` e mensagem "pelo menos 8 caracteres"

