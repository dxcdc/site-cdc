
import { DataTypes, Model } from "sequelize";

class Indicador extends Model {
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

export default Indicador;
