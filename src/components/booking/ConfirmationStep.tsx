import { MOCK_SERVICES, MOCK_PROFESSIONALS } from "@/lib/scheduling";
import { CheckCircle, Calendar, Clock, User, Mail, Phone } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  serviceId: string | null;
  professionalId: string | null;
  date: Date | undefined;
  time: string | null;
  clientInfo: { name: string; email: string; phone: string };
}

export function ConfirmationStep({ serviceId, professionalId, date, time, clientInfo }: Props) {
  const service = MOCK_SERVICES.find((s) => s.id === serviceId);
  const professional = MOCK_PROFESSIONALS.find((p) => p.id === professionalId);

  return (
    <div className="text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center mx-auto mb-6 shadow-glow"
      >
        <CheckCircle className="w-10 h-10 text-primary-foreground" />
      </motion.div>
      <h3 className="text-2xl font-bold mb-2">Agendamento confirmado!</h3>
      <p className="text-muted-foreground mb-8">
        Um e-mail de confirmação será enviado e o evento será adicionado ao Google Agenda.
      </p>
      <div className="bg-secondary/50 rounded-lg p-6 text-left max-w-sm mx-auto space-y-3">
        {service && (
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="w-4 h-4 text-primary shrink-0" />
            <span className="font-medium">{service.name}</span>
            <span className="ml-auto font-bold text-primary">R$ {service.price.toFixed(2)}</span>
          </div>
        )}
        {professional && (
          <div className="flex items-center gap-3 text-sm">
            <User className="w-4 h-4 text-primary shrink-0" />
            <span>{professional.name}</span>
          </div>
        )}
        {date && time && (
          <div className="flex items-center gap-3 text-sm">
            <Clock className="w-4 h-4 text-primary shrink-0" />
            <span>{date.toLocaleDateString('pt-BR')} às {time}</span>
          </div>
        )}
        <hr className="border-border" />
        <div className="flex items-center gap-3 text-sm">
          <User className="w-4 h-4 text-muted-foreground shrink-0" />
          <span>{clientInfo.name}</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
          <span>{clientInfo.email}</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
          <span>{clientInfo.phone}</span>
        </div>
      </div>
    </div>
  );
}
