import { getHeroAlbumImages } from "@/lib/hero-images";
import HomeContent from "./HomeContent";

export default function Home() {
	const heroImages = getHeroAlbumImages();

	return <HomeContent heroImages={heroImages} />;
}
