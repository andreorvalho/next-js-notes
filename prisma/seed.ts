import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await hash("Password123!", 10);

  // Create user if it doesn't exist
  await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      name: "Test User",
      email: "test@example.com",
      password: hashedPassword,
    },
  });

  // Create some sample notes
  await prisma.note.createMany({
    data: [
      {
        title: "Body weight workout",
        content: "Neck exercises: - Always hands to the chest. sitting down with back straight. Better in ass under knees for example sitting in stairs side to side - 10 to each side. Shoulder exercises: - Wall slides - 3 sets of 15. - Band pull-aparts - 3 sets of 20. Core exercises: - Plank - 3 sets of 30 seconds. - Dead bug - 3 sets of 10 each side."
      },
      {
        title: "The people of kho rong",
        content: "Freedom Responsibility Honesty Solitude banning/forbid - doesnt work alchool in states and etc Patience Vulnerability is strength The ability to think to change your mind The ability to think to change your mind is a superpower. It's not a weakness to change your mind when presented with new information. In fact, it's a sign of intellectual maturity and growth."
      },
      {
        title: "Meeting Notes - Project Alpha",
        content: "Key discussion points:\n- Budget approval for Q2\n- Timeline adjustments needed\n- Resource allocation for new features\n- Risk assessment update\n\nAction items:\n- John to prepare budget proposal by Friday\n- Sarah to update project timeline\n- Mike to conduct risk analysis\n\nNext meeting: Next Tuesday at 2 PM"
      },
      {
        title: "Recipe - Chocolate Chip Cookies",
        content: "Ingredients:\n- 2 1/4 cups all-purpose flour\n- 1 tsp baking soda\n- 1 tsp salt\n- 1 cup butter, softened\n- 3/4 cup granulated sugar\n- 3/4 cup packed brown sugar\n- 2 large eggs\n- 2 tsp vanilla extract\n- 2 cups chocolate chips\n\nInstructions:\n1. Preheat oven to 375°F\n2. Mix dry ingredients in a bowl\n3. Cream butter and sugars\n4. Add eggs and vanilla\n5. Gradually add flour mixture\n6. Stir in chocolate chips\n7. Drop rounded tablespoons onto ungreased cookie sheets\n8. Bake 9-11 minutes until golden brown"
      },
      {
        title: "Book Recommendations",
        content: "Must-read books for this year:\n\nFiction:\n- The Seven Husbands of Evelyn Hugo by Taylor Jenkins Reid\n- Project Hail Mary by Andy Weir\n- The Midnight Library by Matt Haig\n\nNon-fiction:\n- Atomic Habits by James Clear\n- Sapiens by Yuval Noah Harari\n- Thinking, Fast and Slow by Daniel Kahneman\n\nBusiness:\n- Good to Great by Jim Collins\n- The Lean Startup by Eric Ries\n- Zero to One by Peter Thiel"
      }
    ]
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
