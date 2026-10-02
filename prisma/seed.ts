import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const categories = [
    {
      slug: "ai-tools",
      name: "AI Tools",
      description: "The best AI tools built for India",
      sortOrder: 1,
    },
    {
      slug: "best-meme-pages",
      name: "Best Meme Pages",
      description: "India's funniest meme creators",
      sortOrder: 2,
    },
    {
      slug: "instagram-creator-maharashtra",
      name: "Instagram Creator Maharashtra",
      description: "Top Instagram creators from Maharashtra",
      sortOrder: 3,
    },
  ];

  const now = new Date();
  const startDate = now;
  const endDate = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);

  for (const cat of categories) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });

    await prisma.season.upsert({
      where: {
        categoryId_number: {
          categoryId: category.id,
          number: 1,
        },
      },
      update: {},
      create: {
        number: 1,
        categoryId: category.id,
        startDate,
        endDate,
        status: "ACTIVE",
      },
    });
  }

  console.log("Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

</content>