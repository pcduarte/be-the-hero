const connection = require('../database/connection');

module.exports = {
    //Listando todas os Incidentes
    async index(request, response) {
        const { page = 1 } = request.query; //Recurso para paginação

        const [count] = await connection('incidents') //como isso retorna um array foi colocado em colchetes para trazer só o primeiro
            .count();

        console.log(count);

        const incidents = await connection('incidents')
            .join('ongs', 'ongs.id', '=', 'incidents.ong_id')
            .limit(5) //limitando a 5 Registros por Página
            .offset((page - 1) * 5) //Esquema de Paginação
            .select([
                'incidents.*',
                'ongs.name',
                'ongs.email',
                'ongs.whatsapp',
                'ongs.city',
                'ongs.uf'
            ]);

        response.header('X-Total-Count', count['count(*)']); //O nome X-Total-Count é uma convensão mais pode nomear diferente que funciona

        return response.json(incidents);
    },
    //Criando Incidents
    async create(request, response) {
        const { title, description, value } = request.body;

        //Pegando o Id. da Ong Logada para informar qual Ong está inserindo o Registro de Incident
        const ong_id = request.headers.authorization;

        //Executando o Insert e retornado o Id resultado
        const [id] = await connection('incidents').insert({
            title,
            description,
            value,
            ong_id,
        });

        return response.json({ id })
    },

    async delete(request, response) {
        const { id } = request.params;
        const ong_id = request.headers.authorization;

        const incident = await connection('incidents')
            .where('id', id) //Filtrando pelo Parametro Id.
            .select('ong_id') //Selecionando somente a coluna ong_id
            .first(); //Como vai retornar somente um registro usa-se o First tipo um Top 1

        //Verificando se Id. Ong Logada é igual a retornada, senão apresenta o ERRO
        if (incident.ong_id != ong_id) {
            return response.status(401).json({ error: 'Operation not permitted.' });//forçando retorno de Erro com o Status Code 401
        }

        await connection('incidents').where('id', id).delete(); //deletando o registro

        return response.status(204).send();//Retorna resposta sem retornar nenhum conteúdo, o corpo Vazio
    }
}