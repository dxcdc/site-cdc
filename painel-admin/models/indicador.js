
import { DataTypes, Model } from "sequelize";

export class Indicador extends Model {
  static init(sequelize) {
    return super.init({
      descricao: DataTypes.STRING,
      quantidade: DataTypes.INTEGER,
    }, {
      sequelize,
      tableName: "indicadores",
      timestamps: false,
    });
  }

  static associate(models) {
  }
}
