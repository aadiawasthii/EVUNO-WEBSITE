import type { MetadataRoute } from "next";

import { getBaseUrl } from "@/lib/utils";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/shop", "/about", "/product"],
        disallow: ["/admin", "/api"]
      }
    ],
    sitemap: `${getBaseUrl()}/sitemap.xml`
  };
}
