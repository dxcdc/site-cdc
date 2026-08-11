import { QueryTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const normalizedEnvironmentEmails = () => (
  process.env.GOOGLE_ALLOWED_EMAILS || process.env.ADMIN_EMAIL || ''
)
  .split(',')
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

export const listDatabaseEmails = async () => sequelize.query(
  `SELECT id, email, created_at
     FROM oauth_authorized_emails
    ORDER BY email ASC`,
  { type: QueryTypes.SELECT },
);

export const isGoogleEmailAuthorized = async (email) => {
  const normalizedEmail = email?.trim().toLowerCase();
  if (!normalizedEmail) return false;
  if (normalizedEnvironmentEmails().includes(normalizedEmail)) return true;

  try {
    const rows = await sequelize.query(
      `SELECT 1
         FROM oauth_authorized_emails
        WHERE email = :email
        LIMIT 1`,
      { replacements: { email: normalizedEmail }, type: QueryTypes.SELECT },
    );
    return rows.length > 0;
  } catch (error) {
    console.error('Não foi possível consultar os e-mails OAuth autorizados:', error.message);
    return false;
  }
};

export const addDatabaseEmail = async (email) => {
  const normalizedEmail = email.trim().toLowerCase();
  const [row] = await sequelize.query(
    `INSERT INTO oauth_authorized_emails (email, created_at, updated_at)
     VALUES (:email, NOW(), NOW())
     ON CONFLICT (email) DO UPDATE SET updated_at = NOW()
     RETURNING id, email, created_at`,
    { replacements: { email: normalizedEmail }, type: QueryTypes.SELECT },
  );
  return row;
};

export const removeDatabaseEmail = async (id) => sequelize.query(
  `DELETE FROM oauth_authorized_emails WHERE id = :id`,
  { replacements: { id }, type: QueryTypes.DELETE },
);

export const environmentEmails = normalizedEnvironmentEmails;
