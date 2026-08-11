import AdminJS from 'adminjs'
import AdminJSExpress from '@adminjs/express'
import { Database, Resource } from '@adminjs/sequelize'
import { initializeModels } from '../models/index.js'
import { sequelize } from './database.js'
import { Components, componentLoader } from '../src/components.js'
import { createUploadFeature } from './uploadStorage.js'
import readingTime from 'reading-time';
import { Op } from 'sequelize'
import { createImageUploadProperties } from '../helpers/admin.helper.js'

AdminJS.registerAdapter({ Database, Resource })

const models = initializeModels(sequelize)

const adminNavigation = {
    configuracoes: { name: 'Configurações', icon: 'Settings' },
    inicio: { name: 'Início', icon: 'Home' },
    institucional: { name: 'Institucional', icon: 'Users' },
    programas: { name: 'Programas', icon: 'Layers' },
    informeSe: { name: 'Informe-se', icon: 'BookOpen' },
}

const areaDeAtuacaoProperty = {
    reference: 'areas',
    isVisible: { list: true, edit: true, filter: true, show: true },
    label: 'Área de Atuação',
    isArray: true,
    components: {
        list: Components.AreaListDisplay,
        edit: Components.MultiSelectInput,
    },
};

export const adminJs = new AdminJS({
    pages: {
        googleAccess: {
            label: 'Acesso Google',
            component: Components.GoogleAccessPage,
            icon: 'Shield',
            handler: async () => ({}),
        },
    },
    dashboard: {
        component: Components.CdcDashboard,
    },
    assets: {
        styles: [
            '/admin/css/suneditor.min.css',
            '/admin/css/editor-custom.css?v=2',
            '/admin/css/admin-navigation.css?v=9',
            '/admin/css/admin-topbar.css?v=7',
        ], // 👈 adiciona aqui
        scripts: ['/admin/js/admin-navigation.js?v=8', '/admin/js/admin-topbar.js?v=6'],
    },
    resources: [
        {
            resource: models.Area, options: {
                navigation: adminNavigation.configuracoes,
                properties: {
                    nome: {
                        isTitle: true
                    }
                },
            }
        },
        {
            resource: models.Organizacao,
            features: [
                // Sua configuração do feature continua a mesma, está correta
                createUploadFeature({
                    folder: 'organizacao',
                    file: 'uploadImagens',
                    key: 'imagem_url', // <- Note que a key aqui é 'imagem_url'
                    multiple: true,
                }),
            ],
            options: {
                navigation: adminNavigation.inicio,
                id: 'Organizacao',
                listProperties: ['id', 'titulo', 'descricao', 'imagem_url'],
                newProperties: ['titulo', 'descricao', 'uploadImagens'],
                editProperties: ['titulo', 'descricao', 'uploadImagens'],
                showProperties: ['id', 'titulo', 'descricao', 'imagem_url'],

                properties: {
                    id: { isVisible: { list: true, edit: false, show: true, filter: true } },

                    // A propriedade 'nome' foi renomeada para 'titulo' para corresponder ao seu Model
                    titulo: {
                        isTitle: true,
                        isRequired: true,
                    },
                    descricao: {
                        type: 'richtext',
                        // components: {
                        //     list: Components.TextoPreview,
                        // }
                    },

                    // Suas propriedades de imagem, sem alterações
                    uploadImagens: {
                        label: 'Imagens',
                        components: {
                            edit: Components.ImageEditor,
                        },
                        isVisible: { list: false, show: false, filter: false, edit: true },
                    },
                    imagesToDelete: { isVisible: false },
                    imagem_url: {
                        label: "Imagens",
                        isVisible: { list: true, show: true, edit: false, filter: false },
                        components: {
                            list: Components.ImageListPreview,
                            show: Components.ImageListPreview,
                        }
                    }
                },


                // Substituímos suas actions antigas por esta lógica completa
                actions: {
                    new: {
                        after: async (response, request, context) => {
                            const { record } = context;
                            if (!record || !record.isValid()) { return response; }

                            const novasImagens = Object.entries(request.files || {})
                                .filter(([key]) => key.startsWith('uploadImagens'))
                                .map(([, file]) => file);

                            if (novasImagens && novasImagens.length > 0) {
                                for (const imagem of novasImagens) {
                                    const filename = imagem.name.replace(/\s/g, '_');
                                    const gcsPath = `organizacao/${record.id()}-${filename}`;

                                    await models.OrganizacaoImagem.create({
                                        organizacao_id: record.id(), // Chave estrangeira correta
                                        imagem_url: gcsPath,         // Nome do campo de imagem correto
                                    });
                                }
                            }
                            return response;
                        }
                    },

                    edit: {
                        before: async (request, context) => {
                            const { record } = context;
                            if (record && record.id()) {
                                const imagens = await models.OrganizacaoImagem.findAll({
                                    where: { organizacao_id: record.id() }, // Chave estrangeira correta
                                    raw: true,
                                });
                                // Renomeamos a propriedade para o componente ImageEditor funcionar
                                // Ele espera 'url_imagem', mas seu model tem 'imagem_url'
                                record.params.imagens = imagens.map(img => ({
                                    id: img.id,
                                    url_imagem: img.imagem_url, // Mapeamento de nome
                                }));
                            }
                            return request;
                        },
                        after: async (response, request, context) => {
                            const { record } = context;
                            const { payload } = request;

                            // 1. Lógica de exclusão
                            const idsParaDeletar = Object.keys(payload)
                                .filter(key => key.startsWith('imagesToDelete.'))
                                .map(key => payload[key]);
                            if (idsParaDeletar && idsParaDeletar.length > 0) {
                                await models.OrganizacaoImagem.destroy({ where: { id: { [Op.in]: idsParaDeletar } } });
                            }

                            // 2. Lógica de upload
                            const novasImagens = Object.entries(request.files || {})
                                .filter(([key]) => key.startsWith('uploadImagens'))
                                .map(([, file]) => file);
                            if (novasImagens && novasImagens.length > 0) {
                                for (const imagem of novasImagens) {
                                    const filename = imagem.name.replace(/\s/g, '_');
                                    const gcsPath = `organizacao/${record.id()}-${filename}`;
                                    await models.OrganizacaoImagem.create({
                                        organizacao_id: record.id(),
                                        imagem_url: gcsPath,
                                    });
                                }
                            }
                            return response;
                        }
                    },

                    list: {
                        after: async (response) => {
                            const recordIds = response.records.map(r => r.params.id);
                            if (recordIds.length === 0) return response;

                            const imagens = await models.OrganizacaoImagem.findAll({
                                where: { organizacao_id: { [Op.in]: recordIds } }
                            });

                            const imagensMap = imagens.reduce((acc, img) => {
                                const id = img.organizacao_id;
                                if (!acc[id]) { acc[id] = []; }
                                acc[id].push(img.imagem_url);
                                return acc;
                            }, {});

                            for (const record of response.records) {
                                const id = record.params.id;
                                if (imagensMap[id]) {
                                    record.params.imagem_url = imagensMap[id];
                                }
                            }
                            return response;
                        }
                    },

                    delete: {
                        after: async (response, request, context) => {
                            const { record } = context;
                            await models.OrganizacaoImagem.destroy({ where: { organizacao_id: record.id() } });
                            return response;
                        }
                    },
                }
            },
        },
        {
            resource: models.Parceiro,
            features: [
                createUploadFeature({
                    folder: 'parceiros',
                    file: 'uploadImagem',
                    key: 'url_imagem',
                }),
            ],
            options: {
                navigation: adminNavigation.inicio,
                properties: {
                    ...createImageUploadProperties()
                },
            }
        },

        {
            resource: models.LinhaDoTempo,
            features: [
                createUploadFeature({
                    folder: 'linha_do_tempos',
                    file: 'uploadImagens',
                    key: 'url_imagem',
                    multiple: true,
                }),
            ],
            options: {
                navigation: adminNavigation.institucional,

                // Definimos explicitamente os campos para cada ação
                newProperties: ['titulo', 'ano', 'conteudo', 'uploadImagens'],
                editProperties: ['titulo', 'ano', 'conteudo', 'uploadImagens'],

                listProperties: ['id', 'url_imagem', 'titulo', 'conteudo', 'ano'],
                showProperties: ['id', 'titulo', 'ano', 'conteudo', 'url_imagem'],
                filterProperties: ['titulo', 'ano'],

                properties: {
                    titulo: { isTitle: true },
                    // conteudo: { type: 'richtext' },
                    conteudo: {
                        // type: 'richtext',
                        components: {
                            edit: Components.EditorLinhaTempo, // 👈 apontando para seu componente
                        }
                    },
                    ano: { type: 'number' },

                    // Propriedade de upload, agora com configuração de componente por ação
                    uploadImagens: {
                        label: 'Imagens',
                        components: {
                            // Ao EDITAR, usamos nosso componente customizado.
                            edit: Components.ImageEditor,
                            list: Components.NoticiaPreview,
                            // Para a ação de NEW (criar), não especificamos nada.
                            // Isso faz com que o AdminJS use o componente PADRÃO 
                            // fornecido pelo createUploadFeature, que é exatamente o que queremos.
                        },
                    },

                    imagesToDelete: { isVisible: false },

                    url_imagem: {
                        isVisible: { list: true, show: true, edit: false, filter: false },
                        components: {
                            list: Components.ImageListPreview,
                            show: Components.ImageListPreview,
                        }
                    }
                },
                actions: {
                    new: {
                        after: async (response, request, context) => {
                            const { record } = context;
                            if (!record || !record.isValid()) { return response; }

                            const novasImagens = Object.entries(request.files || {})
                                .filter(([key]) => key.startsWith('uploadImagens'))
                                .map(([, file]) => file);

                            if (novasImagens && novasImagens.length > 0) {
                                for (const imagem of novasImagens) {
                                    // ================================================================
                                    // ▼▼▼ LÓGICA FINAL E CORRETA DE CONSTRUÇÃO DE PATH ▼▼▼
                                    // ================================================================
                                    // Recriamos o caminho do GCP, pois sabemos como ele é formado.
                                    // Isso não depende de 'key' ou 'path' e é muito mais robusto.
                                    const filename = imagem.name.replace(/\s/g, '_');
                                    const gcsPath = `linha_do_tempos/${record.id()}-${filename}`;
                                    // ================================================================

                                    await models.LinhaDoTempoImagem.create({
                                        linha_do_tempo_id: record.id(),
                                        url_imagem: gcsPath,
                                    });
                                    console.log(`✅ Registro no BD criado para o caminho construído: ${gcsPath}`);
                                }
                            }
                            return response;
                        }
                    },
                    list: {
                        after: async (response) => {
                            // 1. Pega os IDs apenas dos registros que estão na página atual.
                            const recordIds = response.records.map(r => r.params.id);

                            // 2. Se não houver registros na página, não há o que fazer.
                            if (recordIds.length === 0) {
                                return response;
                            }

                            // 3. Busca no banco de dados APENAS as imagens relacionadas aos IDs da página.
                            const imagens = await models.LinhaDoTempoImagem.findAll({
                                where: {
                                    linha_do_tempo_id: { [Op.in]: recordIds }
                                }
                            });

                            // 4. O resto da sua lógica para agrupar as imagens permanece a mesma.
                            const imagensMap = imagens.reduce((acc, img) => {
                                const id = img.linha_do_tempo_id;
                                if (!acc[id]) { acc[id] = []; }
                                acc[id].push(img.url_imagem);
                                return acc;
                            }, {});

                            for (const record of response.records) {
                                const id = record.params.id;
                                if (imagensMap[id]) {
                                    record.params.url_imagem = imagensMap[id];
                                }
                            }

                            return response;
                        }
                    },
                    edit: {
                        before: async (request, context) => {
                            const { record } = context;
                            if (record && record.id()) {
                                const imagens = await models.LinhaDoTempoImagem.findAll({
                                    where: { linha_do_tempo_id: record.id() },
                                    raw: true,
                                });
                                // O hook before continua populando `record.params.imagens`
                                // para o nosso componente ler as imagens existentes.
                                record.params.imagens = imagens;
                            }
                            return request;
                        },
                        after: async (response, request, context) => {
                            const { record } = context;
                            const { payload } = request;

                            // 1. Lidar com a exclusão (Esta lógica já funciona)
                            const idsParaDeletar = Object.keys(payload)
                                .filter(key => key.startsWith('imagesToDelete.'))
                                .map(key => payload[key]);

                            if (idsParaDeletar && idsParaDeletar.length > 0) {
                                await models.LinhaDoTempoImagem.destroy({
                                    where: { id: { [Op.in]: idsParaDeletar } }
                                });
                            }

                            // 2. Lidar com o upload (Esta lógica voltará a funcionar)
                            // `request.files` será populado novamente pelo UploadFeature
                            const novasImagens = Object.entries(request.files || {})
                                .filter(([key]) => key.startsWith('uploadImagens'))
                                .map(([, file]) => file);

                            if (novasImagens && novasImagens.length > 0) {
                                for (const imagem of novasImagens) {
                                    const filename = imagem?.name?.replace(/\s+/g, '_');
                                    const gcsPath = `linha_do_tempos/${record.id()}-${filename}`;
                                    await models.LinhaDoTempoImagem.create({
                                        linha_do_tempo_id: record.id(),
                                        url_imagem: gcsPath,
                                    });
                                }
                            }
                            return response;
                        }
                    },
                    delete: {
                        after: async (response, request, context) => {
                            // Quando um item da linha do tempo é deletado,
                            // devemos deletar também todas as imagens associadas.
                            const { record } = context;

                            await models.LinhaDoTempoImagem.destroy({
                                where: { linha_do_tempo_id: record.id() }
                            });

                            // Aqui também deveria deletar os arquivos do storage.

                            return response;
                        }
                    },
                }
            }
        },
        {
            resource: models.CardInformativo,
            features: [
                createUploadFeature({
                    folder: 'cards',
                    file: 'uploadImagem',
                    key: 'url_imagem',
                }),
            ],
            options: {
                navigation: adminNavigation.institucional,
                id: 'CardInformativo',
                properties: {
                    ...createImageUploadProperties()

                },
                editProperties: [
                    'titulo',
                    'descricao',
                    'tipo',
                    'uploadImagem' // usado para enviar imagem
                ],
                showProperties: [
                    'titulo',
                    'descricao',
                    'tipo',
                    'url_imagem'
                ],
                listProperties: [
                    'titulo',
                    'descricao',
                    'tipo',
                    'url_imagem'
                ]
            }
        },
        {
            resource: models.Lideranca,
            features: [
                // Seu helper continua INTACTO, como solicitado.
                createUploadFeature({
                    folder: 'colaboradores',
                    file: 'uploadImagem',
                    key: 'url_imagem',
                }),
            ],
            options: {
                navigation: adminNavigation.institucional,
                id: 'Lideranca',

                properties: {
                    // Mantemos suas propriedades como estavam na última tentativa
                    nome: { isTitle: true },
                    cargo: { type: 'textarea' },
                    email: { type: 'string' },
                    areaDeAtuacao: areaDeAtuacaoProperty,
                    area_ids: { isVisible: false },
                    uploadImagem: {
                        label: 'Imagem do Colaborador',
                        isVisible: { new: true, edit: true, list: false, show: false, filter: false },
                    },
                    url_imagem: {
                        label: 'Imagem Atual',
                        isVisible: { list: true, show: true, new: false, edit: false, filter: false },
                        components: {
                            list: Components.ImageListPreview,
                            show: Components.ImageListPreview,
                        }
                    },
                },

                newProperties: ['nome', 'cargo', 'email', 'areaDeAtuacao', 'uploadImagem'],
                editProperties: ['nome', 'cargo', 'email', 'areaDeAtuacao', 'uploadImagem'],
                showProperties: ['nome', 'cargo', 'email', 'areaDeAtuacao', 'url_imagem'],
                listProperties: ['nome', 'cargo', 'email', 'areaDeAtuacao', 'url_imagem'],
                actions: {
                    edit: {
                        before: async (request, context) => {
                            const { record, _admin, resource } = context; // Adicionamos 'resource' ao contexto
                            const { payload } = request;

                            const oldImagePath = record.params.url_imagem;
                            const newUploadData = payload.uploadImagem;

                            // Condição robusta que já funciona:
                            if (oldImagePath && !newUploadData) {
                                console.log("✔️ DETECTADO: Intenção de remover imagem existente.");

                                // 1. Deleta o arquivo antigo do GCP
                                try {
                                    // ================================================================
                                    // ▼▼▼ CORREÇÃO DEFINITIVA AQUI ▼▼▼
                                    // ================================================================
                                    // Buscamos na lista de features globais aquela que pertence a este recurso
                                    // E que está configurada para a propriedade 'uploadImagem'.
                                    const feature = _admin.features.find(f =>
                                        f.resource.id() === resource.id() &&
                                        f.options.properties.file === 'uploadImagem'
                                    );
                                    // ================================================================

                                    if (feature) {
                                        const provider = feature.provider;
                                        await provider.delete(oldImagePath, provider.bucket);
                                        console.log(`✅ Arquivo deletado do GCP: ${oldImagePath}`);
                                    } else {
                                        console.warn("⚠️  Feature de upload não encontrado para a propriedade 'uploadImagem'. O arquivo não será deletado do GCP.");
                                    }

                                } catch (e) {
                                    console.error('❌ Erro ao tentar deletar o arquivo do GCP:', e);
                                }

                                // 2. Define o campo no banco como nulo (já está funcionando)
                                payload.url_imagem = null;
                                console.log("✅ Campo 'url_imagem' definido como NULL para atualização no banco.");
                            }

                            return request;
                        },
                    },
                }
            }
        },
        {
            resource: models.Transparencia,
            options: {
                navigation: adminNavigation.institucional,
                id: 'Transparencia',
                properties: {
                    areaDeAtuacao: areaDeAtuacaoProperty,
                    area_ids: {
                        isVisible: false
                    },
                    ...createImageUploadProperties()

                },
                editProperties: [
                    'titulo',
                    'areaDeAtuacao',
                    'documento_url',
                    'uploadImagem' // usado para enviar imagem
                ],
                showProperties: [
                    'titulo',
                    'documento_url',
                    'documento_url',
                    'url_imagem'
                ],
                listProperties: [
                    'titulo',
                    'documento_url',
                    'areaDeAtuacao',
                    'url_imagem'
                ]
            },
            features: [
                createUploadFeature({
                    folder: 'transparencia',
                    file: 'uploadImagem',
                    key: 'url_imagem',
                }),
            ],
        },
        {
            resource: models.PerguntaFrequente,
            options: {
                navigation: adminNavigation.institucional,
                properties: {
                    pergunta:  { type: 'textarea' },
                    resposta: { type: 'textarea' },
                },
                listProperties: [
                    'pergunta',
                    'resposta'
                ],
                showProperties: [
                    'pergunta',
                    'resposta'
                ],
                editProperties: [
                    'pergunta',
                    'resposta'
                ]
            }
        },
        {
            resource: models.Oportunidade,
            options: {
                navigation: adminNavigation.institucional,
                id: 'Oportunidade',
                properties: {
                    titulo: {
                        isVisible: { list: true, edit: false, show: true }, // para esconder o campo padrão
                    },
                    descricao: {
                        components: {
                            edit: Components.OportunidadeEditor,
                            list: Components.NoticiaPreview, // novo componente para a listagem

                        }
                    },
                },
                listProperties: [
                    'titulo',
                    'descricao'
                ]
            }

        },
        {
            resource: models.Programa,
            features: [
                createUploadFeature({
                    folder: 'programa',
                    file: 'uploadCapa',
                    key: 'url_image_capa',
                    filePath: 'filePathCapa',
                    filesToDelete: 'filesToDeleteCapa',
                }),
                createUploadFeature({
                    folder: 'programa',
                    file: 'uploadImagens',
                    key: 'url_imagem',
                    filePath: 'filePathImagens',
                    filesToDelete: 'filesToDeleteImagens',
                    multiple: true,

                }),

            ],
            options: {
                navigation: adminNavigation.programas,

                newProperties: ['titulo', 'subtitulo', 'resumo', 'descricao', 'areaDeAtuacao', 'uploadCapa', 'uploadImagens', 'is_ativo'],
                editProperties: ['titulo', 'subtitulo', 'resumo', 'descricao', 'areaDeAtuacao', 'uploadCapa', 'uploadImagens', 'is_ativo'],

                listProperties: ['titulo', 'url_image_capa', 'url_imagem', 'is_ativo'],
                showProperties: ['titulo', 'subtitulo', 'resumo', 'descricao', 'areaDeAtuacao', 'url_image_capa', 'url_imagem', 'is_ativo'],
                filterProperties: ['titulo', 'subtitulo', 'is_ativo'],

                properties: {
                    titulo: { isTitle: true },
                    subtitulo: { type: 'textarea' },
                    resumo: { type: 'textarea' },
                    descricao: { type: 'richtext', components: { edit: Components.ProgramaEditor, list: Components.NoticiaPreview } },
                    is_ativo: { isTitle: false, components: { edit: Components.ToggleAtivo } },

                    area_ids: { isVisible: false },
                    areaDeAtuacao: areaDeAtuacaoProperty,

                    uploadCapa: {
                        label: 'Imagem de Capa (single)',
                        type: 'file',
                        isArray: false,
                    },
                    url_image_capa: {
                        components: { list: Components.ImageListPreview, show: Components.ImageListPreview }
                    },

                    // Lógica para as MÚLTIPLAS IMAGENS
                    uploadImagens: {
                        label: 'Imagens do Programa (múltiplas)',
                        components: {
                            edit: Components.ImageEditor,
                        },
                    },
                    imagesToDelete: { isVisible: false },
                    url_imagem: {
                        label: 'Imagens Adicionais',
                        components: { list: Components.ImageListPreview, show: Components.ImageListPreview }
                    },
                },

                // As actions que definimos na mensagem anterior estão corretas e não precisam mudar.
                // Elas já foram desenhadas para funcionar com esta configuração.
                actions: {
                    new: {
                        after: async (response, request, context) => {
                            const { record } = context;
                            if (!record || !record.isValid()) { return response; }

                            const novasImagens = Object.entries(request.files || {})
                                .filter(([key]) => key.startsWith('uploadImagens'))
                                .map(([, file]) => file);

                            if (novasImagens && novasImagens.length > 0) {
                                for (const imagem of novasImagens) {
                                    const filename = imagem.name.replace(/\s/g, '_');
                                    const gcsPath = `programa/${record.id()}-${filename}`;

                                    await models.ProgramaImagens.create({
                                        programa_id: record.id(),
                                        url_imagem: gcsPath,
                                    });
                                }
                            }
                            return response;
                        }
                    },

                    edit: {
                        before: async (request, context) => {
                            const { record } = context;
                            if (record && record.id()) {
                                const imagens = await models.ProgramaImagens.findAll({
                                    where: { programa_id: record.id() },
                                    raw: true,
                                });
                                record.params.imagens = imagens;
                            }
                            return request;
                        },
                        after: async (response, request, context) => {
                            const { record } = context;
                            const { payload } = request;

                            const idsParaDeletar = Object.keys(payload)
                                .filter(key => key.startsWith('imagesToDelete.'))
                                .map(key => payload[key]);
                            if (idsParaDeletar && idsParaDeletar.length > 0) {
                                await models.ProgramaImagens.destroy({ where: { id: { [Op.in]: idsParaDeletar } } });
                            }

                            const novasImagens = Object.entries(request.files || {})
                                .filter(([key]) => key.startsWith('uploadImagens'))
                                .map(([, file]) => file);
                            if (novasImagens && novasImagens.length > 0) {
                                for (const imagem of novasImagens) {
                                    const filename = imagem.name.replace(/\s/g, '_');
                                    const gcsPath = `programa/${record.id()}-${filename}`;
                                    await models.ProgramaImagens.create({
                                        programa_id: record.id(),
                                        url_imagem: gcsPath,
                                    });
                                }
                            }
                            return response;
                        }
                    },
                    // Dentro do seu bloco 'actions'
                    list: {
                        after: async (response) => {
                            // ▼▼▼ CORREÇÃO APLICADA AQUI ▼▼▼
                            const todosIds = response.records.map(r => r.params.id);
                            // ▲▲▲ FIM DA CORREÇÃO ▲▲▲

                            const imagens = await models.ProgramaImagens.findAll({ where: { programa_id: { [Op.in]: todosIds } } });

                            const imagensMap = imagens.reduce((acc, img) => {
                                const id = img.programa_id;
                                if (!acc[id]) { acc[id] = []; }
                                acc[id].push(img.url_imagem);
                                return acc;
                            }, {});

                            for (const record of response.records) {
                                const id = record.params.id;
                                if (imagensMap[id]) {
                                    record.params.url_imagem = imagensMap[id];
                                }
                            }
                            return response;
                        }
                    },
                    delete: {
                        after: async (response, request, context) => {
                            const { record } = context;
                            await models.ProgramaImagens.destroy({ where: { programa_id: record.id() } });
                            return response;
                        }
                    },
                }
            },
        },

        {
            resource: models.DadosBancario,
            options: {
                navigation: adminNavigation.configuracoes,
                id: 'DadosBancario',
                properties: {
                    ...createImageUploadProperties()
                },
                editProperties: [
                    'titular_conta',
                    'agencia',
                    'banco',
                    'chave_pix',
                    'uploadImagem' // usado para enviar imagem
                ],
                showProperties: [
                    'titular_conta',
                    'agencia',
                    'banco',
                    'chave_pix',
                    'url_imagem'
                ]
            },
            features: [
                createUploadFeature({
                    folder: 'dados_bancarios',
                    file: 'uploadImagem',
                    key: 'url_imagem',
                }),
            ],

        },
        { resource: models.Email, options: { navigation: adminNavigation.configuracoes, id: 'Email' } },
        {
            resource: models.Indicador,
            options: {
                navigation: adminNavigation.inicio,
                id: 'Indicador',
                editProperties: [
                    'quantidade',
                    'descricao',
                ],
                showProperties: [
                    'quantidade',
                    'descricao',
                ],
                listProperties: [
                    'quantidade',
                    'descricao',
                ]
            }
        },
        {
            resource: models.Capa,
            features: [
                createUploadFeature({
                    folder: 'banners',
                    file: 'uploadImagens',
                    key: 'url_img',
                }),
            ],
            options: {
                navigation: adminNavigation.configuracoes,
                id: 'Capa',
                properties: {
                    uploadImagem: {
                        type: 'file',
                        isVisible: { edit: true, list: false, show: false, filter: false },
                        isArray: false, // 👈 isso força o AdminJS a usar `uploadImagem` ao invés de `uploadImagem.0`
                    },
                    url_img: {
                        isVisible: { list: true, show: false, edit: false },
                        components: {
                            list: Components.ImageListPreview
                        }
                    },
                    titulo: {
                        components: {
                            edit: Components.CapaTituloEditor,
                            list: Components.NoticiaPreview,
                        }
                    }
                },
                editProperties: [
                    'titulo',
                    'pagina',
                    'uploadImagens' // usado para enviar imagem
                ],
                showProperties: [
                    'titulo',
                    'pagina',
                    'url_img'
                ],
                listProperties: [
                    'titulo',
                    'pagina',
                    'url_img'
                ],

            }
        },
        {
            resource: models.ConteudoSecao,
            options: {
                id: 'ConteudoSecao', // 👈 define o ID esperado para tradução
                navigation: adminNavigation.configuracoes,
                editProperties: [
                    'titulo',
                    'resumo'
                ]
            },
        },
        { resource: models.Rodape, options: { navigation: adminNavigation.inicio, id: 'Rodape' } },
        {
            resource: models.Publicacao,
            features: [
                createUploadFeature({
                    folder: 'parceiros',
                    file: 'uploadImagem',
                    key: 'url_imagem',
                }),
            ],
            options: {
                navigation: adminNavigation.informeSe,
                properties: {
                    areaDeAtuacao: areaDeAtuacaoProperty,
                    area_ids: {
                        isVisible: false
                    },
                    ...createImageUploadProperties()

                },

                editProperties: [
                    'titulo',
                    'documento_url',
                    'areaDeAtuacao',
                    'uploadImagem' // usado para enviar imagem
                ],
                showProperties: [
                    'titulo',
                    'documento_url',
                    'areaDeAtuacao',
                    'url_imagem'
                ],
                listProperties: [
                    'titulo',
                    'documento_url',
                    'areaDeAtuacao',
                    'url_imagem'
                ]

            },
        },
        {
            resource: models.Noticia,
            features: [
                createUploadFeature({
                    folder: 'noticias',
                    file: 'uploadCapa',
                    key: 'imagem_capa',
                    filePath: 'capa_filePath',
                    filesToDelete: 'capa_filesToDelete',
                    multiple: false,
                }),
            ],
            options: {
                navigation: adminNavigation.informeSe,
                id: 'Noticia',
                actions: {
                    new: {
                        before: async (request) => {
                            if (request.payload?.html_original) {
                                const rawHtml = request.payload.html_original;

                                // Remove tags HTML e extrai só o texto
                                const plainText = rawHtml.replace(/<[^>]*>/g, ' ');
                                const tempoLeituraMin = Math.ceil(readingTime(plainText).minutes);

                                request.payload.tempo_leitura = tempoLeituraMin;
                            }
                            return request;
                        }
                    },
                    edit: {
                        before: async (request) => {
                            if (request.payload?.html_original) {
                                const rawHtml = request.payload.html_original;

                                const plainText = rawHtml.replace(/<[^>]*>/g, ' ');
                                const tempoLeituraMin = Math.ceil(readingTime(plainText).minutes);

                                request.payload.tempo_leitura = tempoLeituraMin;
                            }
                            return request;
                        }
                    }
                },
                properties: {
                    html_original: {
                        label: 'Conteúdo da notícia',
                        components: {
                            edit: Components.ConteudoEditor,
                            list: Components.NoticiaPreview,
                            show: Components.NoticiaShow,
                        },
                        isVisible: { list: true, edit: true, filter: false, show: true },
                    },
                    areaDeAtuacao: {
                        ...areaDeAtuacaoProperty,
                        components: {
                            ...areaDeAtuacaoProperty.components,
                            show: Components.NoticiaAreaShow,
                        },
                    },
                    conteudo: {
                        isVisible: false
                    },
                    area_ids: {
                        isVisible: false
                    },

                    uploadCapa: {
                        type: 'file',
                        isVisible: { edit: true, list: false, show: false, filter: false },
                        isArray: false, // 👈 isso força o AdminJS a usar `uploadImagem` ao invés de `uploadImagem.0`
                    },

                    imagem_capa: {
                        label: 'Imagem de capa',
                        isVisible: { list: true, show: true, edit: false },
                        components: {
                            list: Components.ImageListPreview,
                            show: Components.NoticiaCoverShow,
                        },
                    },
                    titulo: {
                        label: 'Título',
                        isVisible: { list: false, show: true, edit: false, filter: false }
                    },
                    data_publicacao: {
                        label: 'Data de publicação',
                        isVisible: { list: false, show: true, edit: false, filter: false }
                    },
                    tempo_leitura: {
                        label: 'Tempo de leitura (minutos)'
                    },
                    autor: {
                        label: 'Autor'
                    },
                    tipo: {
                        isVisible: false
                    }

                },
                editProperties: ['html_original', 'areaDeAtuacao', 'autor', 'uploadCapa'],
                showProperties: ['titulo', 'data_publicacao', 'areaDeAtuacao', 'tempo_leitura', 'imagem_capa', 'autor', 'html_original']


            }
        },
    ],
    rootPath: '/admin',



    branding: {
        companyName: 'CDC',
        logo: '/admin/assets/logo_cdc_atualizada.svg',
        theme: {
            colors: {
                // Light Mode (default)
                primary100: '#a7181d',  // Vermelho principal
                primary80: '#c62828',
                primary60: '#e53935',
                primary20: '#ffcdd2',
                primary0: '#fff5e6',    // Fundo paper light
                accent: '#fe9a03',      // Laranja secundário
                hoverBg: '#cb7a01',     // Laranja escuro (hover)
                filterBg: '#f3f2ed',    // Fundo default light
                // Dark Mode (se necessário)
                darkBg: '#000',         // Fundo dark
                darkPaper: '#121212',   // Paper dark
                darkText: '#ffffff',    // Texto dark
            },
            fonts: {
                fontFamily: 'Lato, "Source Sans Pro", sans-serif', // Sua fonte principal
                fontSize: '16px',       // Tamanho base
            }
        }
    },
    locale: {
        language: 'pt-BR',
        withBackend: false,
        availableLanguages: ['en', 'pt-BR'],
        localeDetection: true,
        translations: {
            'pt-BR': {
                pages: {
                    googleAccess: 'Acesso Google',
                },
                labels: {
                    loginWelcome: 'Bem-vindo ao Painel',
                    Colaborador: 'Colaboradores',
                    ConteudoSecao: 'Títulos e resumos',
                    DadosBancario: 'Doe agora (dados)',
                    Email: 'E-mails (vagas/contato)',
                    Area: 'Áreas',
                    Organizacao: 'Apresentação',
                    Rodape: 'Rodapé',
                    Noticia: 'Notícias',
                    Publicacao: 'Publicação',
                    Lideranca: 'Lideranças',
                    Transparencia: 'Transparência',
                    Capa: 'Banners',
                    Indicador: 'Indicadores',
                    Oportunidade: 'Trabalhe conosco',
                    CardInformativo: 'Estrutura Organizacional'
                },
                messages: {
                    loginWelcome: 'Seja bem-vindo! Por favor, entre para continuar.',
                    successfullyBulkDeleted: 'Registros excluídos com sucesso',
                    successfullyDeleted: 'Registro excluído com sucesso',
                    successfullyUpdated: 'Registro atualizado com sucesso',
                    successfullyCreated: 'Registro criado com sucesso',
                    thereWereValidationErrors: 'Existem erros de validação - por favor, verifique!',
                    forbiddenError: 'Você não tem permissão para executar esta ação',
                    anyForbiddenError: 'Você não tem permissão para realizar esta ação',
                    errorFetchingRecords: 'Erro ao buscar registros',
                    errorFetchingRecord: 'Erro ao buscar o registro',
                    noRecordsSelected: 'Nenhum registro selecionado',
                    theseRecordsWillBeRemoved: 'Os seguintes registros serão removidos:',
                    theseRecordsWillBeUpdated: 'Os seguintes registros serão atualizados:',
                    uploadDrop: 'Solte o arquivo aqui ou clique para escolher',
                    uploadMaxSize: 'Tamanho máximo: 5MB',
                    uploadAcceptedFormats: 'Formatos aceitos: PNG, JPG, JPEG, WEBP',
                },
                buttons: {
                    save: 'Salvar',
                    addNewItem: 'Adicionar novo item',
                    filter: 'Filtrar',
                    applyChanges: 'Aplicar alterações',
                    resetFilter: 'Limpar filtros',
                    confirmRemovalMany: 'Confirmar exclusão de vários',
                    confirmRemovalOne: 'Confirmar exclusão',
                    logout: 'Sair',
                    login: 'Entrar',
                    submit: 'Enviar',
                    addNewProperty: 'Adicionar nova propriedade',
                    Dashboard: "Inicio",

                },
                properties: {
                    areaDeAtuacao: 'Área de Atuação',
                    titulo: 'Título',
                    data_publicacao: 'Data de publicação',
                    tempo_leitura: 'Tempo de leitura (minutos)',
                    imagem_capa: 'Imagem de capa',
                    html_original: 'Conteúdo da notícia',
                    autor: 'Autor',
                    url_imagem: 'URL da Imagem',
                    cargo: 'Cargo',
                    nome: 'Nome',
                    email: 'E-mail',
                },
                actions: {
                    new: 'Criar Novo',
                    edit: 'Editar',
                    show: 'Exibir',
                    delete: 'Excluir',
                    bulkDelete: 'Excluir selecionados',
                    list: 'Lista',
                    Dashboard: "Inicio",
                },
                resources: {
                    ConteudoSecao: {
                        properties: {
                            // this will override the name only for Comment resource.
                            name: 'Tytuł',
                        },
                    }
                },
            }
        },
    },
    componentLoader,
});

export const adminRouter = AdminJSExpress.buildRouter(adminJs)
