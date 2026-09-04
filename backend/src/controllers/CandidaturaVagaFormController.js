import db from "../models/index.js";
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

class CandidaturaVagaFormController {
  static async index(req, res) {
    let anexo = req.file || null;
    try {
      const { nome, email, mensagem, titulo_vaga } = req.body;

      if (!nome || !email) {
        if (anexo && fs.existsSync(path.resolve(anexo.path))) {
          fs.unlinkSync(path.resolve(anexo.path));
        }
        return res.status(400).json({ error: 'Nome e e-mail são obrigatórios.' });
      }

      // Tentar enviar e-mail via SMTP se credenciais estiverem configuradas
      if (process.env.EMAIL_FROM && process.env.EMAIL_PASSWORD) {
        try {
          const destinatarios = await db.Email.findAll({
            where: { tipo: 'curriculo' }
          });

          const toEmails = destinatarios.length 
            ? destinatarios.map(d => d.email) 
            : ['vagas@cdc.org.br'];

          const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '465', 10),
            secure: process.env.SMTP_SECURE !== 'false',
            auth: {
              user: process.env.EMAIL_FROM,
              pass: process.env.EMAIL_PASSWORD
            }
          });

          const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: toEmails,
            subject: `Nova Candidatura - ${titulo_vaga || 'Vaga'}`,
            html: `
              <h3>Nova Candidatura Recebida - ${titulo_vaga || 'Vaga'}</h3>
              <p><strong>Nome:</strong> ${nome}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Mensagem:</strong></p>
              <p>${mensagem || 'Sem mensagem'}</p>
            `,
            attachments: anexo && fs.existsSync(path.resolve(anexo.path)) ? [{
              filename: anexo.originalname,
              path: path.resolve(anexo.path)
            }] : []
          };

          await transporter.sendMail(mailOptions);
        } catch (emailError) {
          console.error("Aviso ao enviar e-mail de candidatura via SMTP:", emailError.message);
        }
      }

      if (anexo && fs.existsSync(path.resolve(anexo.path))) {
        fs.unlinkSync(path.resolve(anexo.path));
      }

      return res.status(201).json({
        success: true,
        message: 'Formulário enviado com sucesso!'
      });

    } catch (error) {
      if (anexo && fs.existsSync(path.resolve(anexo.path))) {
        fs.unlinkSync(path.resolve(anexo.path));
      }
      console.error('Erro na candidatura:', error);
      return res.status(500).json({ error: 'Erro ao processar a candidatura' });
    }
  }
}

export default CandidaturaVagaFormController;