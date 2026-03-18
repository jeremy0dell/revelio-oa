
import { motion } from "framer-motion";

interface Props {
  onBack: () => void;
}

export default function AboutScreen({ onBack }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-dvh flex flex-col items-center justify-center px-6 text-center"
    >
      <div className="max-w-sm mx-auto">
        <h2 className="font-serif text-2xl mb-8">About This</h2>

        <div className="text-ivory/60 text-sm leading-relaxed space-y-4 mb-10">
          <p>
            This is an April Fools project. No real dating, matching, or
            personality assessment is occurring. The results are generated for
            entertainment purposes only.
          </p>

          <p>
            The Balourdet Quartet is a real and wonderful string quartet. This
            project was made with affection and respect for their artistry.
          </p>

          <p className="text-ivory/40 text-xs">
            No musicians were harmed in the making of this assessment. Your
            rubato tolerance data is not stored.
          </p>
        </div>

        <button onClick={onBack} className="btn-secondary">
          Return
        </button>
      </div>
    </motion.div>
  );
}
