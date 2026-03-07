import {
	getHeroAlbumImages,
	getThrowbackPhotos,
	getPrenupPhotos,
	getGalleryImages,
} from "@/services/imageService";
import HomeContent from "./HomeContent";

export default async function Home() {
	const [heroImages, throwbackPhotos, prenupPhotos, galleryImages] =
		await Promise.all([
			getHeroAlbumImages(),
			getThrowbackPhotos(),
			getPrenupPhotos(),
			getGalleryImages(),
		]);

	return (
		<HomeContent
			heroImages={heroImages}
			throwbackPhotos={throwbackPhotos}
			prenupPhotos={prenupPhotos}
			galleryImages={galleryImages}
		/>
	);
}
