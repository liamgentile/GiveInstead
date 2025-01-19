import { motion } from "framer-motion";
import { Check, Plus } from "lucide-react";
import Charity from "../interfaces/Charity";

export default function CharityCard({
  charity,
  onSelect,
  isSelected,
}: {
  charity: Charity;
  onSelect: () => void;
  isSelected: boolean;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      layout
      className={`p-4 rounded-lg border ${
        isSelected ? "border-green-200 bg-green-50" : "border-gray-200"
      } flex justify-between items-center hover:border-gray-300 transition-colors`}
    >
      <div>
        <div className="flex items-center gap-2">
          <h4 className="font-medium">{charity.name}</h4>
        </div>
        <p className="text-sm text-gray-600">{charity.description}</p>
      </div>
      <motion.button
        whileHover={{
          scale: 1.05,
        }}
        whileTap={{
          scale: 0.95,
        }}
        type="button"
        onClick={onSelect}
        className={`p-2 rounded-full transition-colors ${
          isSelected
            ? "text-green-600 bg-green-100 hover:bg-green-200"
            : "text-black hover:bg-gray-100"
        }`}
      >
        {isSelected ? <Check size={20} /> : <Plus size={20} />}
      </motion.button>
    </motion.div>
  );
}
