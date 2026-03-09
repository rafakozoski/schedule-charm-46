import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Loader2, Package } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export function ServiceCatalogTab() {
  const queryClient = useQueryClient();
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("");

  const { data: catalog = [], isLoading } = useQuery({
    queryKey: ["service-catalog"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("service_catalog")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const addItem = useMutation({
    mutationFn: async () => {
      if (!newName.trim()) throw new Error("Nome é obrigatório");
      const { error } = await supabase
        .from("service_catalog")
        .insert({ name: newName.trim(), category: newCategory.trim() });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service-catalog"] });
      setNewName("");
      setNewCategory("");
      toast.success("Serviço adicionado ao catálogo");
    },
    onError: (err: any) => toast.error(err.message),
  });

  const deleteItem = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("service_catalog").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service-catalog"] });
      toast.success("Serviço removido do catálogo");
    },
    onError: (err: any) => toast.error(err.message),
  });

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5" />
          Catálogo de Serviços ({catalog.length})
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Serviços pré-cadastrados que aparecem como sugestão quando o proprietário digitar o nome do serviço.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-3">
          <Input
            placeholder="Nome do serviço"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="flex-1"
            onKeyDown={(e) => e.key === "Enter" && addItem.mutate()}
          />
          <Input
            placeholder="Categoria (opcional)"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="w-48"
            onKeyDown={(e) => e.key === "Enter" && addItem.mutate()}
          />
          <Button
            onClick={() => addItem.mutate()}
            disabled={!newName.trim() || addItem.isPending}
            className="gradient-primary text-primary-foreground"
          >
            <Plus className="w-4 h-4 mr-1" /> Adicionar
          </Button>
        </div>

        {catalog.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">Nenhum serviço no catálogo.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead className="w-20">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {catalog.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-muted-foreground">{item.category || "—"}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (window.confirm("Remover este serviço do catálogo?")) {
                          deleteItem.mutate(item.id);
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
