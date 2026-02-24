import { MOCK_PROFESSIONALS } from "@/lib/scheduling";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User } from "lucide-react";

interface Props {
  serviceId: string | null;
  selected: string | null;
  onSelect: (id: string) => void;
  onBack: () => void;
}

export function ProfessionalStep({ serviceId, selected, onSelect, onBack }: Props) {
  const available = MOCK_PROFESSIONALS.filter(
    (p) => !serviceId || p.services.includes(serviceId)
  );

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h3 className="text-lg font-semibold">Escolha o profissional</h3>
      </div>
      <div className="grid gap-3">
        {available.length === 0 && (
          <p className="text-muted-foreground text-center py-8">Nenhum profissional disponível para este serviço.</p>
        )}
        {available.map((pro) => (
          <button
            key={pro.id}
            onClick={() => onSelect(pro.id)}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md flex items-center gap-4 ${
              selected === pro.id
                ? "border-primary bg-primary/5 shadow-glow"
                : "border-border hover:border-primary/40"
            }`}
          >
            <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center">
              <User className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <p className="font-semibold">{pro.name}</p>
              <p className="text-sm text-muted-foreground">{pro.role}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
