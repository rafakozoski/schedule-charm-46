import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ServiceStep } from "./booking/ServiceStep";
import { ProfessionalStep } from "./booking/ProfessionalStep";
import { DateTimeStep } from "./booking/DateTimeStep";
import { ClientInfoStep } from "./booking/ClientInfoStep";
import { ConfirmationStep } from "./booking/ConfirmationStep";
import { Check } from "lucide-react";

const STEPS = ["Serviço", "Profissional", "Data/Hora", "Seus Dados", "Confirmação"];

export function BookingFlow() {
  const [step, setStep] = useState(0);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [clientInfo, setClientInfo] = useState({ name: "", email: "", phone: "" });

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <section id="agendar" className="py-20 px-6">
      <div className="container mx-auto max-w-3xl">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-3xl md:text-4xl font-bold text-center mb-4"
        >
          Faça seu agendamento
        </motion.h2>
        <p className="text-center text-muted-foreground mb-12">
          Escolha o serviço, profissional, data e horário
        </p>

        {/* Stepper */}
        <div className="flex items-center justify-center mb-12 gap-1">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                    i < step
                      ? "gradient-primary text-primary-foreground"
                      : i === step
                      ? "bg-primary text-primary-foreground shadow-glow"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {i < step ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span className="text-[10px] mt-1 text-muted-foreground hidden md:block">{label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-8 md:w-16 h-0.5 mx-1 transition-colors ${i < step ? "bg-primary" : "bg-border"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-card rounded-xl border shadow-md p-6 md:p-8 min-h-[350px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              {step === 0 && (
                <ServiceStep selected={selectedService} onSelect={(id) => { setSelectedService(id); next(); }} />
              )}
              {step === 1 && (
                <ProfessionalStep
                  serviceId={selectedService}
                  selected={selectedProfessional}
                  onSelect={(id) => { setSelectedProfessional(id); next(); }}
                  onBack={prev}
                />
              )}
              {step === 2 && (
                <DateTimeStep
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  onSelectDate={setSelectedDate}
                  onSelectTime={(t) => { setSelectedTime(t); next(); }}
                  onBack={prev}
                />
              )}
              {step === 3 && (
                <ClientInfoStep
                  info={clientInfo}
                  onChange={setClientInfo}
                  onSubmit={next}
                  onBack={prev}
                />
              )}
              {step === 4 && (
                <ConfirmationStep
                  serviceId={selectedService}
                  professionalId={selectedProfessional}
                  date={selectedDate}
                  time={selectedTime}
                  clientInfo={clientInfo}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
