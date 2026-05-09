const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.user.deleteMany({});

  // Create users
  const user1 = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Jane Smith',
      email: 'jane@example.com',
    },
  });

  // Create products
  const product1 = await prisma.product.create({
    data: {
      name: 'Laptop',
      price: 999.99,
      stock: 10,
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: 'Mouse',
      price: 29.99,
      stock: 50,
    },
  });

  const product3 = await prisma.product.create({
    data: {
      name: 'Keyboard',
      price: 79.99,
      stock: 25,
    },
  });

  // Create sample orders
  const order1 = await prisma.order.create({
    data: {
      userId: user1.id,
      productId: product1.id,
      quantity: 1,
    },
  });

  const order2 = await prisma.order.create({
    data: {
      userId: user2.id,
      productId: product2.id,
      quantity: 2,
    },
  });

  console.log('✅ Seeding complete!');
  console.log('📝 Created:');
  console.log(`   - 2 Users: ${user1.name}, ${user2.name}`);
  console.log(`   - 3 Products: ${product1.name}, ${product2.name}, ${product3.name}`);
  console.log(`   - 2 Orders`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
