import {
	getHeroAlbumImages,
	getThrowbackPhotos,
	getPrenupPhotos,
	getDressCodePhotosMetadata,
} from "@/services/imageService";
import HomeContent from "./HomeContent";

export default async function Home() {
	const [heroImages, throwbackPhotos, prenupPhotos, dressCodePhotos] =
		await Promise.all([
			getHeroAlbumImages(),
			getThrowbackPhotos(),
			getPrenupPhotos(),
			getDressCodePhotosMetadata(),
		]);

	return (
		<HomeContent
			heroImages={heroImages}
			throwbackPhotos={throwbackPhotos}
			prenupPhotos={prenupPhotos}
			dressCodePhotos={dressCodePhotos}
		/>
	);
}
