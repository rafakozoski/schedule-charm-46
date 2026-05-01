import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Loader2, Package, Users, ArrowRightLeft } from "lucide-react";
import { toast } from "sonner";

/**
 * Diálogo de gerência completa de uma empresa pelo admin da plataforma.
 * Permite editar serviços, profissionais e transferir propriedade sem
 * precisar fazer login como o dono.
 */
export function AdminBusinessManager({
  business,
  open,
  onOpenChange,
}: {
  business: { id: string; name: string; slug: string; owner_id: string | null } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!business) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gerenciar — {business.name}</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="services" className="mt-2">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="services" className="gap-1">
              <Package className="w-3.5 h-3.5" /> Serviços
            </TabsTrigger>
            <TabsTrigger value="professionals" className="gap-1">
              <Users className="w-3.5 h-3.5" /> Profissionais
            </TabsTrigger>
            <TabsTrigger value="transfer" className="gap-1">
              <ArrowRightLeft className="w-3.5 h-3.5" /> Transferir
            </TabsTrigger>
          </TabsList>
          <TabsContent value="services">
            <ServicesPanel businessId={business.id} />
          </TabsContent>
          <TabsContent value="professionals">
            <ProfessionalsPanel businessId={business.id} />
          </TabsContent>
          <TabsContent value="transfer">
            <TransferPanel business={business} onSuccess={() => onOpenChange(false)} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

// -----------------------------------------------------------
// Serviços
// -----------------------------------------------------------
function ServicesPanel({ businessId }: { businessId: string }) {
  const queryClient = useQueryClient();
  const { data: services = [], isLoading } = useQuery({
    queryKey: ["admin-biz-services", businessId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("business_id", businessId)
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const add = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("services")
        .insert({ business_id: businessId, name: "Novo Serviço", price: 0, duration: 30 });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-biz-services", businessId] }),
    onError: (e: any) => toast.error(e.message),
  });

  const update = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { error } = await supabase.from("services").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-biz-services", businessId] }),
    onError: (e: any) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("services").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-biz-services", businessId] });
      toast.success("Serviço removido");
    },
    onError: (e: any) => toast.error(e.message),
  });

  if (isLoading) return <Loader2 className="w-5 h-5 animate-spin mx-auto" />;

  return (
    <div className="space-y-2">
      {services.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-3">Nenhum serviço.</p>
      )}
      {services.map((s) => (
        <div key={s.id} className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_auto] gap-2 p-2 border rounded-md items-end">
          <div>
            <Label className="text-xs">Nome</Label>
            <Input
              defaultValue={s.name}
              onBlur={(e) => update.mutate({ id: s.id, updates: { name: e.target.value } })}
            />
          </div>
          <div>
            <Label className="text-xs">Preço (R$)</Label>
            <Input
              type="number"
              defaultValue={s.price}
              onBlur={(e) =>
                update.mutate({ id: s.id, updates: { price: parseFloat(e.target.value) || 0 } })
              }
            />
          </div>
          <div>
            <Label className="text-xs">Duração (min)</Label>
            <Input
              type="number"
              defaultValue={s.duration}
              onBlur={(e) =>
                update.mutate({ id: s.id, updates: { duration: parseInt(e.target.value) || 30 } })
              }
            />
          </div>
          <Button variant="ghost" size="icon" onClick={() => remove.mutate(s.id)}>
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      ))}
      <Button
        size="sm"
        variant="outline"
        onClick={() => add.mutate()}
        disabled={add.isPending}
        className="w-full"
      >
        {add.isPending ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Plus className="w-4 h-4 mr-1" />}
        Adicionar serviço
      </Button>
    </div>
  );
}

