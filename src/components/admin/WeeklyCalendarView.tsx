import { useState } from "react";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CheckCircle, XCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-500/20 border-yellow-500/40 text-yellow-700 dark:text-yellow-400",
  confirmed: "bg-green-500/20 border-green-500/40 text-green-700 dark:text-green-400",
  cancelled: "bg-destructive/20 border-destructive/40 text-destructive",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pendente",
  confirmed: "Confirmado",
  cancelled: "Cancelado",
};

const HOURS = Array.from({ length: 14 }, (_, i) => i + 7); // 07:00–20:00

interface WeeklyCalendarViewProps {
  bookings: any[];
  onUpdateStatus: (id: string, status: string) => void;
  isProfessional: boolean;
}

export function WeeklyCalendarView({ bookings, onUpdateStatus, isProfessional }: WeeklyCalendarViewProps) {
  const [weekStart, setWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getBookingsForSlot = (day: Date, hour: number) => {
    return bookings.filter((b) => {
      const bDate = new Date(b.booking_date + "T00:00:00");
      const bHour = parseInt(b.booking_time?.split(":")[0] ?? "0", 10);
      return isSameDay(bDate, day) && bHour === hour;
    });
  };

  const prevWeek = () => setWeekStart((d) => addDays(d, -7));
  const nextWeek = () => setWeekStart((d) => addDays(d, 7));
  const goToday = () => setWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));

  const isToday = (day: Date) => isSameDay(day, new Date());

  return (
    <div className="space-y-3">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={prevWeek}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={goToday}>
            Hoje
          </Button>
          <Button variant="outline" size="icon" onClick={nextWeek}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-sm font-medium text-muted-foreground">
          {format(days[0], "dd MMM", { locale: ptBR })} — {format(days[6], "dd MMM yyyy", { locale: ptBR })}
        </p>
      </div>

      {/* Calendar grid */}
      <div className="overflow-x-auto border rounded-lg">
        <div className="min-w-[800px]">
          {/* Header row */}
          <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b bg-muted/30">
            <div className="p-2 text-xs text-muted-foreground font-medium text-center">Hora</div>
            {days.map((day) => (
              <div
                key={day.toISOString()}
                className={cn(
                  "p-2 text-center border-l",
                  isToday(day) && "bg-primary/10"
                )}
              >
                <p className="text-xs text-muted-foreground uppercase">
                  {format(day, "EEE", { locale: ptBR })}
                </p>
                <p className={cn(
                  "text-sm font-semibold",
                  isToday(day) && "text-primary"
                )}>
                  {format(day, "dd")}
                </p>
              </div>
            ))}
          </div>

          {/* Time slots */}
          {HOURS.map((hour) => (
            <div key={hour} className="grid grid-cols-[60px_repeat(7,1fr)] border-b last:border-b-0 min-h-[52px]">
              <div className="p-1 text-xs text-muted-foreground text-center flex items-start justify-center pt-2 border-r bg-muted/10">
                {String(hour).padStart(2, "0")}:00
              </div>
              {days.map((day) => {
                const slotBookings = getBookingsForSlot(day, hour);
                return (
                  <div
                    key={day.toISOString() + hour}
                    className={cn(
                      "border-l p-0.5 min-h-[52px]",
                      isToday(day) && "bg-primary/5"
                    )}
                  >
                    {slotBookings.map((b) => (
                      <Tooltip key={b.id}>
                        <TooltipTrigger asChild>
                          <div className={cn(
                            "rounded px-1.5 py-0.5 text-[11px] leading-tight border cursor-default mb-0.5 truncate",
                            STATUS_COLORS[b.status] ?? "bg-muted border-border"
                          )}>
                            <span className="font-medium">{b.booking_time?.slice(0, 5)}</span>
                            {" "}
                            <span className="truncate">{b.client_name}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-xs">
                          <div className="space-y-1 text-xs">
                            <p className="font-semibold">{b.client_name}</p>
                            <p>{b.client_phone}</p>
                            <p>{(b.services as any)?.name ?? "Sem serviço"}</p>
                            {!isProfessional && <p>Prof: {(b.professionals as any)?.name ?? "—"}</p>}
                            <div className="flex items-center gap-1">
                              <Badge variant="outline" className="text-[10px] px-1 py-0">
                                {STATUS_LABELS[b.status] ?? b.status}
                              </Badge>
                            </div>
                            <div className="flex gap-1 pt-1">
                              {b.status !== "confirmed" && b.status !== "cancelled" && (
                                <Button size="sm" variant="ghost" className="h-6 px-2 text-xs" onClick={() => onUpdateStatus(b.id, "confirmed")}>
                                  <CheckCircle className="w-3 h-3 mr-1 text-green-600" /> Confirmar
                                </Button>
                              )}
                              {b.status !== "cancelled" && (
                                <Button size="sm" variant="ghost" className="h-6 px-2 text-xs" onClick={() => onUpdateStatus(b.id, "cancelled")}>
                                  <XCircle className="w-3 h-3 mr-1 text-destructive" /> Cancelar
                                </Button>
                              )}
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
