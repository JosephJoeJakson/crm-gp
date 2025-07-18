// vite-crypto-fix.js
import { createHash } from 'node:crypto'

// Polyfill the exact hash function Vite needs
globalThis.crypto = {
  ...globalThis.crypto,
  hash: (algorithm, data) => {
    return createHash(algorithm.toLowerCase())
      .update(data)
      .digest()
  }
}