// ==========================================
// lib/db/init.ts (для инициализации таблиц)
// ==========================================
import { connectToMySQL } from './mysql'
import { cwd } from 'process'
import { loadEnvConfig } from '@next/env'

loadEnvConfig(cwd())

const createTables = async () => {
  try {
    const pool = await connectToMySQL()

    // Создаём таблицу products
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        category VARCHAR(100) NOT NULL,
        images JSON NOT NULL,
        brand VARCHAR(100) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        listPrice DECIMAL(10, 2) NOT NULL,
        countInStock INT NOT NULL DEFAULT 0,
        tags JSON,
        colors JSON,
        sizes JSON,
        avgRating DECIMAL(3, 2) NOT NULL DEFAULT 0.00,
        numReviews INT NOT NULL DEFAULT 0,
        ratingDistribution JSON,
        numSales INT NOT NULL DEFAULT 0,
        isPublished BOOLEAN NOT NULL DEFAULT FALSE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_slug (slug),
        INDEX idx_category (category),
        INDEX idx_brand (brand),
        INDEX idx_isPublished (isPublished)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)

    // Создаём таблицу reviews
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        productId INT NOT NULL,
        userId INT,
        rating INT NOT NULL,
        comment TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE,
        INDEX idx_productId (productId)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)

    console.log('✅ Tables created successfully')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error creating tables:', error)
    process.exit(1)
  }
}

createTables()
