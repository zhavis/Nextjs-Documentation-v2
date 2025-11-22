"use client";

import { useEffect } from "react";
import "swagger-ui-dist/swagger-ui.css";

declare global {
  interface Window {
    SwaggerUIBundle: any;
    SwaggerUIStandalonePreset: any;
  }
}

export default function SwaggerPage() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/swagger-ui-dist/swagger-ui-bundle.js";
    script.async = true;

    script.onload = () => {
      if (!window.SwaggerUIBundle) {
        console.error("SwaggerUIBundle failed to load");
        return;
      }

      window.SwaggerUIBundle({
        url: "/swagger/swagger.json",
        dom_id: "#swagger-ui",
        presets: [window.SwaggerUIBundle.presets.apis],
        layout: "BaseLayout",
      });
    };

    document.body.appendChild(script);
  }, []);

  return <div id="swagger-ui" style={{ height: "100vh" }}></div>;
}
