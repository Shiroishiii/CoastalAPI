import { Router } from "express";
import pool from "../../db/connection.js";


const router = Router()

//CADASTRO
router.post('/cadastro', async (req, res) => {
    const {nome, email, senha} = req.body

    const sql = `INSERT INTO usuario (nome, email, senha) VALUES (?, ?, ?)`

    pool.query(sql, [nome, email, senha], (error, result) =>{
        if(error){
            if(error.code === 'ER_DUP_ENTRY'){
                return res.status(400).json({erro: 'Email já cadastrado'})
            }
            return res.status(500).json(erro)
        }

        res.status(201).json({
            id:result.insertId,
            nome,
            email
        })
    })
})

// LOGIN
router.post("/login", (req, res) => {
  const { email, senha } = req.body

  const sql = `SELECT * FROM usuario WHERE email = ?`

  pool.query(sql, [email], (erro, resultados) => {
    if (erro) return res.status(500).json(erro)

    if (resultados.length === 0) {
      return res.status(401).json({ erro: "Usuário não encontrado" })
    }

    const usuario = resultados[0]

    if (senha !== usuario.senha) {
      return res.status(401).json({ erro: "Senha inválida" })
    }

    res.json({
      mensagem: "Login realizado com sucesso",
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email
      }
    })
  })
})

//GET Usuarios

router.get("/usuarios", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM usuario");
    res.json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro ao buscar usuarios" });
  }
});


export default router