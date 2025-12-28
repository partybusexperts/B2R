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

export function openLiveChat(source?: string, page?: string) {
  if (typeof window === "undefined") return;

  const doOpen = () => {
    if (window.LC_API) {
      if ((source || page) && typeof window.LC_API.set_custom_variables === "function") {
        try {
          window.LC_API.set_custom_variables([
            { name: "Source", value: source || "Website" },
            { name: "Page", value: page || window.location.pathname },
          ]);
        } catch (e) {
          console.warn("LiveChat: Could not set custom variables", e);
        }
      }
    }
    
    if (window.__lc_open_modal) {
      window.__lc_open_modal();
    }
  };

  if (window.__lc_ready && window.LC_API) {
    doOpen();
  } else {
    window.__lc_ready_callbacks = window.__lc_ready_callbacks || [];
    window.__lc_ready_callbacks.push(doOpen);
  }
}
