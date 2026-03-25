import { config } from 'dotenv'
import { resolve } from 'path'

// Carga el .env.local desde la raíz del proyecto
config({ path: resolve(process.cwd(), '.env.local') })
