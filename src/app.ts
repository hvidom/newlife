import { actions, i18n, middleware, pages } from "astro/hono";
import { Hono } from "hono";
import { logger } from "hono/logger";

const app = new Hono<{ Bindings: Env }>();

app.use(logger());
app.use(i18n());
app.use(middleware());
app.use(actions());

// Вспомогательная функция для отправки транзакционных писем через Brevo SMTP
async function sendBrevoEmail({
    apiKey,
    toEmail,
    toName,
    subject,
    htmlContent,
    replyTo,
}: {
    apiKey: string;
    toEmail: string;
    toName: string;
    subject: string;
    htmlContent: string;
    replyTo?: { email: string; name: string };
}) {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
            "api-key": apiKey,
            "content-type": "application/json",
            accept: "application/json",
        },
        body: JSON.stringify({
            sender: {
                name: "New Life Integration Website",
                email: "info@newlifeintegration.ie",
            },
            to: [
                {
                    email: toEmail,
                    name: toName,
                },
            ],
            replyTo: replyTo,
            subject: subject,
            htmlContent: htmlContent,
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Brevo SMTP API Error (${response.status}): ${errorText}`);
    }

    return await response.json();
}

// Вспомогательная функция для добавления/обновления контактов в списках Brevo CRM
async function upsertBrevoContact({
    apiKey,
    email,
    firstName,
    lastName = "",
    listIds = [3], // По умолчанию список "website" (ID 3)
}: {
    apiKey: string;
    email: string;
    firstName: string;
    lastName?: string;
    listIds?: number[];
}) {
    const response = await fetch("https://api.brevo.com/v3/contacts", {
        method: "POST",
        headers: {
            "api-key": apiKey,
            "content-type": "application/json",
            accept: "application/json",
        },
        body: JSON.stringify({
            email: email,
            attributes: {
                FIRSTNAME: firstName,
                LASTNAME: lastName,
            },
            listIds: listIds,
            updateEnabled: true,
        }),
    });

    if (!response.ok) {
        const text = await response.text();
        console.error("[BREVO CRM SYSTEM ERROR]: Failed to upsert contact:", text);
    }
}

// 1. Эндпоинт стандартной контактной формы
app.post("/api/contact", async (c) => {
    try {
        const { fullName, email, phone, subject, message } = await c.req.json();

        if (!fullName || !email || !subject || !message) {
            return c.json({ error: "Missing required fields" }, 400);
        }

        // Поиск ключа для любых режимов запуска (Local Dev / Cloudflare Prod)
        const BREVO_API_KEY = c.env?.BREVO_API_KEY || import.meta.env.BREVO_API_KEY || process.env.BREVO_API_KEY;
        if (!BREVO_API_KEY) {
            console.warn("BREVO_API_KEY is not defined. Simulating execution (Dev Mode).");
            return c.json({ success: true, mode: "development_mock" });
        }

        // Параллельно сохраняем человека в контакты CRM (Разбиваем fullName на Имя и Фамилию для красоты)
        const [firstName, ...lastNameParts] = fullName.split(" ");
        const lastName = lastNameParts.join(" ");
        await upsertBrevoContact({ apiKey: BREVO_API_KEY, email, firstName, lastName });

        // Письмо для Команды NLI
        const teamHtml = `
            <h2>New Contact Form Inquiry</h2>
            <p>A user has sent an inquiry via the website contact form.</p>
            <table border="1" cellpadding="6" style="border-collapse: collapse; border-color: #ddd;">
                <tr><td><strong>Name:</strong></td><td>${fullName}</td></tr>
                <tr><td><strong>Email:</strong></td><td>${email}</td></tr>
                <tr><td><strong>Phone:</strong></td><td>${phone || "Not provided"}</td></tr>
                <tr><td><strong>Subject:</strong></td><td>${subject}</td></tr>
                <tr><td><strong>Message:</strong></td><td>${message.replace(/\n/g, "<br>")}</td></tr>
            </table>
        `;

        await sendBrevoEmail({
            apiKey: BREVO_API_KEY,
            toEmail: "info@newlifeintegration.ie",
            toName: "New Life Integration Team",
            subject: `[Web Inquiry] ${subject} - from ${fullName}`,
            htmlContent: teamHtml,
            replyTo: { email, name: fullName },
        });

        // Письмо-подтверждение Пользователю
        const userHtml = `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
                <h2 style="color: #0d9488;">Hello ${fullName},</h2>
                <p>Thank you for reaching out to <strong>New Life Integration & Wellbeing Network CLG</strong>!</p>
                <p>We have successfully received your inquiry regarding <strong>"${subject}"</strong>. Our team typically reviews all requests and replies within <strong>2–3 business days</strong>.</p>
                <p>Below is a summary of the details you submitted:</p>
                <blockquote style="border-left: 4px solid #0d9488; padding-left: 15px; color: #555; margin: 15px 0;">
                    ${message.replace(/\n/g, "<br>")}
                </blockquote>
                <p>If your inquiry is urgent, please feel free to reply directly to this email.</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="font-size: 12px; color: #777;">
                    New Life Integration & Wellbeing Network CLG<br />
                    Supporting Integration and Personal Wellbeing in Ireland
                </p>
            </div>
        `;

        await sendBrevoEmail({
            apiKey: BREVO_API_KEY,
            toEmail: email,
            toName: fullName,
            subject: `We've received your message: ${subject}`,
            htmlContent: userHtml,
        });

        return c.json({ success: true });
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error("Contact API Exception:", error);
        return c.json({ error: message || "Internal server error" }, 500);
    }
});

