
import db from "../models/index.js";
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

class ContatoFormController {
    static async index(req, res) {
        try {
            const { nome, email, motivo, mensagem } = req.body;


            const destinatarios = await db.Email.findAll({
                where: { tipo: 'contato' }
            });


            if (!destinatarios.length) {
                return res.status(404).json({ error: 'Nenhum email destinatário encontrado' });
            }

            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465, // ou 587 se quiser TLS STARTTLS
                secure: true, // true para 465, false para 587
                auth: {
                    user: process.env.EMAIL_FROM,
                    pass: process.env.EMAIL_PASSWORD
                }
            });

            const mailOptions = {
                from: process.env.EMAIL_FROM,
                to: destinatarios.map(d => d.email),
                subject: `Novo Contato - Motivo: ${motivo}`,
                html: `
                    <h3>Novo Contato Recebido</h3>
                    <p><strong>Nome:</strong> ${nome}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Motivo do Contato:</strong> ${motivo}</p>
                    <p><strong>Mensagem:</strong></p>
                    <p>${mensagem}</p>
                `
            };

            await transporter.sendMail(mailOptions);
            res.status(200).json({ message: 'Mensagem enviada com sucesso' });
            // return res.json({ message: 'Mensagem enviada com sucesso!' });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao enviar o formulário' });
        }
    }
}

export default ContatoFormController;
