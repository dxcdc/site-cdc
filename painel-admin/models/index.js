
import { Area } from './area.js';
import { Capa } from './banners.js';
import { CardInformativo } from './card_informativo.js';
import { Categoria } from './categoria.js';
import { ConteudoSecao } from './conteudo_secao.js';
import { DadosBancario } from './dados_bancarios.js';
import { Email } from './email.js';
import { Indicador } from './indicador.js';
import { Lideranca } from './lideranca.js';
import { LinhaDoTempo } from './linha_do_tempo.js';
import { LinhaDoTempoImagem } from './linha_do_tempo_imagens.js';
import { Noticia } from './noticia.js';
import { Oportunidade } from './oportunidade.js';
import { Organizacao } from './organizacao.js';
import { OrganizacaoImagem } from './organizacao_imagens.js';
import { Parceiro } from './parceiro.js';
import { PerguntaFrequente } from './pergunta_frequente.js';
import { Programa } from './programa.js';
import { ProgramaImagens } from './programa_imagens.js';
import { Publicacao } from './publicacao.js';
import { PublicacaoImagens } from './publicacao_imagens.js';
import Rodape from './rodape.js';
import { Transparencia } from './transparencia.js';

export function initializeModels(sequelize) {
  const models = {
    Area: Area.init(sequelize),
    Categoria: Categoria.init(sequelize),
    DadosBancario: DadosBancario.init(sequelize),
    LinhaDoTempo: LinhaDoTempo.init(sequelize),
    Noticia: Noticia.init(sequelize),
    Oportunidade: Oportunidade.init(sequelize),
    Parceiro: Parceiro.init(sequelize),
    PerguntaFrequente: PerguntaFrequente.init(sequelize),
    Programa: Programa.init(sequelize),
    Publicacao: Publicacao.init(sequelize),
    Transparencia: Transparencia.init(sequelize),
    LinhaDoTempoImagem: LinhaDoTempoImagem.init(sequelize),
    PublicacaoImagens: PublicacaoImagens.init(sequelize),
    ProgramaImagens: ProgramaImagens.init(sequelize),
    Lideranca: Lideranca.init(sequelize),
    CardInformativo: CardInformativo.init(sequelize),
    Email: Email.init(sequelize),
    Indicador: Indicador.init(sequelize),
    Organizacao: Organizacao.init(sequelize),
    OrganizacaoImagem: OrganizacaoImagem.init(sequelize),
    Capa: Capa.init(sequelize),
    ConteudoSecao: ConteudoSecao.init(sequelize),
    Rodape: Rodape.init(sequelize)
  };

  Object.values(models).forEach(model => {
    if (model.associate) {
      model.associate(models);
    }
  });

  return models;
}
