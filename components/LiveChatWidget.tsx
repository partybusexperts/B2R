"use client";

import { useEffect, useState, useCallback } from "react";
import { X, MessageCircle } from "lucide-react";

declare global {
  interface Window {
    LC_API?: {
      open_chat_window: () => void;
      minimize_chat_window: () => void;
      hide_chat_window: () => void;
      set_custom_variables: (vars: Array<{ name: string; value: string }>) => void;
    };
    __lc?: {
      license: number;
      group?: number;
    };
    __lc_ready?: boolean;
    __lc_ready_callbacks?: Array<() => void>;
    __lc_open_modal?: () => void;
    __lc_close_modal?: () => void;
  }
}

const LIVECHAT_LICENSE = process.env.NEXT_PUBLIC_LIVECHAT_LICENSE || "YOUR_LICENSE_ID";

export function LiveChatWidget() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chatReady, setChatReady] = useState(false);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
    
    const showChat = () => {
      const container = document.getElementById("chat-widget-container");
      if (container) {
        container.style.cssText = `
          display: block !important;
          position: fixed !important;
          top: 50% !important;
          left: 50% !important;
          transform: translate(-50%, -50%) !important;
          right: auto !important;
          bottom: auto !important;
          z-index: 10001 !important;
          max-width: 400px !important;
          max-height: 600px !important;
          width: calc(100% - 32px) !important;
          height: 80vh !important;
          border-radius: 16px !important;
          overflow: hidden !important;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5) !important;
        `;
      }
      if (window.LC_API && typeof window.LC_API.open_chat_window === "function") {
        window.LC_API.open_chat_window();
      }
    };

    if (chatReady) {
      setTimeout(showChat, 50);
    } else {
      setTimeout(showChat, 500);
    }
  }, [chatReady]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    if (window.LC_API && typeof window.LC_API.hide_chat_window === "function") {
      window.LC_API.hide_chat_window();
    }
    const container = document.getElementById("chat-widget-container");
    if (container) {
      container.style.cssText = "display: none !important;";
    }
  }, []);

  useEffect(() => {
    window.__lc_open_modal = openModal;
    window.__lc_close_modal = closeModal;
  }, [openModal, closeModal]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (document.getElementById("livechat-script")) return;

    window.__lc = window.__lc || { 
      license: parseInt(LIVECHAT_LICENSE, 10),
    };
    window.__lc_ready = false;
    window.__lc_ready_callbacks = [];

    const script = document.createElement("script");
    script.id = "livechat-script";
    script.async = true;
    script.src = "https://cdn.livechatinc.com/tracking.js";
    
    script.onload = () => {
      const checkReady = () => {
        if (window.LC_API) {
          window.__lc_ready = true;
          setChatReady(true);
          
          if (typeof window.LC_API.hide_chat_window === "function") {
            window.LC_API.hide_chat_window();
          }
          
          const container = document.getElementById("chat-widget-container");
          if (container) {
            container.style.cssText = "display: none !important;";
          }
          
          window.__lc_ready_callbacks?.forEach(cb => cb());
          window.__lc_ready_callbacks = [];
        } else {
          setTimeout(checkReady, 100);
        }
      };
      checkReady();
    };
    
    document.body.appendChild(script);

    const style = document.createElement("style");
    style.id = "livechat-hide-style";
    style.textContent = `
      #chat-widget-container:not(.lc-modal-active) {
        display: none !important;
      }
      #chat-widget-container iframe[data-test-id="widget-button"] {
        display: none !important;
      }
      #chat-widget-minimized {
        display: none !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      const existingScript = document.getElementById("livechat-script");
      if (existingScript) {
        existingScript.remove();
      }
      const existingStyle = document.getElementById("livechat-hide-style");
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen) {
        closeModal();
      }
    };
    
    if (isModalOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
      const container = document.getElementById("chat-widget-container");
      if (container) {
        container.classList.add("lc-modal-active");
      }
    } else {
      const container = document.getElementById("chat-widget-container");
      if (container) {
        container.classList.remove("lc-modal-active");
      }
    }
    
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isModalOpen, closeModal]);

  if (!isModalOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[10000] flex items-center justify-center"
      onClick={closeModal}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <button
        onClick={(e) => {
          e.stopPropagation();
          closeModal();
        }}
        className="absolute top-4 right-4 z-[10002] p-2 rounded-full bg-white/10 hover:bg-white/20 
          text-white transition-colors border border-white/20"
        aria-label="Close chat"
      >
        <X className="w-6 h-6" />
      </button>
      
      {!chatReady && (
        <div 
          className="relative z-[10001] w-full max-w-[400px] h-[80vh] max-h-[600px] mx-4 
            bg-white rounded-2xl flex flex-col items-center justify-center gap-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
          <p className="text-gray-600 font-medium">Loading chat...</p>
        </div>
      )}
    </div>
  );
}
