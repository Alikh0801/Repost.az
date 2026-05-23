import {
  ArticleStatus,
  Category,
  Locale,
  PrismaClient,
  UserRole,
} from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL ?? "admin@repost.az";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "Admin123!";

  const existingUsers = await prisma.user.count();
  if (existingUsers === 0) {
    await prisma.user.create({
      data: {
        email,
        passwordHash: await bcrypt.hash(password, 12),
        role: UserRole.admin,
      },
    });
    console.log(`Admin user created: ${email}`);
  }

  const articleCount = await prisma.article.count();
  if (articleCount > 0) {
    console.log("Articles already seeded, skipping.");
    return;
  }

  const sample = {
    slug: "parlamentde-budce-muzakireleri",
    category: Category.politics,
    status: ArticleStatus.published,
    isFeatured: true,
    featuredOrder: 1,
    coverImageUrl:
      "https://images.unsplash.com/photo-1541873676-a18131494186?auto=format&fit=crop&w=1200&q=80",
    publishedAt: new Date("2026-05-23T11:20:00"),
    viewCount: 18420,
    translations: {
      create: [
        {
          locale: Locale.az,
          title: "Parlamentdə büdcə müzakirələri davam edir",
          summary:
            "Millət vəkilləri gələn ilin dövlət büdcəsi layihəsini müzakirə edir.",
          imageAlt: "Parlament binası",
          body: [
            "Millət vəkilləri gələn ilin dövlət büdcəsi layihəsini müzakirə edir.",
            "Müzakirələrdə sosial xərclərin artırılması və infrastruktur investisiyaları əsas mövzulardandır.",
            "Komitə sədrləri növbəti oxunuşun tarixini açıqlayacaqlarını bildirdilər.",
          ],
        },
        {
          locale: Locale.ru,
          title: "В парламенте продолжаются обсуждения бюджета",
          summary:
            "Депутаты обсуждают проект государственного бюджета на следующий год.",
          imageAlt: "Здание парламента",
          body: [
            "Депутаты обсуждают проект государственного бюджета на следующий год.",
            "Ключевые темы — рост социальных расходов и инвестиции в инфраструктуру.",
            "Председатели комитетов сообщили, что объявят дату следующего чтения.",
          ],
        },
      ],
    },
  };

  await prisma.article.create({ data: sample });
  console.log("Sample article seeded.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
