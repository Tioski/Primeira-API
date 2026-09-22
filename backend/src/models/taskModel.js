const db = require('../config/db');

class Task{
    constructor (id, tarefa, realizada){
        this.id = id;
        this.tarefa = tarefa;
        this.realizada = realizada ? true : false;
    }
}

const taskModel = {
    create : async (tarefa) => {
        const [result] = await db.query('INSERT INTO tasks (tarefa) VALUES (?)', [tarefa]);
        return new Task(result.insertId, tarefa,false);
    },
    //Método que lista as tarefas
    findAll : async()=>{
        const [rows] = await db.query('SELECT * FROM tasks');
        return rows.map(row=> new Task(row.id, row.tarefa, row.realizada))
    },
    update : async(id, tarefa, realizada) => {
        await db.query('UPDATE tasks set tarefa=?, realizada=? WHERE id=?',[tarefa,realizada,id]);
        return new Task(id,tarefa,realizada);
    },
    delete : async(id) => {
        const [result] = await db.query('DELETE FROM tasks WHERE id=?',[id]);
        return result.affectedRows > 0;
    }

};

module.exports = taskModel;