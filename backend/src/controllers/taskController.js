const Task = require('../models/taskModel');

exports.createTask = async(req,res) => {
    try{
        const {tarefa} = req.body;
        const newTask = await Task.create(tarefa);
        res.status(201).json(newTask);
    }
    catch(error)
    {
        res.status(500).json({erro: error.message});
    }
};

exports.getAllTasks = async (req, res) => {
    try{
        const tasks = await Task.findAll();
        res.json(tasks);
    }  catch (error){
        res.status(500).json({erro: error.message});
    }
};

exports.updateTask = async (req,res) => {
    try{
        const {id} = req.params;
        const {tarefa,realizada} = req.body;

        const updated = await Task.update(id,tarefa,realizada);
        res.json(updated);
    } catch (error){
        res.status(500).json({erro: error.message});
    }
};

exports.deleteTask = async (req,res) => {
    try{
        const {id} = req.params;
        const sucess = await Task.delete(id);
        if (!sucess) 
            return res.status(404).json({erro : "Registo não encontrado"});
        return res.status(204).send();
    } catch (error){
        res.status(500).json({erro: error.message});
    }
};