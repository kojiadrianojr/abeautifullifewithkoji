import { getHeroAlbumImages, getThrowbackPhotos, getPrenupPhotos, getGalleryImages } from "@/services/imageService";

async function testImageLoading() {
	console.log("🔍 Testing Image Loading...\n");

	try {
		console.log("1️⃣ Loading Hero Album images...");
		const heroImages = await getHeroAlbumImages();
		console.log(`   Found ${heroImages.length} images`);
		if (heroImages.length > 0) {
			console.log(`   First image: ${heroImages[0]}`);
		}
		console.log("");

		console.log("2️⃣ Loading Throwback photos...");
		const throwbackPhotos = await getThrowbackPhotos();
		console.log(`   Found ${throwbackPhotos.length} images`);
		if (throwbackPhotos.length > 0) {
			console.log(`   First image: ${throwbackPhotos[0]}`);
		}
		console.log("");

		console.log("3️⃣ Loading Prenup photos...");
		const prenupPhotos = await getPrenupPhotos();
		console.log(`   Found ${prenupPhotos.length} images`);
		if (prenupPhotos.length > 0) {
			console.log(`   First image: ${prenupPhotos[0]}`);
		}
		console.log("");

		console.log("4️⃣ Loading Gallery images...");
		const galleryImages = await getGalleryImages();
		console.log(`   Found ${galleryImages.length} images`);
		if (galleryImages.length > 0) {
			console.log(`   First image: ${galleryImages[0]}`);
		}
		console.log("");

		console.log("✅ Test complete!");
		console.log("\n💡 Try accessing one of the URLs above in your browser to see if they work");

	} catch (error) {
		console.error("❌ Error:", error);
	}
}

testImageLoading();
