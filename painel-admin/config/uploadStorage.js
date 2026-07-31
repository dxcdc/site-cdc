import uploadFeature from '@adminjs/upload'
import { componentLoader } from '../src/components.js'
import { GCPProvider } from './GCPProvider.js'
import { LocalProvider } from './LocalProvider.js'
import fs from 'fs'
import path from 'path'

const hasGcpKey = fs.existsSync(path.join(process.cwd(), 'config/chave.json'))
const provider = hasGcpKey ? new GCPProvider() : new LocalProvider()

export const createUploadFeature = ({
  folder = 'uploads',
  key = 'url_imagem',
  file = 'uploadImagem',
  filePath = 'filePath',
  filesToDelete = 'filesToDelete',
  multiple = false,
}) =>
  uploadFeature({
    componentLoader,
    provider,
    properties: {
      key,
      file,
      filePath,
      filesToDelete,
    },
    multiple,
    validation: {
      mimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
      maxSize: 5 * 1024 * 1024, // 5MB
    },
    uploadPath: (record, filename) => {
      const id = record?.id?.() || `temp-${Date.now()}`
      const safeName = filename.replace(/\s+/g, '_')
      return `${folder}/${id}-${safeName}`
    },
  })
