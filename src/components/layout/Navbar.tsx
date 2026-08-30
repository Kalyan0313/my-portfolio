import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { useScrollProgress } from "../../hooks";

interface NavbarProps {
  onOpenResume?: () => void;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const scrollProgress = useScrollProgress();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Blogs", href: "#notes" },
    { name: "Work", href: "#works" },
    { name: "Skills", href: "#skills" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        width: "100%",
        height: "78px",
        background: "rgba(10, 10, 10, 0.75)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
        padding: "20px var(--pad-x)",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        boxSizing: "border-box",
      }}
    >
      {/* Brand Monogram */}
      <a
        href="#"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "18px",
          fontWeight: 700,
          color: "var(--accent-green)",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}
        aria-label="Kalyan Mahato Home"
      >
        KM
      </a>

      {/* Dynamic Progress Line */}
      <div
        style={{
          flex: 1,
          height: "1px",
          position: "relative",
          background: "rgba(255, 255, 255, 0.12)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to right, #F59E0B, #FCD34D)",
            transform: `scaleX(${scrollProgress})`,
            transformOrigin: "left center",
            transition: "transform 0.08s linear",
            boxShadow: "0 0 6px rgba(245, 158, 11, 0.70)",
          }}
        />
      </div>

      {/* Desktop Navigation */}
      <nav
        style={{ display: "none" }}
        className="desktop-nav-menu"
        aria-label="Main Navigation"
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="nav-button">
              <span className="corner corner-tl" />
              <span className="corner corner-tr" />
              <span className="corner corner-bl" />
              <span className="corner corner-br" />
              {link.name}
            </a>
          ))}
        </div>
      </nav>

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="mobile-nav-toggle"
        aria-label={mobileMenuOpen ? "Close Navigation" : "Open Navigation"}
        style={{
          background: "none",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          color: "#FFFFFF",
          padding: "6px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            position: "fixed",
            top: "78px",
            left: 0,
            right: 0,
            background: "#0A0A0A",
            borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
            padding: "24px var(--pad-x)",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            zIndex: 49,
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "16px",
                letterSpacing: "0.10em",
                textTransform: "uppercase",
                color: "rgba(255, 255, 255, 0.85)",
                padding: "8px 0",
                borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
              }}
            >
              [ {link.name} ]
            </a>
          ))}
        </div>
      )}

      <style>{`
        @media (min-width: 900px) {
          .desktop-nav-menu {
            display: block !important;
          }
          .mobile-nav-toggle {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
};
