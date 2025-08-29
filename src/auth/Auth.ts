// imports
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { DataBaseModel } from '../model/DatabaseModel';
import bcrypt from 'bcrypt';


// palavra secreta
const SECRET = 'bananinha';
// pool de conexão ao banco de dados
const database = new DataBaseModel().pool;

/**
 * Interface para representar um Payload do JWT
 * (Não obrigatório, mas recomendado)
 */
interface JwtPayload {
    id: number;
    nome: string;
    email: string;
    exp: number;
}



/**
 * Gera e trata um token de autenticação para o sistema
 */
export class Auth {

    /**
     * Valida as credenciais do usuário no banco de dados
     * @param req Requisição com as informações do usuário
     * @param res Resposta enviada a quem requisitou o login
     * @returns Token de autenticação caso o usuário seja válido, mensagem de login não autorizado caso negativo
     */
    static async validacaoUsuario(req: Request, res: Response): Promise<any> {
        const { email, senha } = req.body;

        const querySelectUser = `
            SELECT uuid, nome, email, senha, username 
            FROM usuario 
            WHERE LOWER(email) = LOWER($1) AND status_usuario = TRUE;
        `;

        try {
            const queryResult = await database.query(querySelectUser, [email]);

            // Se nenhum usuário foi encontrado
            if (queryResult.rowCount === 0) {
                return res.status(401).json({ auth: false, token: null, message: "Usuário e/ou senha incorretos" });
            }

            const usuarioBanco = queryResult.rows[0];

            // Compara a senha digitada com a senha criptografada no banco
            const senhaValida = await bcrypt.compare(senha, usuarioBanco.senha);

            if (!senhaValida) {
                return res.status(401).json({ auth: false, token: null, message: "Usuário e/ou senha incorretos" });
            }

            const usuario = {
                uuid: usuarioBanco.uuid,
                nome: usuarioBanco.nome,
                email: usuarioBanco.email,
                username: usuarioBanco.username
            };

            const tokenUsuario = Auth.generateToken(parseInt(usuario.uuid), usuario.nome, usuario.username);

            return res.status(200).json({ auth: true, token: tokenUsuario, usuario: usuario });

        } catch (error) {
            console.log(`Erro no modelo: ${error}`);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }



    /**
     * Gera token de validação do usuário
     * 
     * @param id ID do usuário no banco de dados
     * @param nome Nome do usuário no banco de dados
     * @param email Email do usuário no banco de dados
     * @returns Token de autenticação do usuário
     */
    static generateToken(id: number, nome: string, username: string) {
        // retora o token gerado
        // id: ID do professor no banco de dados
        // nome: nome do professor no banco de dados
        // email: email do professor no banco de dados
        // SECRET: palavra secreta
        // expiresIn: tempo até a expiração do token (neste exemplo, 1 hora)
        return jwt.sign({ id, nome, username }, SECRET, { expiresIn: '1h' });
    }

    /**
     * Verifica o token do usuário para saber se ele é válido
     * 
     * @param req Requisição
     * @param res Resposta
     * @param next Próximo middleware
     * @returns Token validado ou erro
     */
    static verifyToken(req: Request, res: Response, next: NextFunction) {
        // recebe no cabeçalho da requisição do cliente o token que ele possui 
        const token = req.headers['x-access-token'] as string;

        // verifica se nenhum token foi informado
        if (!token) {
            console.log('Token não informado');
            // se nenhum token foi informado, é enviada uma mensagem e o status de autenticação (falso)
            return res.status(401).json({ message: "Token não informado", auth: false }).end();
        }

        // verifica se o token recebido é válido
        jwt.verify(token, SECRET, (err, decoded) => {
            if (err) {
                // verifica se o token já expirou
                if (err.name === 'TokenExpiredError') {
                    console.log('Token expirado');
                    // enviada uma mensagem e o status de autenticação (falso)
                    return res.status(401).json({ message: "Token expirado, faça o login novamente", auth: false }).end();
                } else {
                    console.log('Token inválido.');
                    // enviada uma mensagem e o status de autenticação (falso)
                    return res.status(401).json({ message: "Token inválido, faça o login", auth: false }).end();
                }
            }

            // desestrutura o objeto JwtPayload e armazena as informações exp e id em variáveis 
            const { exp, id } = decoded as JwtPayload;

            // verifica se existe data de expiração ou o id no token que foi recebido pelo cliente
            if (!exp || !id) {
                console.log('Data de expiração ou ID não encontrada no token');
                // enviada uma mensagem e o status de autenticação (falso)
                return res.status(401).json({ message: "Token inválido, faça o login", auth: false }).end();
            }

            // verifica se o tempo de validade do token foi expirado
            const currentTime = Math.floor(Date.now() / 1000);
            // valida se o horário atual for maior que o tempo de expiração registrado no token
            if (currentTime > exp) {
                console.log('Token expirado');
                // enviada uma mensagem e o status de autenticação (falso)
                return res.status(401).json({ message: "Token expirado, faça o login novamente", auth: false }).end();
            }

            req.body.userId = id;

            next();
        });
    }

    /**
 * Atualiza todas as senhas dos usuários para bcrypt
 * 
 */
    static async atualizarSenhasComBcrypt(req: Request, res: Response): Promise<any> {
        const querySelect = `SELECT id_usuario, senha FROM usuario WHERE status_usuario = TRUE;`;
        const queryUpdate = `UPDATE usuario SET senha = $1 WHERE id_usuario = $2;`;

        try {
            const { rows } = await database.query(querySelect);

            for (const usuario of rows) {
                // Gera o hash da senha atual
                const senhaCriptografada = await bcrypt.hash(usuario.senha, 10);
                await database.query(queryUpdate, [senhaCriptografada, usuario.id_usuario]);
            }

            return res.status(200).json({ message: "Todas as senhas foram atualizadas com bcrypt com sucesso!" });

        } catch (error) {
            console.error("Erro ao atualizar senhas:", error);
            return res.status(500).json({ message: "Erro ao atualizar senhas no banco de dados." });
        }
    }

}