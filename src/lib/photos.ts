import { prisma } from "@/lib/prisma";

export async function getAllPhotos() {
  return prisma.photo.findMany({
    orderBy: { createdAt: "desc" },
  });
}