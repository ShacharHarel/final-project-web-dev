// סקריפט Seed: מוסיף למסד תכני דוגמה מבלי ליצור כותרות כפולות בהרצות חוזרות.
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Content = require('../models/Content');

dotenv.config();

const sampleContents = [
    {
        title: 'Stranger Things',
        description: 'A group of friends discovers supernatural mysteries and secret experiments in their small town.',
        category: 'Science Fiction',
        type: 'series',
        releaseYear: 2016,
        rating: 8.7,
        videoUrl: 'https://www.youtube.com/watch?v=b9EkMc79ZSU',
        imageUrl: 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg',
        address: 'Atlanta, Georgia, USA'
    },
    {
        title: 'Wednesday',
        description: 'Wednesday Addams investigates strange mysteries while studying at Nevermore Academy.',
        category: 'Mystery',
        type: 'series',
        releaseYear: 2022,
        rating: 8.1,
        videoUrl: 'https://www.youtube.com/watch?v=Di310WS8zLk',
        imageUrl: 'https://image.tmdb.org/t/p/w500/9PFonBhy4cQy7Jz20NpMygczOkv.jpg',
        address: 'Bucharest, Romania'
    },
    {
        title: 'The Crown',
        description: 'A historical drama about the reign and personal life of Queen Elizabeth II.',
        category: 'Drama',
        type: 'series',
        releaseYear: 2016,
        rating: 8.6,
        videoUrl: 'https://www.youtube.com/watch?v=JWtnJjn6ng0',
        imageUrl: 'https://image.tmdb.org/t/p/w500/1M876KPjulVwppEpldhdc8V4o68.jpg',
        address: 'London, United Kingdom'
    },
    {
        title: "The Queen's Gambit",
        description: 'A young chess player rises to the top while facing personal challenges.',
        category: 'Drama',
        type: 'series',
        releaseYear: 2020,
        rating: 8.5,
        videoUrl: 'https://www.netflix.com/title/80234304',
        imageUrl: 'https://image.tmdb.org/t/p/w500/zU0htwkhNvBQdVSIKB9s6hgVeFK.jpg',
        address: 'Berlin, Germany'
    },
    {
        title: 'Dark',
        description: 'Four families uncover a time travel mystery connected to missing children.',
        category: 'Science Fiction',
        type: 'series',
        releaseYear: 2017,
        rating: 8.8,
        videoUrl: 'https://www.youtube.com/watch?v=rrwycJ08PSA',
        imageUrl: 'https://image.tmdb.org/t/p/w500/apbrbWs8M9lyOpJYU5WXrpFbk1Z.jpg',
        address: 'Berlin, Germany'
    },
    {
        title: 'Money Heist',
        description: 'A criminal mastermind leads a group of robbers in an ambitious heist in Spain.',
        category: 'Crime',
        type: 'series',
        releaseYear: 2017,
        rating: 8.2,
        videoUrl: 'https://www.youtube.com/watch?v=_InqQJRqGW4',
        imageUrl: 'https://image.tmdb.org/t/p/w500/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg',
        address: 'Madrid, Spain'
    },
    {
        title: 'Extraction',
        description: 'A mercenary accepts a dangerous mission to rescue the kidnapped son of a crime lord.',
        category: 'Action',
        type: 'movie',
        releaseYear: 2020,
        rating: 7.4,
        videoUrl: 'https://www.youtube.com/watch?v=L6P3nI6VnlY',
        imageUrl: 'https://image.tmdb.org/t/p/w500/nygOUcBKPHFTbxsYRFZVePqgPK6.jpg',
        address: 'Dhaka, Bangladesh'
    },
    {
        title: 'Glass Onion: A Knives Out Mystery',
        description: 'Detective Benoit Blanc investigates a mystery during a gathering on a private island.',
        category: 'Mystery',
        type: 'movie',
        releaseYear: 2022,
        rating: 7.6,
        videoUrl: 'https://www.youtube.com/watch?v=gj5ibYSz8C0',
        imageUrl: 'https://image.tmdb.org/t/p/w500/vDGr1YdrlfbU9wxTOdpf3zChmv9.jpg',
        address: 'Spetses, Greece'
    },
    {
        title: 'All Quiet on the Western Front',
        description: 'A young German soldier experiences the harsh reality of the First World War.',
        category: 'Drama',
        type: 'movie',
        releaseYear: 2022,
        rating: 7.8,
        videoUrl: 'https://www.youtube.com/watch?v=hf8EYbVxtCY',
        imageUrl: 'https://image.tmdb.org/t/p/w500/2IRjbi9cADuDMKmHdLK7LaqQDKA.jpg',
        address: 'Prague, Czech Republic'
    },
    {
        title: "Don't Look Up",
        description: 'Two astronomers try to warn the world about a comet heading toward Earth.',
        category: 'Comedy',
        type: 'movie',
        releaseYear: 2021,
        rating: 7.2,
        videoUrl: 'https://www.youtube.com/watch?v=RbIxYm3mKzI',
        imageUrl: 'https://image.tmdb.org/t/p/w500/th4E1yqsE8DGpAseLiUrI60Hf8V.jpg',
        address: 'Boston, Massachusetts, USA'
    }
];

/** מתחברת למסד, מוסיפה רק כותרות שאינן קיימות ולבסוף סוגרת את החיבור. */
async function seedContent() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        let addedCount = 0;

        for (const content of sampleContents) {
            const existingContent = await Content.findOne({ title: content.title });

            if (!existingContent) {
                await Content.create(content);
                addedCount++;
            }
        }

        console.log(`Added ${addedCount} sample contents`);
    } catch (error) {
        console.error('Failed to add sample contents:', error.message);
    } finally {
        await mongoose.disconnect();
    }
}

seedContent();
