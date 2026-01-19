// lib/db/mysql.ts
// import mysql from 'mysql2/promise'

// let connection: mysql.Connection | null = null

// export async function connectToMySQL() {
//   if (connection) {
//     return connection
//   }

//   try {
//     connection = await mysql.createConnection({
//       host: process.env.MYSQL_HOST || 'localhost',
//       user: process.env.MYSQL_USER,
//       password: process.env.MYSQL_PASSWORD,
//       database: process.env.MYSQL_DATABASE,
//       port: parseInt(process.env.MYSQL_PORT || '3306'),
//     })

//     console.log('✅ Connected to MySQL')
//     return connection
//   } catch (error) {
//     console.error('❌ MySQL connection error:', error)
//     throw error
//   }
// }

// export async function queryMySQL<T = any>(
//   sql: string,
//   params?: any[]
// ): Promise<T[]> {
//   const conn = await connectToMySQL()
//   const [rows] = await conn.execute(sql, params)
//   return rows as T[]
// }

// ==========================================
import mysql from 'mysql2/promise'

let pool: mysql.Pool | null = null

export async function connectToMySQL() {
  if (pool) {
    return pool
  }

  try {
    pool = mysql.createPool({
      host: process.env.MYSQL_HOST || 'localhost',
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      port: parseInt(process.env.MYSQL_PORT || '3306'),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    })

    // Проверка подключения
    const connection = await pool.getConnection()
    console.log('✅ Connected to MySQL')
    connection.release()

    return pool
  } catch (error) {
    console.error('❌ MySQL connection error:', error)
    throw error
  }
}

export async function disconnectFromMySQL() {
  if (pool) {
    await pool.end()
    pool = null
    console.log('✅ Disconnected from MySQL')
  }
}

export async function queryMySQL<T = any>(
  sql: string,
  params?: any[]
): Promise<T[]> {
  const conn = await connectToMySQL()
  const [rows] = await conn.execute(sql, params)
  return rows as T[]
}
