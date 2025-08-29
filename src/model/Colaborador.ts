import { DataBaseModel } from "./DatabaseModel";
const database = new DataBaseModel().pool;

export class Colaborador {
    private idColaborador: number = 0;
    private nome: string;
    private cpf: string;
    private cargo: string;
    private email: string;
    private senha: string;
    private perfil: string;
    private status: boolean = true;

    constructor(nome_: string, cpf_: string, cargo_: string, email_: string, senha_: string, perfil_: string) {
        this.nome = nome_;
        this.cpf = cpf_;
        this.cargo = cargo_;
        this.email = email_;
        this.senha = senha_;
        this.perfil = perfil_;
    }

    public getIdColaborador(): number {
        return this.idColaborador;
    }
    public setIdColaborador(id: number) {
        this.idColaborador = id;
    }
    public getNome(): string {
        return this.nome;
    }
    public setNome(nome: string): void {
        this.nome = nome;
    }
    public getCpf(): string {
        return this.cpf;
    }
    public setCpf(cpf: string): void {
        this.cpf = cpf;
    }
    public getCargo(): string {
        return this.cargo;
    }
    public setCargo(cargo: string) {
        this.cargo = cargo
    }
    public getEmail(): string {
        return this.email;
    }
    public setEmail(email: string): void {
        this.email = email
    }
    public getSenha(): string {
        return this.senha;
    }
    public setSenha(senha:string): void {
        this.senha = senha
    }
    public getPerfil(): string {
        return this.perfil;
    }
    public setPerfil(perfil: string): void {
        this.perfil = perfil
    }
    public getStatus(): boolean {
        return this.status;
    }
    public setStatus(status: boolean): void {
        this.status = status;
    }

    static async listar(): Promise<Array<Colaborador> | null> {
        const lista: Colaborador[] = [];
        try {
            const res = await database.query(`SELECT * FROM colaborador WHERE status = TRUE`);
            res.rows.forEach(row => {
                const c = new Colaborador(row.nome, row.cpf, row.cargo, row.email, row.senha, row.perfil);
                c.setIdColaborador(row.id_colaborador);
                c.setStatus(row.status);
                lista.push(c);
            });
            return lista;
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    static async novo(col: Colaborador): Promise<boolean> {
        try {
            const query = `
                INSERT INTO colaborador (nome, cpf, cargo, email, senha, perfil)
                VALUES ('${col.getNome()}', '${col.getCpf()}', '${col.getCargo()}', '${col.getEmail()}', '${col.getSenha()}', '${col.getPerfil()}')
            `;
            await database.query(query);
            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    static async atualizar(col: Colaborador): Promise<boolean> {
        try {
            const query = `
                UPDATE colaborador SET nome='${col.getNome()}', cargo='${col.getCargo()}', email='${col.getEmail()}', status=${col.getStatus()}
                WHERE id_colaborador=${col.getIdColaborador()}
            `;
            await database.query(query);
            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    static async remover(id: number): Promise<boolean> {
        try {
            await database.query(`UPDATE colaborador SET status = FALSE WHERE id_colaborador=${id}`);
            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    }
}
