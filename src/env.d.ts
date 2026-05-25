/// <reference types="astro/client" />

// 1. Описываем типы для переменных Cloudflare
interface Env {
    BREVO_API_KEY: string;
    // Если появятся другие переменные (например, KV, D1, ID списков), добавляйте их сюда
  }
  
  // 2. Интегрируем типы в глобальный контекст Cloudflare (опционально, для wrangler)
  interface Runtime {
    env: Env;
  }
  
  declare namespace App {
    interface Locals extends Runtime {}
  }