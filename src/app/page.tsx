import { getHeroAlbumImages } from "@/services/imageService";
import HomeContent from "./HomeContent";

export default function Home() {
	const heroImages = getHeroAlbumImages();

	return <HomeContent heroImages={heroImages} />;
}
