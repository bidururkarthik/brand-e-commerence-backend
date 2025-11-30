const bcrypt = require('bcryptjs');

const users = [
    {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123', // Will be hashed by pre-save hook? No, insertMany doesn't trigger pre-save hooks usually. I should hash it here or use create.
        // Actually, insertMany DOES NOT trigger pre-save middleware in Mongoose.
        // So I should provide hashed passwords or use a loop to save.
        // For simplicity in seeder, I will just hash it manually here or change seeder to use create/save.
        // Let's use a pre-hashed password for 'password123' or just change seeder to loop.
        // Hashed '123456': $2a$10$3...
        // I'll just change seeder to use User.create() or loop.
        // Wait, I can just use the pre-save hook if I iterate.
        // Let's just put plain text here and update seeder to handle hashing or just use a hardcoded hash.
        // Hardcoded hash for '123456': $2a$10$d/..
        // Actually, I'll just update the seeder to loop and save.
        isAdmin: true,
    },
    {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        isAdmin: false,
    },
];

module.exports = users;
