import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  const socials = [
    { name: "Facebook", icon: <FaFacebookF />, color: "#1877F2", link: "https://facebook.com" },
    { name: "Twitter", icon: <FaTwitter />, color: "#1DA1F2", link: "https://twitter.com" },
    { name: "LinkedIn", icon: <FaLinkedinIn />, color: "#0A66C2", link: "https://linkedin.com" },
    { name: "Instagram", icon: <FaInstagram />, color: "#E4405F", link: "https://instagram.com" },
  ];

  return (
    <footer
      style={{
        background: "var(--footer-bg)",
        color: "var(--text-secondary)",
        padding: "96px 20px 40px",
        borderTop: "1px solid var(--border-color)"
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* MAIN GRID */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "56px",
            marginBottom: "72px",
          }}
        >
          {/* BRAND */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <img
                src="/images/img.png"
                alt="Hojio Logo"
                style={{ width: "46px", height: "46px", borderRadius: "14px" }}
              />
              <h2 style={{ margin: 0, color: "#fff", fontWeight: 800 }}>
                Hojio
              </h2>
            </div>

            <p
              style={{
                marginTop: "22px",
                lineHeight: 1.8,
                fontSize: "0.95rem",
                maxWidth: "340px",
                opacity: 0.9,
              }}
            >
              {t('footer.about_text')}
            </p>

            {/* SOCIALS */}
            <div style={{ display: "flex", gap: "12px", marginTop: "28px" }}>
              {socials.map((social) => (
                <SocialIcon key={social.name} social={social} />
              ))}
            </div>
          </div>

          {/* COLUMNS */}
          <FooterColumn title={t('footer.job_seekers')}>
            <FooterLink to="/jobs" text={t('nav.jobs')} />
            <FooterLink to="/companies" text={t('footer.companies')} />
            <FooterLink to="/signup" text={t('footer.create_profile')} />
            <FooterLink to="#" text={t('footer.career_resources')} />
          </FooterColumn>

          <FooterColumn title={t('footer.employers')}>
            <FooterLink to="/signup" text={t('nav.post_job')} />
            <FooterLink to="#" text={t('footer.browse_candidates')} />
            <FooterLink to="#" text={t('footer.pricing_plans')} />
            <FooterLink to="#" text={t('footer.recruitment_solutions')} />
          </FooterColumn>

          <FooterColumn title={t('footer.companies') || 'Company'}>
            <FooterLink to="/about" text={t('footer.about_us')} />
            <FooterLink to="/contact" text={t('nav.contact')} />
            <FooterLink to="#" text={t('footer.help_center')} />
            <FooterLink to="#" text={t('footer.careers')} />
          </FooterColumn>
        </div>

        {/* BOTTOM */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.12)",
            paddingTop: "28px",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "18px",
            fontSize: "0.9rem",
            opacity: 0.9,
          }}
        >
          <span>{t('footer.copyright')}</span>

          <div style={{ display: "flex", gap: "22px" }}>
            <a href="#" style={bottomLink}>{t('footer.privacy')}</a>
            <a href="#" style={bottomLink}>{t('footer.terms')}</a>
            <a href="#" style={bottomLink}>{t('footer.cookies')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ---------- SOCIAL ICON ---------- */

function SocialIcon({ social }) {
  const [hover, setHover] = useState(false);

  return (
    <div
      style={{ position: "relative" }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <a
        href={social.link}
        target="_blank"
        rel="noreferrer"
        aria-label={social.name}
        style={{
          width: "40px",
          height: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.16)",
          color: hover ? social.color : "#e5e7eb",
          transition: "all 0.25s ease",
        }}
      >
        {social.icon}
      </a>

      <span
        style={{
          position: "absolute",
          bottom: "-34px",
          left: "50%",
          transform: "translateX(-50%)",
          padding: "4px 10px",
          borderRadius: "999px",
          fontSize: "0.75rem",
          fontWeight: 600,
          background: social.color,
          color: "#fff",
          opacity: hover ? 1 : 0,
          transition: "opacity 0.2s ease",
          pointerEvents: "none",
        }}
      >
        {social.name}
      </span>
    </div>
  );
}

/* ---------- COLUMN WITH HOVER AWARENESS ---------- */

function FooterColumn({ title, children }) {
  const [hover, setHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <h4
        style={{
          color: hover ? "#fff" : "#e5e7eb",
          marginBottom: "20px",
          fontSize: "1.15rem",
          fontWeight: 700,
          transition: "color 0.25s ease",
        }}
      >
        {title}
      </h4>

      <div
        style={{
          color: hover ? "#e5e7eb" : "#cbd5e1",
          transition: "color 0.25s ease",
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* ---------- LINKS ---------- */

function FooterLink({ to, text }) {
  const baseStyle = {
    display: "block",
    marginBottom: "14px",
    color: "#cbd5e1",
    textDecoration: "none",
    fontSize: "0.95rem",
    transition: "all 0.25s ease",
  };

  const hoverOn = (e) => {
    e.currentTarget.style.color = "#5a1becff";
    e.currentTarget.style.transform = "translateX(6px)";
  };

  const hoverOff = (e) => {
    e.currentTarget.style.color = "#cbd5e1";
    e.currentTarget.style.transform = "translateX(0)";
  };

  if (to.startsWith("/")) {
    return (
      <Link to={to} style={baseStyle} onMouseEnter={hoverOn} onMouseLeave={hoverOff}>
        {text}
      </Link>
    );
  }

  return (
    <a href={to} style={baseStyle} onMouseEnter={hoverOn} onMouseLeave={hoverOff}>
      {text}
    </a>
  );
}

const bottomLink = {
  color: "#cbd5e1",
  textDecoration: "none",
  transition: "color 0.2s ease",
};
