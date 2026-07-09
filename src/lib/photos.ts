import { prisma } from "@/lib/prisma";
import { safePublicMediaUrl } from "@/lib/public-media";

export async function getAllPhotos() {
  const photos = await prisma.photo.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      imageUrl: true,
      category: true,
    },
  });

  return photos.map((photo) => ({
    ...photo,
    imageUrl: safePublicMediaUrl(photo.imageUrl),
  }));
}
