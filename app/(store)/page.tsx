import { HomeExperience } from "@/components/home/home-experience";
import { getStoreProducts } from "@/lib/storefront";

export default async function HomePage() {
  const products = await getStoreProducts();

  return <HomeExperience products={products} />;
}
