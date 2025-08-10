import "./toggle.scss";

export default function Toggle({
  checked = false,
  onChange,
  onLabel = "On",
  offLabel = "Off",
  disabled = false,
  className = "",
}) {
  const handleClick = () => {
    if (disabled) return;
    onChange?.(!checked);
  };

  return (
    <button
      type="button"
      className={`tg ${checked ? "tg--on" : "tg--off"} ${disabled ? "tg--disabled" : ""} ${className}`}
      onClick={handleClick}
      aria-pressed={checked}
    >
      <span className="tg__track">
        <span className="tg__icon tg__icon--on">✓</span>
        <span className="tg__icon tg__icon--off">✕</span>
        <span className="tg__thumb" />
      </span>
      <span className="tg__text">{checked ? onLabel : offLabel}</span>
    </button>
  );
}
