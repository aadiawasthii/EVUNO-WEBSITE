import type * as React from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string;
        alt?: string;
        poster?: string;
        loading?: "lazy" | "eager";
        exposure?: string;
        "camera-controls"?: boolean;
        "auto-rotate"?: boolean;
        "rotation-per-second"?: string;
        "shadow-intensity"?: string;
        "interaction-prompt"?: string;
        "touch-action"?: string;
      };
    }
  }
}

export {};
