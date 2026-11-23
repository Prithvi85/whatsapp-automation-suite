"use client";

import React, { useEffect, useRef, useState } from "react";

export type QuickTopic = {
  label: string;
  message: string;
};

export type WhatsAppWidgetProps = {
  phoneNumber: string;
  brandTitle?: string;
  brandSubtitle?: string;
  welcomeMessage?: string;
  quickTopics?: QuickTopic[];
  placeholderText?: string;
  position?: "bottom-left" | "bottom-right";
  themeColor?: string;
};

export function WhatsAppWidget({
  phoneNumber,
  brandTitle = "Support Concierge",
  brandSubtitle = "Typically replies in minutes • Online",
  welcomeMessage = "Hi there! 👋 How can we assist with your project today?",
  quickTopics = [
    { label: "💬 General Inquiry", message: "Hi, I would like to learn more about your services." },
    { label: "🚀 Start a Project", message: "Hi, I have a new project requirement and would like a consultation." },
    { label: "💰 Pricing & Scope", message: "Hi, could you share details regarding project pricing and estimates?" },
  ],
  placeholderText = "Type a brief message...",
  position = "bottom-left",
  themeColor = "#25D366",
}: WhatsAppWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const cleanNumber = phoneNumber.replace(/[^0-9]/g, "");

  const handleSend = (text: string) => {
    const finalMsg = text.trim() || welcomeMessage;
    const waUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(finalMsg)}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
    setIsOpen(false);
  };

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen]);

  const isLeft = position === "bottom-left";

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        bottom: "max(1rem, env(safe-area-inset-bottom))",
        left: isLeft ? "max(1rem, env(safe-area-inset-left))" : "auto",
        right: !isLeft ? "max(1rem, env(safe-area-inset-right))" : "auto",
        zIndex: 9999,
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {isOpen && (
        <aside
          role="dialog"
          aria-label={brandTitle}
          style={{
            position: "absolute",
            bottom: "calc(100% + 0.75rem)",
            left: isLeft ? 0 : "auto",
            right: !isLeft ? 0 : "auto",
            width: "min(calc(100vw - 2rem), 22rem)",
            borderRadius: "1rem",
            overflow: "hidden",
            boxShadow: "0 1rem 2.5rem rgba(0, 0, 0, 0.18)",
            border: "1px solid rgba(0, 0, 0, 0.1)",
            background: "#ffffff",
            color: "#1e293b",
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "#075E54",
              color: "#ffffff",
              padding: "0.85rem 1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
              <div
                style={{
                  width: "2.2rem",
                  height: "2.2rem",
                  borderRadius: "50%",
                  background: themeColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#ffffff">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 0 0-3.48-8.413Z" />
                </svg>
              </div>
              <div>
                <strong style={{ display: "block", fontSize: "0.85rem", fontWeight: 700 }}>
                  {brandTitle}
                </strong>
                <p style={{ margin: 0, fontSize: "0.68rem", opacity: 0.85 }}>{brandSubtitle}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close"
              style={{
                background: "transparent",
                border: "none",
                color: "#ffffff",
                fontSize: "1.3rem",
                cursor: "pointer",
                padding: "0.2rem 0.4rem",
              }}
            >
              ×
            </button>
          </div>

          {/* Body */}
          <div
            style={{
              padding: "1rem",
              background: "#f0f2f5",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            <div
              style={{
                background: "#ffffff",
                borderRadius: "0.75rem",
                padding: "0.75rem",
                boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
                fontSize: "0.8rem",
                lineHeight: 1.4,
              }}
            >
              {welcomeMessage}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <span
                style={{
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  color: "#64748b",
                }}
              >
                Quick Actions:
              </span>
              {quickTopics.map((topic) => (
                <button
                  key={topic.label}
                  type="button"
                  onClick={() => handleSend(topic.message)}
                  style={{
                    textAlign: "left",
                    background: "#ffffff",
                    border: "1px solid #cbd5e1",
                    borderRadius: "0.5rem",
                    padding: "0.5rem 0.75rem",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {topic.label}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(inputVal);
              }}
              style={{ display: "flex", gap: "0.4rem", marginTop: "0.25rem" }}
            >
              <input
                type="text"
                placeholder={placeholderText}
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                style={{
                  flex: 1,
                  padding: "0.5rem 0.7rem",
                  borderRadius: "0.5rem",
                  border: "1px solid #cbd5e1",
                  fontSize: "0.75rem",
                  outline: "none",
                }}
              />
              <button
                type="submit"
                style={{
                  background: themeColor,
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "0.5rem",
                  padding: "0.5rem 0.85rem",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Send ↗
              </button>
            </form>
          </div>
        </aside>
      )}

      {/* Floating Launcher Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Open WhatsApp Chat"
        style={{
          position: "relative",
          width: "3.2rem",
          height: "3.2rem",
          borderRadius: "50%",
          background: themeColor,
          border: "none",
          boxShadow: "0 0.5rem 1.6rem rgba(37, 211, 102, 0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "transform 0.2s ease",
        }}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="#ffffff">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 0 0-3.48-8.413Z" />
        </svg>
        <span
          style={{
            position: "absolute",
            top: "2px",
            right: "2px",
            width: "0.75rem",
            height: "0.75rem",
            background: "#10b981",
            borderRadius: "50%",
            border: "2px solid #ffffff",
          }}
        />
      </button>
    </div>
  );
}
