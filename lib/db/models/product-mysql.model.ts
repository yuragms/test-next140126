// ==========================================
// lib/db/models/product.model.ts
// ==========================================
import { connectToMySQL } from '../mysql'
import { RowDataPacket, ResultSetHeader } from 'mysql2'
import { IProductInput } from '@/types'

export interface IProduct extends IProductInput {
  id: number
  createdAt: Date
  updatedAt: Date
}

interface ProductRow extends RowDataPacket {
  id: number
  name: string
  slug: string
  category: string
  images: string
  brand: string
  description: string
  price: number
  listPrice: number
  countInStock: number
  tags: string
  colors: string
  sizes: string
  avgRating: number
  numReviews: number
  ratingDistribution: string
  numSales: number
  isPublished: boolean
  createdAt: Date
  updatedAt: Date
}

class ProductModel {
  private static parseProduct(row: ProductRow): IProduct {
    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      category: row.category,
      images: JSON.parse(row.images || '[]'),
      brand: row.brand,
      description: row.description,
      price: Number(row.price),
      listPrice: Number(row.listPrice),
      countInStock: row.countInStock,
      tags: JSON.parse(row.tags || '[]'),
      colors: JSON.parse(row.colors || '[]'),
      sizes: JSON.parse(row.sizes || '[]'),
      avgRating: Number(row.avgRating),
      numReviews: row.numReviews,
      ratingDistribution: JSON.parse(row.ratingDistribution || '[]'),
      numSales: row.numSales,
      isPublished: Boolean(row.isPublished),
      reviews: [],
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }
  }

  static async findAll(): Promise<IProduct[]> {
    const pool = await connectToMySQL()
    const [rows] = await pool.execute<ProductRow[]>(
      'SELECT * FROM products ORDER BY createdAt DESC'
    )
    return rows.map(this.parseProduct)
  }

  static async findById(id: number): Promise<IProduct | null> {
    const pool = await connectToMySQL()
    const [rows] = await pool.execute<ProductRow[]>(
      'SELECT * FROM products WHERE id = ?',
      [id]
    )
    return rows.length > 0 ? this.parseProduct(rows[0]) : null
  }

  static async findBySlug(slug: string): Promise<IProduct | null> {
    const pool = await connectToMySQL()
    const [rows] = await pool.execute<ProductRow[]>(
      'SELECT * FROM products WHERE slug = ?',
      [slug]
    )
    return rows.length > 0 ? this.parseProduct(rows[0]) : null
  }

  static async findByCategory(category: string): Promise<IProduct[]> {
    const pool = await connectToMySQL()
    const [rows] = await pool.execute<ProductRow[]>(
      'SELECT * FROM products WHERE category = ? AND isPublished = TRUE ORDER BY createdAt DESC',
      [category]
    )
    return rows.map(this.parseProduct)
  }

  static async findPublished(): Promise<IProduct[]> {
    const pool = await connectToMySQL()
    const [rows] = await pool.execute<ProductRow[]>(
      'SELECT * FROM products WHERE isPublished = TRUE ORDER BY createdAt DESC'
    )
    return rows.map(this.parseProduct)
  }

  static async create(productData: IProductInput): Promise<IProduct> {
    const pool = await connectToMySQL()
    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO products (
        name, slug, category, images, brand, description, price, listPrice,
        countInStock, tags, colors, sizes, avgRating, numReviews,
        ratingDistribution, numSales, isPublished
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        productData.name,
        productData.slug,
        productData.category,
        JSON.stringify(productData.images),
        productData.brand,
        productData.description,
        productData.price,
        productData.listPrice,
        productData.countInStock,
        JSON.stringify(productData.tags || []),
        JSON.stringify(productData.colors || []),
        JSON.stringify(productData.sizes || []),
        productData.avgRating || 0,
        productData.numReviews || 0,
        JSON.stringify(productData.ratingDistribution || []),
        productData.numSales || 0,
        productData.isPublished || false,
      ]
    )

    const newProduct = await this.findById(result.insertId)
    if (!newProduct) throw new Error('Failed to create product')
    return newProduct
  }

  static async update(
    id: number,
    productData: Partial<IProductInput>
  ): Promise<IProduct | null> {
    const pool = await connectToMySQL()

    const fields: string[] = []
    const values: any[] = []

    if (productData.name !== undefined) {
      fields.push('name = ?')
      values.push(productData.name)
    }
    if (productData.slug !== undefined) {
      fields.push('slug = ?')
      values.push(productData.slug)
    }
    if (productData.category !== undefined) {
      fields.push('category = ?')
      values.push(productData.category)
    }
    if (productData.images !== undefined) {
      fields.push('images = ?')
      values.push(JSON.stringify(productData.images))
    }
    if (productData.brand !== undefined) {
      fields.push('brand = ?')
      values.push(productData.brand)
    }
    if (productData.description !== undefined) {
      fields.push('description = ?')
      values.push(productData.description)
    }
    if (productData.price !== undefined) {
      fields.push('price = ?')
      values.push(productData.price)
    }
    if (productData.listPrice !== undefined) {
      fields.push('listPrice = ?')
      values.push(productData.listPrice)
    }
    if (productData.countInStock !== undefined) {
      fields.push('countInStock = ?')
      values.push(productData.countInStock)
    }
    if (productData.tags !== undefined) {
      fields.push('tags = ?')
      values.push(JSON.stringify(productData.tags))
    }
    if (productData.colors !== undefined) {
      fields.push('colors = ?')
      values.push(JSON.stringify(productData.colors))
    }
    if (productData.sizes !== undefined) {
      fields.push('sizes = ?')
      values.push(JSON.stringify(productData.sizes))
    }
    if (productData.avgRating !== undefined) {
      fields.push('avgRating = ?')
      values.push(productData.avgRating)
    }
    if (productData.numReviews !== undefined) {
      fields.push('numReviews = ?')
      values.push(productData.numReviews)
    }
    if (productData.ratingDistribution !== undefined) {
      fields.push('ratingDistribution = ?')
      values.push(JSON.stringify(productData.ratingDistribution))
    }
    if (productData.numSales !== undefined) {
      fields.push('numSales = ?')
      values.push(productData.numSales)
    }
    if (productData.isPublished !== undefined) {
      fields.push('isPublished = ?')
      values.push(productData.isPublished)
    }

    if (fields.length === 0) return this.findById(id)

    values.push(id)

    await pool.execute(
      `UPDATE products SET ${fields.join(', ')} WHERE id = ?`,
      values
    )

    return this.findById(id)
  }

  static async delete(id: number): Promise<boolean> {
    const pool = await connectToMySQL()
    const [result] = await pool.execute<ResultSetHeader>(
      'DELETE FROM products WHERE id = ?',
      [id]
    )
    return result.affectedRows > 0
  }

  static async deleteMany(): Promise<number> {
    const pool = await connectToMySQL()
    const [result] = await pool.execute<ResultSetHeader>('DELETE FROM products')
    return result.affectedRows
  }

  static async insertMany(products: IProductInput[]): Promise<IProduct[]> {
    const createdProducts: IProduct[] = []

    for (const product of products) {
      const created = await this.create(product)
      createdProducts.push(created)
    }

    return createdProducts
  }

  static async search(query: string): Promise<IProduct[]> {
    const pool = await connectToMySQL()
    const searchTerm = `%${query}%`
    const [rows] = await pool.execute<ProductRow[]>(
      `SELECT * FROM products 
       WHERE (name LIKE ? OR description LIKE ? OR brand LIKE ?) 
       AND isPublished = TRUE 
       ORDER BY createdAt DESC`,
      [searchTerm, searchTerm, searchTerm]
    )
    return rows.map(this.parseProduct)
  }
}

export default ProductModel
