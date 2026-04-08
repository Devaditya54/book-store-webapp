const User = require('./models/User');
const Book = require('./models/Book');

const sampleBooks = [
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    description: 'A story of wealth, love, and the American Dream in the 1920s. Nick Carraway narrates the mysterious life of Jay Gatsby and his obsession with Daisy Buchanan.',
    genre: 'Fiction',
    rentPrice: 2.99,
    totalCopies: 5,
    availableCopies: 5,
    publishedYear: 1925,
    rating: 4.5,
    coverImage: 'https://covers.openlibrary.org/b/id/8432148-L.jpg'
  },
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    description: 'A powerful story about racial injustice and loss of innocence in the American South, told through the eyes of young Scout Finch.',
    genre: 'Fiction',
    rentPrice: 2.49,
    totalCopies: 4,
    availableCopies: 4,
    publishedYear: 1960,
    rating: 4.8,
    coverImage: 'https://covers.openlibrary.org/b/id/8810494-L.jpg'
  },
  {
    title: 'A Brief History of Time',
    author: 'Stephen Hawking',
    description: 'Stephen Hawking explores the universe from the Big Bang to black holes, making complex cosmological concepts accessible to all readers.',
    genre: 'Science',
    rentPrice: 3.99,
    totalCopies: 3,
    availableCopies: 3,
    publishedYear: 1988,
    rating: 4.7,
    coverImage: 'https://covers.openlibrary.org/b/id/8631725-L.jpg'
  },
  {
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    description: 'How did Homo sapiens come to dominate the Earth? This groundbreaking book explores the history of humanity through biology, economics and culture.',
    genre: 'History',
    rentPrice: 4.49,
    totalCopies: 6,
    availableCopies: 6,
    publishedYear: 2011,
    rating: 4.6,
    coverImage: 'https://covers.openlibrary.org/b/id/10527843-L.jpg'
  },
  {
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    description: 'Bilbo Baggins, a hobbit who enjoys a comfortable life, is whisked away on an unexpected journey by a wizard and a band of dwarves.',
    genre: 'Fantasy',
    rentPrice: 2.99,
    totalCopies: 5,
    availableCopies: 5,
    publishedYear: 1937,
    rating: 4.8,
    coverImage: 'https://covers.openlibrary.org/b/id/8406786-L.jpg'
  },
  {
    title: 'Clean Code',
    author: 'Robert C. Martin',
    description: 'A handbook of agile software craftsmanship that helps programmers write better, cleaner, more maintainable code.',
    genre: 'Technology',
    rentPrice: 5.99,
    totalCopies: 4,
    availableCopies: 4,
    publishedYear: 2008,
    rating: 4.5,
    coverImage: 'https://covers.openlibrary.org/b/id/7898938-L.jpg'
  },
  {
    title: 'Atomic Habits',
    author: 'James Clear',
    description: 'An easy and proven way to build good habits and break bad ones. James Clear offers a framework for improving every day.',
    genre: 'Self-Help',
    rentPrice: 3.49,
    totalCopies: 7,
    availableCopies: 7,
    publishedYear: 2018,
    rating: 4.9,
    coverImage: 'https://covers.openlibrary.org/b/id/10283783-L.jpg'
  },
  {
    title: 'The Da Vinci Code',
    author: 'Dan Brown',
    description: 'Robert Langdon investigates a murder in the Louvre and discovers a battle between the Priory of Sion and Opus Dei over a religious secret.',
    genre: 'Mystery',
    rentPrice: 2.99,
    totalCopies: 5,
    availableCopies: 5,
    publishedYear: 2003,
    rating: 4.2,
    coverImage: 'https://covers.openlibrary.org/b/id/8219501-L.jpg'
  },
  {
    title: 'Steve Jobs',
    author: 'Walter Isaacson',
    description: 'The exclusive biography of Steve Jobs. Based on over forty interviews with Jobs over two years, plus more than a hundred interviews with family members.',
    genre: 'Biography',
    rentPrice: 4.99,
    totalCopies: 3,
    availableCopies: 3,
    publishedYear: 2011,
    rating: 4.6,
    coverImage: 'https://covers.openlibrary.org/b/id/8739161-L.jpg'
  },
  {
    title: '1984',
    author: 'George Orwell',
    description: 'A dystopian social science fiction novel set in a totalitarian society. Winston Smith works for the Ministry of Truth in Oceania.',
    genre: 'Fiction',
    rentPrice: 2.49,
    totalCopies: 6,
    availableCopies: 6,
    publishedYear: 1949,
    rating: 4.7,
    coverImage: 'https://covers.openlibrary.org/b/id/8575708-L.jpg'
  },
  {
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    description: 'The story follows the main character Elizabeth Bennet as she deals with issues of manners, upbringing, morality, education and marriage.',
    genre: 'Romance',
    rentPrice: 1.99,
    totalCopies: 4,
    availableCopies: 4,
    publishedYear: 1813,
    rating: 4.5,
    coverImage: 'https://covers.openlibrary.org/b/id/8739250-L.jpg'
  },
  {
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    description: "A young Andalusian shepherd's journey to the Egyptian pyramids in search of a treasure he saw in a dream, discovering the Soul of the World.",
    genre: 'Fiction',
    rentPrice: 2.99,
    totalCopies: 8,
    availableCopies: 8,
    publishedYear: 1988,
    rating: 4.6,
    coverImage: 'https://covers.openlibrary.org/b/id/8231765-L.jpg'
  }
];

module.exports = async function seedData() {
  try {
    // Seed admin
    const adminExists = await User.findOne({ email: 'admin@admin.com' });
    if (!adminExists) {
      await User.create({
        name: 'Admin',
        email: 'admin@admin.com',
        password: 'admin@123',
        role: 'admin'
      });
      console.log('✅ Admin user created: admin@admin.com / admin@123');
    }

    // Seed books
    const bookCount = await Book.countDocuments();
    if (bookCount === 0) {
      await Book.insertMany(sampleBooks);
      console.log('✅ Sample books seeded');
    }
  } catch (err) {
    console.error('Seed error:', err.message);
  }
};
