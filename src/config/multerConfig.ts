import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

// Função para gerar string aleatória de 16 caracteres (letras maiúsculas, minúsculas e números)
function gerarNomeAleatorio(tamanho: number): string {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let resultado = '';
  for (let i = 0; i < tamanho; i++) {
    const indice = crypto.randomInt(0, caracteres.length);
    resultado += caracteres[indice];
  }
  return resultado;
}

// Configuração para uploads genéricos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname, '..', '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const nomeAleatorio = gerarNomeAleatorio(16);
    const ext = path.extname(file.originalname);
    const filename = `${nomeAleatorio}${ext}`;
    cb(null, filename);
  }
});

export const upload = multer({ storage });

// Configuração para uploads de capas
const storageCapa = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname, '..', '..', 'uploads/cover'));
  },
  filename: (req, file, cb) => {
    const nomeAleatorio = gerarNomeAleatorio(16);
    const ext = path.extname(file.originalname);
    const filename = `${nomeAleatorio}${ext}`;
    cb(null, filename);
  }
});

export const uploadCapa = multer({ storage: storageCapa });
