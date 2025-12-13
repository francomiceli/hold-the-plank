import { motion } from "framer-motion";
import { GreekButton } from "@/components/ui/greek-button";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const plankRules = [
  {
    icon: "📐",
    text: "Shoulders, hips, and heels aligned in a straight line",
  },
  {
    icon: "⚖️",
    text: "Hips not too high, not sagging low",
  },
  {
    icon: "🦵",
    text: "Knees off the ground, core engaged",
  },
];

const PlankTechnique: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-2">
          Prepare for Battle
        </h1>
        <p className="text-muted-foreground">
          Master your form before challenging Kronos
        </p>
      </motion.div>

      {/* Plank illustration frame */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="relative w-full max-w-sm aspect-[4/3] mb-8 greek-border rounded-lg overflow-hidden bg-card"
      >
        {/* Greek pattern top */}
        <div className="absolute top-0 left-0 right-0 h-3 meander-pattern" />
        
        {/* Plank silhouette */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* Simple plank pose representation */}
            <svg
              viewBox="0 0 200 80"
              className="w-64 h-20 text-primary"
              fill="currentColor"
            >
              {/* Body line */}
              <ellipse cx="100" cy="40" rx="70" ry="8" opacity="0.2" />
              {/* Head */}
              <circle cx="30" cy="35" r="12" />
              {/* Body */}
              <rect x="40" y="32" width="80" height="16" rx="8" />
              {/* Arms */}
              <rect x="38" y="48" width="8" height="25" rx="4" />
              <rect x="50" y="48" width="8" height="25" rx="4" />
              {/* Legs */}
              <rect x="110" y="38" width="50" height="12" rx="6" />
              {/* Feet */}
              <circle cx="165" cy="55" r="6" />
            </svg>
            
            {/* Alignment line */}
            <div className="absolute top-1/2 left-0 right-0 h-px bg-primary/50 -translate-y-1/2" />
          </div>
        </div>

        {/* Greek pattern bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-3 meander-pattern" />
      </motion.div>

      {/* Rules */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-sm space-y-3 mb-8"
      >
        {plankRules.map((rule, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border"
          >
            <span className="text-2xl">{rule.icon}</span>
            <span className="text-sm text-foreground flex-1">{rule.text}</span>
            <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
          </motion.div>
        ))}
      </motion.div>

      {/* Warning */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex items-start gap-2 text-xs text-muted-foreground mb-8 max-w-sm text-center"
      >
        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <span>
          Invalid posture will pause your time. Only valid seconds count toward your conquest.
        </span>
      </motion.div>

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="w-full max-w-sm space-y-3"
      >
        <GreekButton
          variant="conquest"
          size="xl"
          onClick={() => navigate("/plank/session")}
          className="w-full"
        >
          I'm Ready
        </GreekButton>
        <GreekButton
          variant="ghost"
          size="md"
          onClick={() => navigate("/")}
          className="w-full"
        >
          Back
        </GreekButton>
      </motion.div>
    </div>
  );
};

export default PlankTechnique;
