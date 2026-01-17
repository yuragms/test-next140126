import { NextResponse } from 'next/server'
import { queryMySQL } from '@/lib/db/mysql'

export async function GET() {
  try {
    // Замените 'your_table_name' на имя вашей таблицы
    const data = await queryMySQL('SELECT * FROM categ LIMIT 100')

    return NextResponse.json({
      success: true,
      data: data,
      count: data.length,
    })
  } catch (error) {
    console.error('Error fetching MySQL data:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch data',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
