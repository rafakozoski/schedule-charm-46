import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ArrowLeft } from "lucide-react";
import { generateTimeSlots } from "@/lib/scheduling";

interface Props {
  selectedDate: Date | undefined;
  selectedTime: string | null;
  onSelectDate: (d: Date | undefined) => void;
  onSelectTime: (t: string) => void;
  onBack: () => void;
}

export function DateTimeStep({ selectedDate, selectedTime, onSelectDate, onSelectTime, onBack }: Props) {
  const today = new Date();
  const slots = selectedDate ? generateTimeSlots("09:00", "18:00", 30) : [];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h3 className="text-lg font-semibold">Escolha data e horário</h3>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onSelectDate}
            disabled={(date) => date < today || date.getDay() === 0}
            className="rounded-lg border"
          />
        </div>
        <div>
          {!selectedDate ? (
            <p className="text-muted-foreground text-center py-8">Selecione uma data</p>
          ) : (
            <div>
              <p className="text-sm font-medium mb-3 text-muted-foreground">
                Horários disponíveis para {selectedDate.toLocaleDateString('pt-BR')}
              </p>
              <div className="grid grid-cols-3 gap-2 max-h-[280px] overflow-y-auto pr-1">
                {slots.map((slot) => (
                  <button
                    key={slot.time}
                    disabled={!slot.available}
                    onClick={() => onSelectTime(slot.time)}
                    className={`py-2 px-3 rounded-md text-sm font-medium transition-all ${
                      !slot.available
                        ? "bg-muted text-muted-foreground/40 cursor-not-allowed"
                        : selectedTime === slot.time
                        ? "gradient-primary text-primary-foreground shadow-glow"
                        : "bg-secondary text-secondary-foreground hover:bg-primary/10 hover:text-primary"
                    }`}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
