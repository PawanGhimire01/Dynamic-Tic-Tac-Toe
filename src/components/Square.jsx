export default function Square({ value, onClick, isWinner, disabled, fontSize }) {
  let colorClass =
    "border-slate-600 hover:border-slate-400 hover:bg-slate-700 text-slate-400";

  if (value === "X")
    colorClass = isWinner
      ? "border-blue-400 bg-blue-950 text-blue-300 shadow-lg shadow-blue-500/40 scale-105"
      : "border-slate-600 text-blue-400";

  if (value === "O")
    colorClass = isWinner
      ? "border-rose-400 bg-rose-950 text-rose-300 shadow-lg shadow-rose-500/40 scale-105"
      : "border-slate-600 text-rose-400";

  if (disabled && !value)
    colorClass = "border-slate-700 cursor-not-allowed opacity-50";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={value ? `${value} played` : "Empty square"}
      className={`
        aspect-square w-full flex items-center justify-center
        border-2 rounded-xl font-bold
        transition-all duration-200
        ${colorClass}
      `}
      style={{ fontSize }}
    >
      {value}
    </button>
  );
}
