import EnterpriseCard from "@/components/ui/EnterpriseCard";
import { enterpriseItems } from "@/data/enterprises";
import { prisma } from "@/lib/prisma";

type EnterpriseCardItem = {
  id: number;
  slug: string;
  name: string;
  location: string;
  image: string;
  shortDescription: string;
  fullDescription: string[];
  website: string;
};

function splitDescription(description: string) {
  return description
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);
}

async function getEnterpriseGridItems(): Promise<EnterpriseCardItem[]> {
  try {
    const items = await prisma.enterprise.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        sortOrder: "asc",
      },
      select: {
        slug: true,
        name: true,
        description: true,
        imageUrl: true,
        location: true,
        buttonHref: true,
        sortOrder: true,
      },
        take: 6,
    });

    if (items.length > 0) {
      return items.map((item, index) => {
        const paragraphs = splitDescription(item.description);

        return {
          id: item.sortOrder || index + 1,
          slug: item.slug,
          name: item.name,
          location: item.location || "",
          image: item.imageUrl || "/images/enterprises/enterprise-1.jpg",
          shortDescription: paragraphs[0] || item.description,
          fullDescription: paragraphs.length > 0 ? paragraphs : [item.description],
          website: item.buttonHref || "#",
        };
      });
    }
  } catch (error) {
    console.error("ENTERPRISE_GRID_DYNAMIC_ERROR", error);
  }

  return enterpriseItems;
}

export default async function EnterpriseGrid() {
  const items = await getEnterpriseGridItems();

  return (
    <section
      style={{
        background: "transparent",
        padding: "70px 0 90px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        <div className="responsive-grid-3">
          {items.map((item) => (
            <EnterpriseCard key={item.slug} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}