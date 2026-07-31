import express from 'express';
import multer from 'multer';
import path from 'path';
import { GCPProvider } from '../config/GCPProvider.js';
import { LocalProvider } from '../config/LocalProvider.js';
import fs from 'fs'

const router = express.Router();
const upload = multer({ dest: 'tmp/' }); // uploads temporários no disco

const hasGcpKey = fs.existsSync(path.join(process.cwd(), 'config/chave.json'))
const provider = hasGcpKey ? new GCPProvider() : new LocalProvider()

router.post('/admin/upload-editor-image', upload.single('file'), async (req, res) => {
  const file = req.file;
  const folder = req.body.folder || 'editor';
  const filename = `${Date.now()}-${file.originalname}`;
  const key = path.posix.join(folder, filename);

  try {
    await provider.upload(file, key);
    const rawPath = provider.path(key);
    const publicUrl = rawPath.startsWith('http') ? rawPath : `/uploads/${rawPath}`;

    // remove o arquivo temporário
    fs.unlink(file.path, () => {});

    res.json({ url: publicUrl });
  } catch (error) {
    console.error('❌ Erro ao enviar imagem:', error);
    res.status(500).json({ error: 'Erro ao enviar imagem' });
  }
});

export default router;
