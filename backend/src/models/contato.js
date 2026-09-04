import { DataTypes, Model } from "sequelize";

class Contato extends Model {
  static init(sequelize) {
    return super.init({
      nome: DataTypes.STRING(255),
      email: DataTypes.STRING(255),
      razao_contato: DataTypes.STRING(255),
      mensagem: DataTypes.TEXT,
      resposta: DataTypes.BOOLEAN,
      data_envio: DataTypes.DATE,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    }, {
      sequelize,
      tableName: "contato",
      timestamps: false,
    });
  }
}

export default Contato;
