import prisma from "@lib/prisma";
import { hash } from "bcryptjs";
import { splitContentIntoPages } from "@/lib/contentSplitter";

// Generate large content that will span multiple pages (approximately 2.5MB)
function generateLargeContent(): string {
  const sections = [
    "# Introduction to Software Architecture",
    "Software architecture is the fundamental organization of a system, embodied in its components, their relationships to each other and to the environment, and the principles governing its design and evolution.",
    "## Chapter 1: Understanding Architecture Patterns",
    "Architecture patterns provide a reusable solution to commonly occurring problems in software architecture within a given context. Patterns are a way of putting building blocks into context.",
    "### Monolithic Architecture",
    "A monolithic application is built as a single unified unit. All components are interconnected and interdependent. This approach is simple to develop, test, and deploy initially, but can become challenging as the application grows.",
    "### Microservices Architecture",
    "Microservices architecture is a method of developing software systems that tries to focus on building single-function modules with well-defined interfaces and operations. Each service is independently deployable and scalable.",
    "### Event-Driven Architecture",
    "Event-driven architecture is a software architecture pattern promoting the production, detection, consumption of, and reaction to events. This architectural pattern can be applied to the design and implementation of applications and systems.",
    "## Chapter 2: Design Principles",
    "Design principles are fundamental guidelines that help in making design decisions. They provide a framework for creating maintainable, scalable, and robust software systems.",
    "### SOLID Principles",
    "SOLID is an acronym for five design principles intended to make software designs more understandable, flexible, and maintainable.",
    "#### Single Responsibility Principle",
    "A class should have only one reason to change, meaning it should have only one job or responsibility. This principle helps in creating more focused and maintainable code.",
    "#### Open/Closed Principle",
    "Software entities should be open for extension but closed for modification. This means you should be able to add new functionality without changing existing code.",
    "#### Liskov Substitution Principle",
    "Objects of a superclass should be replaceable with objects of its subclasses without breaking the application. Derived classes must be substitutable for their base classes.",
    "#### Interface Segregation Principle",
    "Clients should not be forced to depend upon interfaces that they do not use. Many client-specific interfaces are better than one general-purpose interface.",
    "#### Dependency Inversion Principle",
    "High-level modules should not depend on low-level modules. Both should depend on abstractions. Abstractions should not depend on details. Details should depend on abstractions.",
    "## Chapter 3: Scalability and Performance",
    "Scalability is the capability of a system, network, or process to handle a growing amount of work, or its potential to be enlarged to accommodate that growth.",
    "### Horizontal vs Vertical Scaling",
    "Horizontal scaling means adding more machines to your pool of resources, while vertical scaling means adding more power to your existing machines.",
    "### Caching Strategies",
    "Caching is a technique that stores frequently accessed data in fast storage to improve performance. Common caching strategies include write-through, write-back, and cache-aside patterns.",
    "### Database Optimization",
    "Database optimization involves improving database performance through various techniques such as indexing, query optimization, normalization, and denormalization.",
    "## Chapter 4: Security Considerations",
    "Security is a critical aspect of software architecture. It must be considered from the beginning of the design process, not added as an afterthought.",
    "### Authentication and Authorization",
    "Authentication verifies who a user is, while authorization determines what they can do. Both are essential for securing applications.",
    "### Data Encryption",
    "Encryption protects data at rest and in transit. It's important to use strong encryption algorithms and manage keys securely.",
    "### Security Best Practices",
    "Follow security best practices such as input validation, output encoding, using parameterized queries, and implementing proper error handling.",
    "## Chapter 5: Testing Strategies",
    "Testing is crucial for ensuring software quality and reliability. Different testing strategies serve different purposes in the software development lifecycle.",
    "### Unit Testing",
    "Unit tests verify that individual components work correctly in isolation. They should be fast, independent, and test a single behavior.",
    "### Integration Testing",
    "Integration tests verify that different components work together correctly. They test the interactions between modules.",
    "### End-to-End Testing",
    "End-to-end tests verify that the entire system works correctly from the user's perspective. They test complete user workflows.",
    "## Chapter 6: Deployment and DevOps",
    "Deployment strategies and DevOps practices are essential for delivering software reliably and efficiently.",
    "### Continuous Integration",
    "Continuous Integration (CI) is the practice of merging all developers' working copies to a shared mainline several times a day.",
    "### Continuous Deployment",
    "Continuous Deployment (CD) is the practice of automatically deploying code changes to production after they pass automated tests.",
    "### Infrastructure as Code",
    "Infrastructure as Code (IaC) is the management of infrastructure through machine-readable definition files, rather than through physical hardware configuration or interactive configuration tools.",
    "## Chapter 7: Monitoring and Observability",
    "Monitoring and observability are crucial for understanding system behavior and diagnosing issues in production.",
    "### Logging",
    "Logging provides a record of events that occur in a system. Effective logging helps in debugging and understanding system behavior.",
    "### Metrics",
    "Metrics provide quantitative measurements of system behavior. Common metrics include response time, throughput, and error rates.",
    "### Distributed Tracing",
    "Distributed tracing helps track requests as they flow through a distributed system, making it easier to identify bottlenecks and failures.",
    "## Chapter 8: Cloud Architecture",
    "Cloud computing has revolutionized how we build and deploy applications. Understanding cloud architecture patterns is essential for modern software development.",
    "### Cloud Service Models",
    "The main cloud service models are Infrastructure as a Service (IaaS), Platform as a Service (PaaS), and Software as a Service (SaaS).",
    "### Serverless Architecture",
    "Serverless architecture allows developers to build and run applications without managing servers. Functions are executed in response to events.",
    "### Container Orchestration",
    "Container orchestration automates the deployment, management, scaling, and networking of containers. Popular tools include Kubernetes and Docker Swarm.",
    "## Chapter 9: API Design",
    "Well-designed APIs are crucial for building maintainable and scalable systems. Good API design follows consistent patterns and conventions.",
    "### RESTful APIs",
    "REST (Representational State Transfer) is an architectural style for designing networked applications. RESTful APIs use HTTP methods and status codes appropriately.",
    "### GraphQL",
    "GraphQL is a query language for APIs that allows clients to request exactly the data they need. It provides a more flexible alternative to REST.",
    "### API Versioning",
    "API versioning allows you to make changes to your API without breaking existing clients. Common strategies include URL versioning and header versioning.",
    "## Chapter 10: Conclusion",
    "Software architecture is a complex and evolving field. The best architectures are those that balance multiple concerns including performance, scalability, maintainability, and security.",
    "Remember that there is no one-size-fits-all solution. The best architecture for your project depends on your specific requirements, constraints, and context.",
    "Continue learning and staying updated with the latest trends and best practices in software architecture. The field is constantly evolving, and what works today may need to be adapted tomorrow."
  ];

  // Repeat sections multiple times to reach approximately 2.5MB
  const repeatedSections: string[] = [];
  for (let i = 0; i < 150; i++) {
    sections.forEach((section, index) => {
      repeatedSections.push(`${section} (Section ${i + 1}, Part ${index + 1})`);
      // Add substantial content to each section
      repeatedSections.push(`This is detailed content for section ${i + 1}, part ${index + 1}. ` +
        `It contains important information about software architecture, design patterns, and best practices. ` +
        `Understanding these concepts is crucial for building robust and scalable software systems. ` +
        `Each section builds upon previous knowledge and provides practical insights into real-world software development. ` +
        `The content covers various aspects including architecture patterns, design principles, scalability considerations, ` +
        `security measures, testing strategies, deployment practices, monitoring techniques, cloud computing, and API design. ` +
        `By studying these topics, developers can gain a comprehensive understanding of modern software architecture. `.repeat(10));
    });
  }

  return repeatedSections.join('\n\n');
}

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

  // Sample notes data
  const notesData = [
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
    },
    {
      title: "Large Document - Software Architecture Guide",
      content: generateLargeContent()
    }
  ];

  // Create notes with pages
  for (const noteData of notesData) {
    // Convert plain text to HTML (preserve newlines as <br> tags)
    const htmlContent = noteData.content
      .split('\n')
      .map(line => {
        if (line.trim() === '') return '<p><br></p>';
        return `<p>${line}</p>`;
      })
      .join('');

    // Split content into pages (will usually be just one page for seed data)
    const pageContents = splitContentIntoPages(htmlContent);

    // Create note with pages
    await prisma.note.create({
      data: {
        title: noteData.title,
        pages: {
          create: pageContents.map((pageContent, index) => ({
            content: pageContent,
            pageNumber: index + 1,
          })),
        },
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
