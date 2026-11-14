const url = process.env.DB_FILE_NAME

if (!url && process.env.NODE_ENV === 'production') {
  throw new Error('DB_FILE_NAME is required in production')
}

export const dbUrl = url ?? 'file:local.db'
