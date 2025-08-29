import { DataBaseModel } from "./DatabaseModel";
const database = new DataBaseModel().pool;

export class Treinamento {
    private idTreinamento: number = 0;
    private titulo: string;
    private descricao: string;
    private cargaHoraria: number;
    private obrigatorio: boolean;
    private validadeMeses: number;

    constructor(titulo: string, descricao: string, cargaHoraria: number, obrigatorio: boolean, validadeMeses: number) {
        this.titulo = titulo;
        this.descricao = descricao;
        this.cargaHoraria = cargaHoraria;
        this.obrigatorio = obrigatorio;
        this.validadeMeses = validadeMeses;
    }

    public getIdTreinamento(): number { return this.idTreinamento; }
    public setIdTreinamento(id: number) { this.idTreinamento = id; }
    public getTitulo(): string { return this.titulo; }
    public setTitulo(titulo: string) { this.titulo = titulo; }
    public getDescricao(): string { return this.descricao; }
    public setDescricao(descricao: string) { this.descricao = descricao; }
    public getCargaHoraria(): number { return this.cargaHoraria; }
    public setCargaHoraria(carga: number) { this.cargaHoraria = carga; }
    public isObrigatorio(): boolean { return this.obrigatorio; }
    public setObrigatorio(obrigatorio: boolean) { this.obrigatorio = obrigatorio; }
    public getValidadeMeses(): number { return this.validadeMeses; }
    public setValidadeMeses(meses: number) { this.validadeMeses = meses; }

    // Listar todos os treinamentos
    static async listar(): Promise<Treinamento[] | null> {
        const lista: Treinamento[] = [];
        try {
            const res = await database.query(`SELECT * FROM treinamento`);
            res.rows.forEach(row => {
                const t = new Treinamento(row.titulo, row.descricao, row.carga_horaria, row.obrigatorio, row.validade_meses);
                t.setIdTreinamento(row.id_treinamento);
                lista.push(t);
            });
            return lista;
        } catch (err) {
            console.error(err);
            return null;
        }
    }

    // Cadastrar um novo treinamento
    static async novo(t: Treinamento): Promise<boolean> {
        try {
            const query = `
                INSERT INTO treinamento (titulo, descricao, carga_horaria, obrigatorio, validade_meses)
                VALUES ('${t.getTitulo()}', '${t.getDescricao()}', ${t.getCargaHoraria()}, ${t.isObrigatorio()}, ${t.getValidadeMeses()})
            `;
            await database.query(query);
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    }

    // Atualizar um treinamento existente
    static async atualizar(t: Treinamento): Promise<boolean> {
        try {
            const query = `
                UPDATE treinamento
                SET titulo='${t.getTitulo()}', descricao='${t.getDescricao()}', carga_horaria=${t.getCargaHoraria()}, 
                    obrigatorio=${t.isObrigatorio()}, validade_meses=${t.getValidadeMeses()}
                WHERE id_treinamento=${t.getIdTreinamento()}
            `;
            await database.query(query);
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    }

    // Remover (deletar) um treinamento
    static async remover(id: number): Promise<boolean> {
        try {
            await database.query(`DELETE FROM treinamento WHERE id_treinamento=${id}`);
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    }
}
