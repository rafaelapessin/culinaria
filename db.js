let recipes = [
    {
        id: 1,
        titulo: "Bolo de Chocolate",
        ingredientes: "2 xícaras (chá) de farinha de trigo\n1 e meia xícara (chá) de açúcar refinado\n1 xícara (chá) de Chocolate em Pó\n1 colher (sopa) de fermento em pó\nmeia colher (chá) de bicarbonato de sódio\n1 xícara (chá) de óleo\n3 ovos",
        modoDePreparo: "Peneire a farinha de trigo, o açúcar, o Chocolate...\nMisture bem para que os ingredientes...\nAdicione o óleo, os ovos...\nDespeje a massa em uma forma de furo central...\nLeve ao forno médio (180°C).",
        tempoDePreparo: 30
    },
    {
        id: 2,
        titulo: "Pão de Queijo",
        ingredientes: "500g de polvilho doce\n1 copo (250 ml) de leite\n1/2 copo (125 ml) de óleo\n1 colher de chá de sal\n3 ovos\nQueijo parmesão ralado a gosto",
        modoDePreparo: "Ferva o leite, o óleo e o sal. Despeje sobre o polvilho. Misture bem. Adicione os ovos e o queijo. Misture até a massa ficar homogênea. Faça bolinhas e asse.",
        tempoDePreparo: 20
    },
    {
        id: 3,
        titulo: "Pão de Forma",
        ingredientes: "Farinha de trigo\nFermento biológico seco\nAçúcar, Sal e Óleo\nÁgua morna",
        modoDePreparo: "Misturar os secos, adicionar os líquidos. Sovar a massa. Deixar crescer. Assar.",
        tempoDePreparo: 35
    }
];

let nextId = 4;

const db = {
    getAll: () => recipes,
    getById: (id) => recipes.find(r => r.id === parseInt(id)),
    create: (recipe) => {
        recipe.id = nextId++;
        recipe.tempoDePreparo = parseInt(recipe.tempoDePreparo);
        recipes.push(recipe);
    },
    update: (id, updatedRecipe) => {
        let index = recipes.findIndex(r => r.id === parseInt(id));
        if (index !== -1) {
            recipes[index] = { ...updatedRecipe, id: parseInt(id), tempoDePreparo: parseInt(updatedRecipe.tempoDePreparo) };
            return true;
        }
        return false;
    },
    remove: (id) => {
        const initialLength = recipes.length;
        recipes = recipes.filter(r => r.id !== parseInt(id));
        return recipes.length < initialLength;
    },
    search: (term) => {
        const lowerTerm = term.toLowerCase();
        return recipes.filter(r => r.titulo.toLowerCase().includes(lowerTerm));
    }
};

module.exports = db;