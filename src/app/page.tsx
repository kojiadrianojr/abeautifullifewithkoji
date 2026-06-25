import {
	getThrowbackPhotos,
	getPrenupPhotos,
	getDressCodePhotosMetadata,
} from "@/services/imageService";
import HomeContent from "./HomeContent";

export default async function Home() {
	const [throwbackPhotos, prenupPhotos, dressCodePhotos] = await Promise.all([
		getThrowbackPhotos(),
		getPrenupPhotos(),
		getDressCodePhotosMetadata(),
	]);

	return (
		<HomeContent
			throwbackPhotos={throwbackPhotos}
			prenupPhotos={prenupPhotos}
			dressCodePhotos={dressCodePhotos}
		/>
	);
}