// 2. Эндпоинт отправки заявок на открытие новых филиалов
app.post("/api/open-branch", async (c) => {
    try {
        const { city, fullName, email, phone, background, events, team, languages } = await c.req.json();

        if (!city || !fullName || !email || !phone || !background) {
            return c.json({ error: "Missing required fields" }, 400);
        }

        const BREVO_API_KEY = c.env?.BREVO_API_KEY || import.meta.env.BREVO_API_KEY || process.env.BREVO_API_KEY;
        if (!BREVO_API_KEY) {
            console.warn("BREVO_API_KEY is not defined. Simulating application send (Dev Mode).");
            return c.json({ success: true, mode: "development_mock" });
        }

        // Сохраняем лидера филиала в CRM контакты
        const [firstName, ...lastNameParts] = fullName.split(" ");
        const lastName = lastNameParts.join(" ");
        await upsertBrevoContact({ apiKey: BREVO_API_KEY, email, firstName, lastName });

        // Письмо для Команды NLI
        const teamHtml = `
            <h2>New Branch Launch Expression of Interest</h2>
            <p>An application has been submitted to open a new branch in <strong>${city}</strong>.</p>
            <table border="1" cellpadding="6" style="border-collapse: collapse; border-color: #ddd;">
                <tr><td><strong>City / Town:</strong></td><td><strong>${city}</strong></td></tr>
                <tr><td><strong>Full Name:</strong></td><td>${fullName}</td></tr>
                <tr><td><strong>Email:</strong></td><td>${email}</td></tr>
                <tr><td><strong>Phone:</strong></td><td>${phone}</td></tr>
                <tr><td><strong>Languages:</strong></td><td>${languages || "Not specified"}</td></tr>
                <tr><td><strong>Core Team State:</strong></td><td>${team === "yes" ? "Yes (Launching group ready)" : team === "partial" ? "Partially (1-2 helpers)" : "No (Needs recruitment help)"}</td></tr>
                <tr><td><strong>Background:</strong></td><td>${background.replace(/\n/g, "<br>")}</td></tr>
                <tr><td><strong>Planned Events:</strong></td><td>${(events || "Not specified").replace(/\n/g, "<br>")}</td></tr>
            </table>
        `;

        await sendBrevoEmail({
            apiKey: BREVO_API_KEY,
            toEmail: "info@newlifeintegration.ie",
            toName: "New Life Integration Team",
            subject: `[New Branch Application] ${city} - from ${fullName}`,
            htmlContent: teamHtml,
            replyTo: { email, name: fullName },
        });

        // Письмо-подтверждение Заявителю
        const userHtml = `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
                <h2 style="color: #0d9488;">Hello ${fullName},</h2>
                <p>Thank you for expressing your interest in opening a community branch of <strong>New Life Integration & Wellbeing Network CLG</strong> in <strong>${city}</strong>!</p>
                <p>We are excited to expand our support systems and collaborate with local leaders like you to build cultural bridges across Ireland. As a reminder, our organization is a non-profit network with absolutely <strong>no franchise fees or commercial obligations</strong>.</p>
                <p>A member of our national coordination team will review your application details and contact you via email or phone within <strong>2–3 business days</strong> to arrange an initial introductory call.</p>
                <p>We look forward to working together!</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="font-size: 12px; color: #777;">
                    New Life Integration & Wellbeing Network CLG<br />
                    Supporting Integration and Personal Wellbeing in Ireland
                </p>
            </div>
        `;

        await sendBrevoEmail({
            apiKey: BREVO_API_KEY,
            toEmail: email,
            toName: fullName,
            subject: `Thank you for your Branch Application - ${city}`,
            htmlContent: userHtml,
        });

        return c.json({ success: true });
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error("Open Branch API Exception:", error);
        return c.json({ error: message || "Internal server error" }, 500);
    }
});

// 3. Эндпоинт чистой подписки на новостную рассылку (Newsletter)
app.post("/api/subscribe", async (c) => {
    try {
        const { email } = await c.req.json();
        if (!email) return c.json({ error: "Email is required" }, 400);

        const BREVO_API_KEY = c.env?.BREVO_API_KEY || import.meta.env.BREVO_API_KEY || process.env.BREVO_API_KEY;
        if (!BREVO_API_KEY) {
            return c.json({ success: true, mode: "development_mock" });
        }

        // Добавляем подписчика в CRM список website (ID 3)
        await upsertBrevoContact({
            apiKey: BREVO_API_KEY,
            email: email,
            firstName: "Newsletter",
            lastName: "Subscriber"
        });

        return c.json({ success: true });
    } catch (error) {
        console.error("Newsletter Subscribe API Error:", error);
        return c.json({ error: "Internal server error" }, 500);
    }
});

app.use(pages());

export type AppType = typeof app;
export default app;