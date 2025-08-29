import express from "express";
import { SERVER_ROUTES } from "./appConfig";
import {ColaboradorController} from "./controller/ColaboradorController";
import {TreinamentoController} from "./controller/TreinamentoController";
import {TurmaController} from "./controller/TurmaController";
import UsuarioController from "./controller/UsuarioController";
import  {upload} from "./config/multerConfig" // caminho pode variar dependendo da estrutura
import { Auth } from './auth/Auth';

const router = express.Router();

router.get('/', (req, res) => {
    res.json({ mensagem: "Rota padrão" })
});

// CRUD COLABORADOR
router.get(SERVER_ROUTES.LISTAR_COLABORADOR, ColaboradorController.listar);
router.post(SERVER_ROUTES.NOVO_COLABORADORES, ColaboradorController.novo);
router.put(SERVER_ROUTES.REMOVER_COLABORADOR, ColaboradorController.remover);
router.put(SERVER_ROUTES.ATUALIZAR_COLABORADOR, ColaboradorController.atualizar);

//CRUD Meta
router.get(SERVER_ROUTES.LISTAR_TREINAMENTOS, TreinamentoController.listar);
router.post(SERVER_ROUTES.NOVA_TREINAMENTO, TreinamentoController.novo);
router.put(SERVER_ROUTES.REMOVER_TREINAMENTO, TreinamentoController.remover);
router.put(SERVER_ROUTES.ATUALIZAR_TREINAMENTO, TreinamentoController.atualizar);

//CRUD Banco
router.get(SERVER_ROUTES.LISTAR_TURMAS, TurmaController.listar);
router.post(SERVER_ROUTES.NOVO_TURMA, TurmaController.nova);
router.put(SERVER_ROUTES.ATUALIZAR_TURMA, TurmaController.atualizar);
router.put(SERVER_ROUTES.REMOVER_TURMA, TurmaController.remover);

// Cadastro de Usuário com Upload de Imagem de Perfil
router.post(SERVER_ROUTES.NOVO_USUARIO, upload.single('imagemPerfil'), UsuarioController.cadastrar);
router.post('/login', Auth.validacaoUsuario);
//atualizar para bycript
router.post('/atualizar-senhas', Auth.atualizarSenhasComBcrypt);
export { router }