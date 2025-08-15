import "./setting.scss";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";

const sections = [
  {
    id: "audience",
    title: "Who Can See What You Share",
    to: "/settings/audience",
    icon: "mdi:account-multiple",
    bg: "var(--pc-orange)",
  },
  
  
];

export default function Setting() {
  const navigate = useNavigate();

  return (
    <div className="privacy-checkup">
      <header className="pc-header">
        <h1>Privacy Checkup</h1>
        <p>
          We’ll guide you through some settings so you can make the right
          choices for your account. What topic do you want to start with?
        </p>
      </header>

      <div className="pc-grid">
        {sections.map((s) => (
          <button
            key={s.id}
            className="pc-card"
            onClick={() => navigate(s.to)}
            aria-label={s.title}
          >
            <div className="pc-art" style={{ background: s.bg }}>
              <span className="pc-circle" />
              <Icon icon={s.icon} className="pc-icon" />
            </div>
            <div className="pc-body">
              <h3>{s.title}</h3>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
