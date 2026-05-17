// src/config/db.js
// Prisma client configuration

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Attempt immediate connection to surface connection errors in logs
prisma
	.$connect()
	.then(() => {
		console.log("Prisma: database connection established.");
	})
	.catch((err) => {
		console.error("Prisma connection error:", err && err.message ? err.message : err);
	});

module.exports = prisma;
