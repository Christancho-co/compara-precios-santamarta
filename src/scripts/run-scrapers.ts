import './env'  // ← esta línea primero, antes de todo
import { searchExito }    from '../lib/scrapers/exito'
import { searchOlimpica } from '../lib/scrapers/olimpica'

async function main() {
  console.log('🚀 Iniciando scrapers...', new Date().toISOString())
 searchExito('arroz')
 searchOlimpica('arroz')
  console.log('🎉 Todos los scrapers completados')
}

main().catch(console.error)
