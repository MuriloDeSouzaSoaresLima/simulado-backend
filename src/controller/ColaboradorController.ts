import { Request, Response } from "express";
import { Colaborador } from "../model/Colaborador";

interface ColaboradorDTO {
    nome: string;
    cpf: string;
    cargo: string;
    email: string;
    senha: string;
    perfil: string;
}

export class ColaboradorController {

    /**
     * Lista todos os colaboradores ativos
     */
    static async listar(req: Request, res: Response): Promise<void> {
        try {
            const lista = await Colaborador.listar();
            res.status(200).json(lista);
        } catch (err) {
            console.error(err);
            res.status(400).json({ mensagem: "Erro ao listar colaboradores" });
        }
    }

    /**
     * Cadastra um novo colaborador
     */
    static async novo(req: Request, res: Response): Promise<void> {
        try {
            const dados: ColaboradorDTO = req.body;
            const col = new Colaborador(
                dados.nome,
                dados.cpf,
                dados.cargo,
                dados.email,
                dados.senha,
                dados.perfil
            );

            const sucesso = await Colaborador.novo(col);

            if (sucesso) {
                res.status(200).json({ mensagem: "Colaborador cadastrado" });
            } else {
                res.status(400).json({ mensagem: "Erro ao cadastrar" });
            }
        } catch (err) {
            console.error(err);
            res.status(400).json({ mensagem: "Erro ao cadastrar" });
        }
    }

    /**
     * Atualiza um colaborador existente
     */
    static async atualizar(req: Request, res: Response): Promise<void> {
        try {
            const dados: ColaboradorDTO = req.body;
            const id = parseInt(req.query.id as string);

            const col = new Colaborador(
                dados.nome,
                dados.cpf,
                dados.cargo,
                dados.email,
                dados.senha,
                dados.perfil
            );
            col.setIdColaborador(id);

            const sucesso = await Colaborador.atualizar(col);

            if (sucesso) {
                res.status(200).json({ mensagem: "Colaborador atualizado" });
            } else {
                res.status(400).json({ mensagem: "Erro ao atualizar" });
            }
        } catch (err) {
            console.error(err);
            res.status(400).json({ mensagem: "Erro ao atualizar" });
        }
    }

    /**
     * Remove (desativa) um colaborador
     */
    static async remover(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.query.id as string);
            const sucesso = await Colaborador.remover(id);

            if (sucesso) {
                res.status(200).json({ mensagem: "Colaborador removido" });
            } else {
                res.status(400).json({ mensagem: "Erro ao remover" });
            }
        } catch (err) {
            console.error(err);
            res.status(400).json({ mensagem: "Erro ao remover" });
        }
    }
}
