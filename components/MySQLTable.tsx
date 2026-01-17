// components/MySQLTable.tsx
'use client'

import { useState, useEffect } from 'react'

interface TableData {
  [key: string]: any
}

export default function MySQLTable() {
  const [data, setData] = useState<TableData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/mysql-data')
      const result = await response.json()

      if (result.success) {
        setData(result.data)
      } else {
        setError(result.message || 'Failed to load data')
      }
    } catch (err) {
      setError('Error loading data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className='p-4'>Loading...</div>
  }

  if (error) {
    return <div className='p-4 text-red-500'>Error: {error}</div>
  }

  if (data.length === 0) {
    return <div className='p-4'>No data found</div>
  }

  const columns = Object.keys(data[0])

  return (
    <div className='overflow-x-auto p-4'>
      <table className='min-w-full border border-gray-300'>
        <thead className='bg-gray-100'>
          <tr>
            {columns.map((column) => (
              <th
                key={column}
                className='border border-gray-300 px-4 py-2 text-left'
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className='hover:bg-gray-50'>
              {columns.map((column) => (
                <td key={column} className='border border-gray-300 px-4 py-2'>
                  {String(row[column])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
