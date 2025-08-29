import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Classe que representa o modelo de banco de dados.
 */
export class DataBaseModel {
    
    /**
     * Configuração para conexão com o banco de dados
     */
    private _config: pg.PoolConfig;

    /**
     * Pool de conexões com o banco de dados
     */
    private _pool: pg.Pool;

    /**
     * Construtor da classe DatabaseModel.
     */
    constructor() {
        // Configuração padrão para conexão com o banco de dados
        this._config = {
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            port: Number(process.env.DB_PORT),
            max: 10,
            idleTimeoutMillis: 10000,  // corrigido typo
        };

        // Inicialização do pool de conexões
        this._pool = new pg.Pool(this._config);
    }

    /**
     * Método para testar a conexão com o banco de dados.
     *
     * @returns **true** caso a conexão tenha sido feita, **false** caso negativo
     */
    public async testeConexao(): Promise<boolean> {
        const client = await this._pool.connect();
        try {
            await client.query('SELECT NOW()'); // simples teste de query
            console.log('Database connected!');
            return true;
        } catch (error) {
            console.log('Error connecting to database X(');
            console.log(error);
            return false;
        } finally {
            client.release(); // libera o cliente de volta para o pool
        }
    }

    /**
     * Getter para o pool de conexões.
     */
    public get pool(): pg.Pool {
        return this._pool;
    }
}
