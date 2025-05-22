import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../assets/dashboard-bg.jpg";
import { useTranslation } from "react-i18next";
import ukFlag from "../assets/flag/eng.png";
import inFlag from "../assets/flag/ind.png";

export default function Dashboard() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: "en", label: "English", flag: ukFlag },
    { code: "hi", label: "हिंदी", flag: inFlag },
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
  };

  return (
    <div
      className="fullscreen-bg"
      style={{ backgroundImage: `url(${backgroundImage})`, position: "relative" }}
    >
      <div className="overlay-dark"></div>

      {/* Language dropdown at top right */}
      <div style={{ position: "absolute", top: 10, right: 10, zIndex: 1000 }}>
        <div
          onClick={() => setIsOpen(!isOpen)}
          style={{ display: "flex", alignItems: "center", cursor: "pointer", backgroundColor: "white", padding: "5px 10px", borderRadius: 4, boxShadow: "0 0 5px rgba(0,0,0,0.2)" }}
        >
          <img src={currentLanguage.flag} alt={currentLanguage.label} style={{ width: 20, marginRight: 8 }} />
          <span>{currentLanguage.label}</span>
        </div>
        {isOpen && (
          <div style={{
            position: "absolute",
            top: "100%",
            left: 0,
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: 4,
            marginTop: 4,
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            minWidth: 130,
          }}>
            {languages.map(lang => (
              <div
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                style={{
                  padding: "5px 10px",
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  backgroundColor: lang.code === currentLanguage.code ? "#eee" : "white"
                }}
              >
                <img src={lang.flag} alt={lang.label} style={{ width: 20, marginRight: 8 }} />
                <span>{lang.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="dashboard-wrapper" style={{ position: "relative", zIndex: 1 }}>
        <div className="dashboard-header">
          <h1>{t("dashboard_title")}</h1>
        </div>

        <div className="dashboard-grid">
          <button className="dashboard-card" onClick={() => navigate("/manage-products")}>
            {t("manage_products")}
          </button>
          <button className="dashboard-card" onClick={() => navigate("/manage-customers")}>
            {t("manage_customers")}
          </button>
          <button className="dashboard-card" onClick={() => navigate("/create-sale-bill")}>
            {t("sale_billing")}
          </button>
          <button className="dashboard-card" onClick={() => navigate("/create-return-bill")}>
            {t("return_billing")}
          </button>
          <button className="dashboard-card" onClick={() => navigate("/product-stock-log")}>
            {t("view_sales_history")}
          </button>
        </div>
      </div>
    </div>
  );
}
