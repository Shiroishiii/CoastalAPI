import { Router } from "express";
import pool from "../../db/connection.js";
import praiaController from "../controller/praiaController.js";

const praiaRouter = Router();

praiaRouter.get('/', praiaController.getAll)

praiaRouter.get('/:id', praiaController.getById)

praiaRouter.post('/', praiaController.create)

praiaRouter.put('/:id', praiaController.update)

praiaRouter.delete('/:id', praiaController.remove)


export default praiaRouter
