import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { DataBaseModel } from '../model/DatabaseModel';
import bcrypt from 'bcrypt';

// Palavra secreta para JWT
const SECRET = 'bananinha';

// Pool de conexão com o banco
const database = new DataBaseModel().pool;

// Interface opcional para Payload do JWT
interface JwtPayload {
    id: number;
    nome: string;
    username: string;
    exp: number;
}

export class Auth {

    /**
     * Validação de login do usuário
     */
    static async validacaoUsuario(req: Request, res: Response): Promise<any> {
        const { username, senha } = req.body;

        const querySelectUser = `
            SELECT id_usuario, uuid, nome, email, senha, username 
            FROM usuario 
            WHERE LOWER(username) = LOWER($1) AND status_usuario = TRUE;
        `;

        try {
            const queryResult = await database.query(querySelectUser, [username]);

            if (queryResult.rowCount === 0) {
                return res.status(401).json({ auth: false, token: null, message: "Usuário e/ou senha incorretos" });
            }

            const usuarioBanco = queryResult.rows[0];

            // Comparar senha com hash bcrypt
            const senhaValida = await bcrypt.compare(senha, usuarioBanco.senha);
            if (!senhaValida) {
                return res.status(401).json({ auth: false, token: null, message: "Usuário e/ou senha incorretos" });
            }

            // Preparar usuário para resposta
            const usuario = {
                uuid: usuarioBanco.uuid,
                nome: usuarioBanco.nome,
                email: usuarioBanco.email,
                username: usuarioBanco.username
            };

            // Gerar token JWT usando id_usuario
            const tokenUsuario = Auth.generateToken(
                usuarioBanco.id_usuario,
                usuarioBanco.nome,
                usuarioBanco.username
            );

            return res.status(200).json({ auth: true, token: tokenUsuario, usuario });

        } catch (error) {
            console.error(`Erro no login: ${error}`);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    /**
     * Gera token JWT
     */
    static generateToken(id: number, nome: string, username: string) {
        return jwt.sign({ id, nome, username }, SECRET, { expiresIn: '1h' });
    }

    /**
     * Middleware para verificar token JWT
     */
    static verifyToken(req: Request, res: Response, next: NextFunction) {
        const token = req.headers['x-access-token'] as string;

        if (!token) {
            return res.status(401).json({ message: "Token não informado", auth: false });
        }

        jwt.verify(token, SECRET, (err, decoded) => {
            if (err) {
                const msg = err.name === 'TokenExpiredError'
                    ? "Token expirado, faça o login novamente"
                    : "Token inválido, faça o login";
                return res.status(401).json({ message: msg, auth: false });
            }

            const { exp, id } = decoded as JwtPayload;
            const currentTime = Math.floor(Date.now() / 1000);

            if (!exp || !id || currentTime > exp) {
                return res.status(401).json({ message: "Token inválido ou expirado", auth: false });
            }

            req.body.userId = id;
            next();
        });
    }

    /**
     * Atualiza todas as senhas antigas para bcrypt
     */
    static async atualizarSenhasComBcrypt(req: Request, res: Response): Promise<any> {
        const querySelect = `SELECT id_usuario, senha FROM usuario WHERE status_usuario = TRUE;`;
        const queryUpdate = `UPDATE usuario SET senha = $1 WHERE id_usuario = $2;`;

        try {
            const { rows } = await database.query(querySelect);
            let atualizadas = 0;

            for (const usuario of rows) {
                if (!usuario.senha.startsWith("$2b$") && !usuario.senha.startsWith("$2a$")) {
                    const senhaCriptografada = await bcrypt.hash(usuario.senha, 10);
                    await database.query(queryUpdate, [senhaCriptografada, usuario.id_usuario]);
                    atualizadas++;
                }
            }

            return res.status(200).json({
                message: "Senhas atualizadas com sucesso para bcrypt",
                totalAtualizadas: atualizadas
            });

        } catch (error) {
            console.error("Erro ao atualizar senhas:", error);
            return res.status(500).json({ message: "Erro ao atualizar senhas no banco de dados." });
        }
    }
}
