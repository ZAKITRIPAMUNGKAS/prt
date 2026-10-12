import { cn } from "@/lib/utils";

interface Props {
  label: string;
  label2?: string;
  style?: string;
}

/**
 * WordRotate component displays a vertical rotation of different words when user hover it
 * @preview ![img]() - https://p.sera.me/components/word-rotate
 *
 * @param {Object} props - Component props
 * @param {string} props.label - first word
 * @param {string} props.label2 - second word
 * @param {string} props.style - Component styles
 * @returns {JSX.Element} JSX Element
 */

const WordRotate = ({ label, label2, style }: Props) => {
  const longest = label.length >= (label2?.length ?? 0) ? label : (label2 ?? label);

  return (
    <div
      className="relative inline-flex items-center overflow-hidden"
      style={{ lineHeight: 1 }}
    >
      <div
        className={cn("relative inline-grid text-sm font-light", style)}
      >
        {/* Invisible sizer to ensure the container always fits the longer text */}
        <span
          aria-hidden="true"
          className="invisible select-none opacity-0 pointer-events-none whitespace-nowrap col-start-1 row-start-1"
        >
          {longest}
        </span>

        {/* Default Text (moves down on hover) */}
        <span className="col-start-1 row-start-1 transform transition-transform duration-300 ease-in-out group-hover:translate-y-full whitespace-nowrap">
          {label}
        </span>

        {/* Hover Text (moves in from above on hover) */}
        <span className="col-start-1 row-start-1 transform -translate-y-full transition-transform duration-300 ease-in-out group-hover:translate-y-0 whitespace-nowrap">
          {label2 || label}
        </span>
      </div>
    </div>
  );
};

export default WordRotate;
