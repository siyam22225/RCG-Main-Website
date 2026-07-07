import { prisma } from "@/lib/prisma";

export async function getAllVideos() {
  return prisma.video.findMany({
    orderBy: { createdAt: "desc" },
  });
}