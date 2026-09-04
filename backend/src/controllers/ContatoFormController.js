import db from "../models/index.js";
import nodemailer from 'nodemailer';

class ContatoFormController {
  static async index(req, res) {
    try {
      const { nome, email, motivo, mensagem } = req.body;

      if (!nome || !email || !mensagem) {
        return res.status(400).json({ error: 'Preencha os campos obrigatórios (nome, e-mail e mensagem).' });
      }

      // 1. Salvar no banco de dados na tabela "contato" para garantir recebimento
      await db.Contato.create({
        nome,
        email,
        razao_contato: motivo || 'Contato pelo site',
        mensagem,
        data_envio: new Date(),
      });

      // 2. Tentar enviar e-mail via SMTP se credenciais estiverem configuradas
      if (process.env.EMAIL_FROM && process.env.EMAIL_PASSWORD) {
        try {
          const destinatarios = await db.Email.findAll({
            where: { tipo: 'contato' }
          });

          const toEmails = destinatarios.length 
            ? destinatarios.map(d => d.email) 
            : ['cdc@cdc.org.br'];

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
            subject: `Novo Contato Site - ${motivo || 'Geral'}`,
            html: `
              <h3>Novo Contato Recebido pelo Site</h3>
              <p><strong>Nome:</strong> ${nome}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Motivo:</strong> ${motivo || 'Não informado'}</p>
              <p><strong>Mensagem:</strong></p>
              <p>${mensagem}</p>
            `
          };

          await transporter.sendMail(mailOptions);
        } catch (emailError) {
          console.error("Aviso ao enviar e-mail de contato via SMTP:", emailError.message);
        }
      }

      return res.status(200).json({ message: 'Mensagem enviada com sucesso!' });
    } catch (error) {
      console.error('Erro no formulário de contato:', error);
      return res.status(500).json({ error: 'Erro ao processar o formulário de contato' });
    }
  }
}

export default ContatoFormController;
