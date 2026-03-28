import {
	getHeroAlbumImages,
	getThrowbackPhotos,
	getPrenupPhotos,
} from "@/services/imageService";
import HomeContent from "./HomeContent";

export default async function Home() {
	const [heroImages, throwbackPhotos, prenupPhotos] =
		await Promise.all([
			getHeroAlbumImages(),
			getThrowbackPhotos(),
			getPrenupPhotos(),
		]);

	return (
		<HomeContent
			heroImages={heroImages}
			throwbackPhotos={throwbackPhotos}
			prenupPhotos={prenupPhotos}
		/>
	);
}
