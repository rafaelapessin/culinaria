// controllers/controllerIndex.js

const db = require('../db'); // importa o mock de dados

// objeto para dados globais de navegação 
const navData = (activeLink = '') => ({
    links: [
        { href: '/', text: 'Sistema de Receitas', active: activeLink === '/' },
        { href: '/sobre', text: 'Sobre', active: activeLink === '/sobre' },
        { href: '/nova', text: 'Nova Receita', active: activeLink === '/nova' },
        { href: '/pesquisar', text: 'Pesquisar Receita', active: activeLink === '/pesquisar' }
    ]
});

// tela Principal (Listagem)
exports.index = (req, res, next) => {
    const receitas = db.getAll();
    const titulo = "Sistema de Receitas - Principal";
    
    // se não houver registros, exibe mensagem
    const semReceitas = receitas.length === 0;

    res.render('index', { 
        titulo_pagina: titulo, 
        ...navData('/'),
        receitas, 
        semReceitas 
    });
};

// página Sobre
exports.sobre = (req, res, next) => {
    res.render('sobre', {
        titulo_pagina: "Sobre o Sistema de Receitas",
        ...navData('/sobre'),
        info: {
            autor: "Rossini Pena Abrantes",
            data: "Novembro de 2025",
            disciplina: "Desenvolvimento Backend I"
        }
    });
};

// criação de Receita (GET - Formulário)
exports.novaReceitaForm = (req, res, next) => {
    res.render('nova', {
        titulo_pagina: "Nova Receita",
        ...navData('/nova'),
        isEditing: false,
        recipe: {}
    });
};

// criação de Receita (POST - Processamento)
exports.novaReceita = (req, res, next) => {
    const { titulo, ingredientes, modoDePreparo, tempoDePreparo } = req.body;

    // validação de campos obrigatórios
    if (!titulo || !ingredientes || !modoDePreparo || !tempoDePreparo || parseInt(tempoDePreparo) < 1) {
        // renderiza o formulário novamente com a mensagem de erro
        return res.render('nova', {
            titulo_pagina: "Nova Receita",
            ...navData('/nova'),
            errorMessage: 'Todos os campos são obrigatórios e o Tempo de Preparo deve ser no mínimo 1 minuto.',
            recipe: req.body
        });
    }

    db.create({ titulo, ingredientes, modoDePreparo, tempoDePreparo });
    
    // volta para a página principal após a criação
    res.redirect('/');
};

// 4. Consulta de Receita
exports.consultarReceita = (req, res, next) => {
    const id = req.params.id;
    const receita = db.getById(id);

    if (!receita) {
        return next(new Error('Receita não encontrada.'));
    }
    
    // exibe ingredientes e modo de preparo com quebras de linha (<pre>) 
    const receitaComFormatacao = {
        ...receita,
        ingredientes_pre: receita.ingredientes,
        modoDePreparo_pre: receita.modoDePreparo
    };

    res.render('consulta', {
        titulo_pagina: `Consulta: ${receita.titulo}`,
        ...navData(), // nenhum item ativo no menu superior
        receita: receitaComFormatacao
    });
};


// exclusão de Receita (POST - Processamento)
exports.excluirReceita = (req, res, next) => {
    const id = req.params.id;
    db.remove(id);
    
    // volta para a tela principal após a exclusão 
    res.redirect('/');
};

// pesquisa de Receita (GET - Formulário e Resultados)
exports.pesquisarReceita = (req, res, next) => {
    const searchTerm = req.query.q || '';
    let resultados = [];
    let mensagem;

    if (searchTerm) {
        // Pesquisa sem Case Sensitive
        resultados = db.search(searchTerm);
        
        if (resultados.length === 0) {
            mensagem = "Nenhuma receita encontrada com o termo pesquisado."; // Mensagem retornada na pesquisa sem resultados
        }
    } else {
        // Mensagem inicial ao acessar a tela a primeira vez 
        mensagem = "Nenhuma receita a ser exibida no momento."; 
    }

    res.render('pesquisa', {
        titulo_pagina: "Pesquisa de Receitas",
        ...navData('/pesquisar'),
        searchTerm,
        resultados,
        mensagem,
        semResultados: resultados.length === 0 && !searchTerm // Exibir mensagem inicial/sem resultados
    });
};

// alteração de Receita (GET - Formulário)
exports.alterarReceitaForm = (req, res, next) => {
    const id = req.params.id;
    const receita = db.getById(id);

    if (!receita) {
        return next(new Error('Receita não encontrada para alteração.'));
    }

    res.render('nova', {
        titulo_pagina: `Alterar: ${receita.titulo}`,
        ...navData(),
        isEditing: true,
        recipe: receita
    });
};

// alteração de Receita (POST - Processamento)
exports.alterarReceita = (req, res, next) => {
    const id = req.params.id;
    const { titulo, ingredientes, modoDePreparo, tempoDePreparo } = req.body;

    // validação (similar à criação)
    if (!titulo || !ingredientes || !modoDePreparo || !tempoDePreparo || parseInt(tempoDePreparo) < 1) {
        return res.render('nova', {
            titulo_pagina: "Alterar Receita",
            ...navData(),
            isEditing: true,
            errorMessage: 'Todos os campos são obrigatórios e o Tempo de Preparo deve ser no mínimo 1 minuto.',
            recipe: { id, ...req.body } // Garante que o ID e dados antigos voltem
        });
    }

    db.update(id, req.body);
    
    // olta para a página principal após a atualização
    res.redirect('/');
};