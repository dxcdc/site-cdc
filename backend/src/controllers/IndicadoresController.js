import db from "../models/index.js";

class IndicadoresController {
    static async index(req, res) {
        const indicadores = await db.Indicador.findAll();
        return res.json(indicadores);
    }

    static async show(req, res) {
        const indicador = await db.Indicador.findByPk(req.params.id);
        if (!indicador) return res.status(404).json({ error: "Indicador não encontrada" });
        return res.json(indicador);
    }
}

export default IndicadoresController;
