import fs from 'fs'
import path from 'path'
import { BaseProvider } from '@adminjs/upload'

export class LocalProvider extends BaseProvider {
  constructor() {
    super('uploads')
  }

  async upload(file, key) {
    console.log('📤 Upload local:', key)
    const targetPath = path.join(process.cwd(), 'uploads', key)
    const targetDir = path.dirname(targetPath)

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true })
    }

    await fs.promises.copyFile(file.path, targetPath)
    console.log('✅ Upload local finalizado com sucesso:', targetPath)
  }

  async delete(key) {
    console.log('🗑️ Removendo arquivo local:', key)
    const targetPath = path.join(process.cwd(), 'uploads', key)
    try {
      if (fs.existsSync(targetPath)) {
        await fs.promises.unlink(targetPath)
      }
    } catch (err) {
      console.warn('⚠️ Erro ao deletar arquivo local:', err.message)
    }
  }

  path(key) {
    return key
  }
}
