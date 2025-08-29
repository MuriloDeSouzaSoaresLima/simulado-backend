import { Request, Response } from "express";
import { Treinamento } from "../model/Treinamento";

interface TreinamentoDTO {
    titulo: string;
    descricao: string;
    cargaHoraria: number;
    obrigatorio: boolean;
    validadeMeses: number;
}

export class TreinamentoController {

    static async listar(req: Request, res: Response): Promise<void> {
        try {
            const lista = await Treinamento.listar();
            res.status(200).json(lista);
        } catch (err) {
            console.error(err);
            res.status(400).json({ mensagem: "Erro ao listar treinamentos" });
        }
    }

    static async novo(req: Request, res: Response): Promise<void> {
        try {
            const dados: TreinamentoDTO = req.body;
            const t = new Treinamento(dados.titulo, dados.descricao, dados.cargaHoraria, dados.obrigatorio, dados.validadeMeses);
            const sucesso = await Treinamento.novo(t);
            if (sucesso) res.status(200).json({ mensagem: "Treinamento cadastrado" });
            else res.status(400).json({ mensagem: "Erro ao cadastrar treinamento" });
        } catch (err) {
            console.error(err);
            res.status(400).json({ mensagem: "Erro ao cadastrar treinamento" });
        }
    }

    static async atualizar(req: Request, res: Response): Promise<void> {
        try {
            const dados: TreinamentoDTO = req.body;
            const id = parseInt(req.query.id as string);
            const t = new Treinamento(dados.titulo, dados.descricao, dados.cargaHoraria, dados.obrigatorio, dados.validadeMeses);
            t.setIdTreinamento(id);
            const sucesso = await Treinamento.atualizar(t);
            if (sucesso) res.status(200).json({ mensagem: "Treinamento atualizado" });
            else res.status(400).json({ mensagem: "Erro ao atualizar treinamento" });
        } catch (err) {
            console.error(err);
            res.status(400).json({ mensagem: "Erro ao atualizar treinamento" });
        }
    }

    static async remover(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.query.id as string);
            const sucesso = await Treinamento.remover(id);
            if (sucesso) res.status(200).json({ mensagem: "Treinamento removido" });
            else res.status(400).json({ mensagem: "Erro ao remover treinamento" });
        } catch (err) {
            console.error(err);
            res.status(400).json({ mensagem: "Erro ao remover treinamento" });
        }
    }
}
