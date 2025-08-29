import { Request, Response } from "express";
import { Turma } from "../model/Turma";

interface TurmaDTO {
    idTreinamento: number;
    dataInicio: string; // string do JSON que será convertida
    dataFim: string;     // string do JSON que será convertida
    cargaHoraria: number;
}

export class TurmaController {

    static async listar(req: Request, res: Response): Promise<void> {
        try {
            const lista = await Turma.listar();
            res.status(200).json(lista);
        } catch (err) {
            console.error(err);
            res.status(400).json({ mensagem: "Erro ao listar turmas" });
        }
    }

    static async nova(req: Request, res: Response): Promise<void> {
        try {
            const dados: TurmaDTO = req.body;

            // Converte as strings recebidas em objetos Date
            const dataInicio = new Date(dados.dataInicio);
            const dataFim = new Date(dados.dataFim);

            const t = new Turma(dados.idTreinamento, dataInicio, dataFim, dados.cargaHoraria);

            const sucesso = await Turma.nova(t);
            if (sucesso) res.status(200).json({ mensagem: "Turma cadastrada" });
            else res.status(400).json({ mensagem: "Erro ao cadastrar turma" });
        } catch (err) {
            console.error(err);
            res.status(400).json({ mensagem: "Erro ao cadastrar turma" });
        }
    }

    static async atualizar(req: Request, res: Response): Promise<void> {
        try {
            const dados: TurmaDTO = req.body;
            const id = parseInt(req.query.id as string);

            const dataInicio = new Date(dados.dataInicio);
            const dataFim = new Date(dados.dataFim);

            const t = new Turma(dados.idTreinamento, dataInicio, dataFim, dados.cargaHoraria);
            t.setIdTurma(id);

            const sucesso = await Turma.atualizar(t);
            if (sucesso) res.status(200).json({ mensagem: "Turma atualizada" });
            else res.status(400).json({ mensagem: "Erro ao atualizar turma" });
        } catch (err) {
            console.error(err);
            res.status(400).json({ mensagem: "Erro ao atualizar turma" });
        }
    }

    static async remover(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.query.id as string);
            const sucesso = await Turma.remover(id);
            if (sucesso) res.status(200).json({ mensagem: "Turma removida" });
            else res.status(400).json({ mensagem: "Erro ao remover turma" });
        } catch (err) {
            console.error(err);
            res.status(400).json({ mensagem: "Erro ao remover turma" });
        }
    }
}
