const mongoose = require('mongoose');
const Category = require('../api/models/category');
const connectDB = require('../config/database');

const categories = [
    { title: 'fashion' },
    { title: 'beauty' },
    { title: 'modeltest' },
    { title: 'portrait' },
    { title: 'video' },
];

async function populateCategories() {
    try {
        await connectDB();

        for (const category of categories) {
            const existingCategory = await Category.findOne({ title: category.title });
            if (!existingCategory) {
                await Category.create(category);
                console.log(`Category "${category.title}" created.`);
            } else {
                console.log(`Category "${category.title}" already exists.`);
            }
        }

        console.log('Category population completed.');
        process.exit(0);
    } catch (err) {
        console.error('Error populating categories:', err);
        process.exit(1);
    }
}

populateCategories();
