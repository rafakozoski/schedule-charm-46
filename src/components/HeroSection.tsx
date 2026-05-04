import { motion } from "framer-motion";
import { Calendar, Clock, Users } from "lucide-react";

export function HeroSection() {
  return (
    <section className="gradient-hero min-h-[60vh] flex items-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-primary blur-3xl" />
        <div className="absolute bottom-10 right-20 w-96 h-96 rounded-full bg-accent blur-3xl" />
      </div>
      <div className="container mx-auto px-6 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold text-primary-foreground mb-6 leading-tight">
            Agende em <span className="text-accent">segundos</span>.
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/70 mb-10 leading-relaxed">
            Sistema inteligente de agendamento online.
            Simples para seus clientes, poderoso para seu negócio.
          </p>
          <div className="flex flex-wrap gap-6">
            {[
              { icon: Calendar, label: "Agenda integrada" },
              { icon: Clock, label: "Tempo real" },
              { icon: Users, label: "Multi-profissional" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-primary-foreground/80">
                <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center shadow-glow">
                  <Icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-sm font-medium">{label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
