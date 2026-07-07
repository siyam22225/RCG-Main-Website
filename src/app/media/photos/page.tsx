import PhotosPageClient from "@/components/photos/PhotosPageClient";
import { getAllPhotos } from "@/lib/photos";

export default async function PhotosPage() {
 let photos: Awaited<ReturnType<typeof getAllPhotos>> = [];

try {
  photos = await getAllPhotos();
} catch (error) {
  console.error("MEDIA_PHOTOS_PAGE_ERROR", error);
}
  return <PhotosPageClient initialPhotos={photos} />;
}