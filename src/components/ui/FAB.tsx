import { useState } from "react";
import { MessageCircle, ArrowUp, Mail } from "lucide-react";
import "./FAB.css";

export function FAB() {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsOpen(false);
  };

  const scrollToContact = () => {
    const contactSection = document.querySelector('[data-section="contact"]');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    }
  };

  const handleEmailClick = () => {
    const email = document
      .querySelector('a[href^="mailto:"]')
      ?.getAttribute("href");
    if (email) {
      window.location.href = email;
      setIsOpen(false);
    }
  };

  return (
    <div className="fab-container">
      {isOpen && (
        <div className="fab-menu">
          <button
            className="fab-menu-item"
            onClick={scrollToContact}
            title="Contact"
            aria-label="Contact via form"
          >
            <MessageCircle size={20} />
            <span>Contact</span>
          </button>
          <button
            className="fab-menu-item"
            onClick={handleEmailClick}
            title="Email"
            aria-label="Send email"
          >
            <Mail size={20} />
            <span>Email</span>
          </button>
          <button
            className="fab-menu-item"
            onClick={scrollToTop}
            title="Back to top"
            aria-label="Scroll to top"
          >
            <ArrowUp size={20} />
            <span>Top</span>
          </button>
        </div>
      )}

      <button
        className={`fab-button ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Quick actions menu"
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <span style={{ fontSize: "20px", fontWeight: 700, lineHeight: 1, color: "#0A0A0A" }}>✕</span>
        ) : (
          <span
            style={{
              fontSize: "22px",
              fontWeight: 800,
              fontFamily: "var(--font-display)",
              letterSpacing: "-0.04em",
              color: "#0A0A0A",
              lineHeight: 1
            }}
          >
            K
          </span>
        )}
      </button>
    </div>
  );
}
