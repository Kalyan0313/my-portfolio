import React from "react";
import { profileData } from "../../data";
import { useCopyToClipboard } from "../../hooks";
import { fireCyberpunkConfetti } from "../../utils/confetti";

export interface ContactProps {
  onOpenResume: () => void;
  onShowToast: (msg: string) => void;
  "data-section"?: string;
}

export const Contact: React.FC<ContactProps> = ({
  onOpenResume,
  onShowToast,
  "data-section": dataSection,
}) => {
  const [copiedEmail, copyEmail] = useCopyToClipboard(2500);
  const [copiedPhone, copyPhone] = useCopyToClipboard(2500);

  const handleCopyEmail = async () => {
    const success = await copyEmail(profileData.email);
    if (success) {
      fireCyberpunkConfetti();
      onShowToast(`Copied ${profileData.email} to clipboard!`);
    }
  };

  const handleCopyPhone = async () => {
    if (!profileData.phone) return;
    const success = await copyPhone(profileData.phone);
    if (success) {
      fireCyberpunkConfetti();
      onShowToast(`Copied ${profileData.phone} to clipboard!`);
    }
  };

  return (
    <section
      id="contact"
      data-section={dataSection}
      style={{
        width: "100%",
        background: "var(--bg-deep)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "120px var(--pad-x)",
      }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <p className="section-tag">[ CONTACT ]</p>
        <h2 className="section-heading" style={{ marginBottom: "24px" }}>
          Let's get in touch
        </h2>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "15px",
            color: "rgba(255,255,255,0.50)",
            lineHeight: 1.8,
            maxWidth: "560px",
            marginBottom: "64px",
          }}
        >
          Have an interesting project or engineering opportunity? I'm open to
          collaborating on challenging full-stack web platforms, real-time
          systems, and scalable backend architectures.
        </p>

        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.10)",
            marginBottom: "48px",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          {/* Email Row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "28px",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "12px",
                letterSpacing: "0.12em",
                color: "rgba(255,255,255,0.35)",
                textTransform: "uppercase",
                minWidth: "90px",
              }}
            >
              [EMAIL]
            </span>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                flexWrap: "wrap",
              }}
            >
              <a
                href={`mailto:${profileData.email}`}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "15px",
                  letterSpacing: "0.06em",
                  color: "rgba(255,255,255,0.85)",
                  textDecoration: "underline",
                  textUnderlineOffset: "4px",
                  transition: "color 0.2s",
                }}
              >
                {profileData.email}
              </a>
              <button
                onClick={handleCopyEmail}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  background: "none",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: copiedEmail
                    ? "var(--accent-green)"
                    : "rgba(255,255,255,0.60)",
                  padding: "2px 8px",
                  cursor: "pointer",
                }}
              >
                {copiedEmail ? "[COPIED]" : "[COPY]"}
              </button>
            </div>
          </div>

          {/* Phone Row */}
          {profileData.phone && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "28px",
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "12px",
                  letterSpacing: "0.12em",
                  color: "rgba(255,255,255,0.35)",
                  textTransform: "uppercase",
                  minWidth: "90px",
                }}
              >
                [PHONE]
              </span>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  flexWrap: "wrap",
                }}
              >
                <a
                  href={`tel:${profileData.phone.replace(/\s+/g, '')}`}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "15px",
                    letterSpacing: "0.06em",
                    color: "rgba(255,255,255,0.85)",
                    textDecoration: "underline",
                    textUnderlineOffset: "4px",
                    transition: "color 0.2s",
                  }}
                >
                  {profileData.phone}
                </a>
                <button
                  onClick={handleCopyPhone}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "11px",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    background: "none",
                    border: "1px solid rgba(255,255,255,0.15)",
                    color: copiedPhone
                      ? "var(--accent-green)"
                      : "rgba(255,255,255,0.60)",
                    padding: "2px 8px",
                    cursor: "pointer",
                  }}
                >
                  {copiedPhone ? "[COPIED]" : "[COPY]"}
                </button>
              </div>
            </div>
          )}

          {/* GitHub Row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "28px",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "12px",
                letterSpacing: "0.12em",
                color: "rgba(255,255,255,0.35)",
                textTransform: "uppercase",
                minWidth: "90px",
              }}
            >
              [GITHUB]
            </span>
            <a
              href={profileData.github}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "15px",
                letterSpacing: "0.06em",
                color: "rgba(255,255,255,0.85)",
                textDecoration: "underline",
                textUnderlineOffset: "4px",
                transition: "color 0.2s",
              }}
            >
              github.com/Kalyan0313
            </a>
          </div>

          {/* LinkedIn Row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "28px",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "12px",
                letterSpacing: "0.12em",
                color: "rgba(255,255,255,0.35)",
                textTransform: "uppercase",
                minWidth: "90px",
              }}
            >
              [LINKEDIN]
            </span>
            <a
              href={profileData.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "15px",
                letterSpacing: "0.06em",
                color: "rgba(255,255,255,0.85)",
                textDecoration: "underline",
                textUnderlineOffset: "4px",
                transition: "color 0.2s",
              }}
            >
              linkedin.com/in/kalyan-mahato-366444244
            </a>
          </div>

          {/* Resume Row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "28px",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "12px",
                letterSpacing: "0.12em",
                color: "rgba(255,255,255,0.35)",
                textTransform: "uppercase",
                minWidth: "90px",
              }}
            >
              [RESUME]
            </span>
            <button
              onClick={onOpenResume}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
                fontFamily: "var(--font-mono)",
                fontSize: "15px",
                letterSpacing: "0.06em",
                color: "var(--accent-green)",
                textDecoration: "underline",
                textUnderlineOffset: "4px",
              }}
            >
              View Full PDF Resume ↗
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
