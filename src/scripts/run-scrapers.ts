import './env'  // ← esta línea primero, antes de todo
import { scrapExito }    from './scrapers/exito'
import { scrapOlimpica } from './scrapers/olimpica'

async function main() {
  console.log('🚀 Iniciando scrapers...', new Date().toISOString())
  await scrapExito()
  await scrapOlimpica()
  console.log('🎉 Todos los scrapers completados')
}

main().catch(console.error)
