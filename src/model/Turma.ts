import { DataBaseModel } from "./DatabaseModel";
const database = new DataBaseModel().pool;

export class Turma {
    private idTurma: number = 0;
    private idTreinamento: number;
    private dataInicio: Date;
    private dataFim: Date;
    private cargaHoraria: number;

    constructor(idTreinamento: number, dataInicio: Date, dataFim: Date, cargaHoraria: number) {
        this.idTreinamento = idTreinamento;
        this.dataInicio = dataInicio;
        this.dataFim = dataFim;
        this.cargaHoraria = cargaHoraria;
    }

    public getIdTurma(): number { return this.idTurma; }
    public setIdTurma(id: number) { this.idTurma = id; }
    public getIdTreinamento(): number { return this.idTreinamento; }
    public setIdTreinamento(id: number) { this.idTreinamento = id; }
    public getDataInicio(): Date { return this.dataInicio; }
    public setDataInicio(d: Date) { this.dataInicio = d; }
    public getDataFim(): Date { return this.dataFim; }
    public setDataFim(d: Date) { this.dataFim = d; }
    public getCargaHoraria(): number { return this.cargaHoraria; }
    public setCargaHoraria(c: number) { this.cargaHoraria = c; }

    static async listar(): Promise<Turma[] | null> {
        const lista: Turma[] = [];
        try {
            const res = await database.query(`SELECT * FROM turma`);
            res.rows.forEach(row => {
                const t = new Turma(row.id_treinamento, row.data_inicio, row.data_fim, row.carga_horaria);
                t.setIdTurma(row.id_turma);
                lista.push(t);
            });
            return lista;
        } catch (err) {
            console.error(err);
            return null;
        }
    }

    static async nova(t: Turma): Promise<boolean> {
        try {
            const query = `
                INSERT INTO turma (id_treinamento, data_inicio, data_fim, carga_horaria)
                VALUES (${t.getIdTreinamento()}, '${t.getDataInicio().toISOString()}', '${t.getDataFim().toISOString()}', ${t.getCargaHoraria()})
            `;
            await database.query(query);
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    }

    static async atualizar(t: Turma): Promise<boolean> {
        try {
            const query = `
                UPDATE turma
                SET id_treinamento=${t.getIdTreinamento()}, data_inicio='${t.getDataInicio().toISOString()}', 
                    data_fim='${t.getDataFim().toISOString()}', carga_horaria=${t.getCargaHoraria()}
                WHERE id_turma=${t.getIdTurma()}
            `;
            await database.query(query);
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    }

    static async remover(id: number): Promise<boolean> {
        try {
            await database.query(`DELETE FROM turma WHERE id_turma=${id}`);
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    }
}