// -----------------------------------------------------------
// Profissionais
// -----------------------------------------------------------
function ProfessionalsPanel({ businessId }: { businessId: string }) {
  const queryClient = useQueryClient();
  const { data: pros = [], isLoading } = useQuery({
    queryKey: ["admin-biz-pros", businessId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("professionals")
        .select("*")
        .eq("business_id", businessId)
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const add = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("professionals")
        .insert({ business_id: businessId, name: "Novo Profissional", role: "" });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-biz-pros", businessId] }),
    onError: (e: any) => toast.error(e.message),
  });

  const update = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { error } = await supabase.from("professionals").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-biz-pros", businessId] }),
    onError: (e: any) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("professionals").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-biz-pros", businessId] });
      toast.success("Profissional removido");
    },
    onError: (e: any) => toast.error(e.message),
  });

  if (isLoading) return <Loader2 className="w-5 h-5 animate-spin mx-auto" />;

  return (
    <div className="space-y-2">
      {pros.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-3">Nenhum profissional.</p>
      )}
      {pros.map((p) => (
        <div key={p.id} className="grid grid-cols-1 md:grid-cols-[2fr_2fr_auto] gap-2 p-2 border rounded-md items-end">
          <div>
            <Label className="text-xs">Nome</Label>
            <Input
              defaultValue={p.name}
              onBlur={(e) => update.mutate({ id: p.id, updates: { name: e.target.value } })}
            />
          </div>
          <div>
            <Label className="text-xs">Função</Label>
            <Input
              defaultValue={p.role}
              onBlur={(e) => update.mutate({ id: p.id, updates: { role: e.target.value } })}
            />
          </div>
          <Button variant="ghost" size="icon" onClick={() => remove.mutate(p.id)}>
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      ))}
      <Button
        size="sm"
        variant="outline"
        onClick={() => add.mutate()}
        disabled={add.isPending}
        className="w-full"
      >
        {add.isPending ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Plus className="w-4 h-4 mr-1" />}
        Adicionar profissional
      </Button>
    </div>
  );
}

// -----------------------------------------------------------
// Transferir propriedade
// -----------------------------------------------------------
function TransferPanel({
  business,
  onSuccess,
}: {
  business: { id: string; name: string; slug: string; owner_id: string | null };
  onSuccess: () => void;
}) {
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [lookup, setLookup] = useState<{ id: string; email: string } | null>(null);
  const [lookupErr, setLookupErr] = useState("");
  const [looking, setLooking] = useState(false);
  const [transferring, setTransferring] = useState(false);

  const doLookup = async () => {
    if (!email.trim()) return;
    setLooking(true);
    setLookupErr("");
    setLookup(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/lookup-user-by-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({ email: email.trim() }),
        },
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Usuário não encontrado");
      setLookup(json);
    } catch (err: any) {
      setLookupErr(err.message);
    } finally {
      setLooking(false);
    }
  };

  const transfer = async () => {
    if (!lookup || !business) return;
    setTransferring(true);
    try {
      const { error } = await supabase
        .from("businesses")
        .update({ owner_id: lookup.id })
        .eq("id", business.id);
      if (error) throw error;

      // Garante role 'owner' no novo dono
      await supabase
        .from("user_roles")
        .insert({ user_id: lookup.id, role: "owner" })
        .then(() => {});

      queryClient.invalidateQueries({ queryKey: ["all-businesses"] });
      toast.success(`Empresa transferida para ${lookup.email}`);
      onSuccess();
    } catch (err: any) {
      toast.error("Erro ao transferir: " + err.message);
    } finally {
      setTransferring(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-muted/30 p-4 text-sm space-y-1">
        <p className="text-muted-foreground">Dono atual:</p>
        <p className="font-mono text-xs">{business.owner_id || "(sem dono)"}</p>
      </div>

      <div>
        <Label>Novo proprietário (email)</Label>
        <div className="flex gap-2 mt-1">
          <Input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setLookup(null);
              setLookupErr("");
            }}
            placeholder="dono@empresa.com"
          />
          <Button
            type="button"
            variant="outline"
            onClick={doLookup}
            disabled={looking || !email.trim()}
          >
            {looking ? <Loader2 className="w-4 h-4 animate-spin" /> : "Buscar"}
          </Button>
        </div>
        {lookup && (
          <p className="text-xs text-primary mt-1">✓ Encontrado: {lookup.email}</p>
        )}
        {lookupErr && <p className="text-xs text-destructive mt-1">{lookupErr}</p>}
      </div>

      <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-xs text-destructive">
        ⚠ A transferência é irreversível pelo admin via UI. O novo dono passará a
        gerenciar a empresa pelo painel /painel. Ele precisa já ter conta no
        Agendagram.
      </div>

      <Button
        className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
        disabled={!lookup || transferring}
        onClick={transfer}
      >
        {transferring ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <ArrowRightLeft className="w-4 h-4 mr-2" />
        )}
        Transferir propriedade
      </Button>
    </div>
  );
}
