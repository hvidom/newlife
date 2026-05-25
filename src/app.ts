import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { actions, middleware, pages, i18n } from 'astro/hono';

const app = new Hono<{ Bindings: Env }>();

app.use(logger());
app.use(i18n());
app.use(middleware());
app.use(actions());

app.post('/api/subscribe', async (c) => {
  try {
    const { email, firstName } = await c.req.json();
    if (!email) return c.json({ error: 'Email обязателен' }, 400);
    const BREVO_API_KEY = c.env.BREVO_API_KEY; 
    if (!BREVO_API_KEY) {
      return c.json({ error: 'Server configuration error' }, 500);
    }
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.use(pages());

export type AppType = typeof app;
export default app;