import type { MetadataRoute } from "next";

import { getStoreProducts } from "@/lib/storefront";
import { getBaseUrl } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const products = await getStoreProducts();

  return [
    "",
    "/shop",
    "/brand",
    "/series-01",
    "/cart"
  ]
    .map((pathname) => ({
      url: `${baseUrl}${pathname}`,
      lastModified: new Date()
    }))
    .concat(
      products.map((product) => ({
        url: `${baseUrl}/product/${product.slug}`,
        lastModified: new Date()
      }))
    );
}
