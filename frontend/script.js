const API_URL = 'http://localhost:3000/api/tasks';

//MAPEAR OS ELEMENTOS PARA MANIPULAÇÃO
//Formulário de Envio
const taskForm = document.getElementById('task-form');

//O campo onde o usuário escreve a tarefa
const taskInput = document.getElementById('task-input');

//Onde a lista de tarefas vai ser adicionada
const taskList = document.getElementById('task-list');

//O texto 0/3 (contador)
const counterText = document.getElementById('counter-text');

//O texto na label dizendo "Edite sua tarefa" ou "Adicione sua tarefa"
const inputLabel = document.querySelector('.input-area label');

//Variáveis globais
let tasks = []; // lista de tarefas recebidas da api
let editingTaskId = null; // variável para identificar se está editando

async function fetchTasks() {
    try {
        const response = await axios.get(API_URL);
        tasks = response.data;
        renderTasks();

    } catch (error) {
        console.error("Erro ao buscar tarefas", error);
        alert("Falha de conexão com a API.")
    }
};

function renderTasks() {
    taskList.innerHTML = '';
    let concluidoCount = 0;
    const totalCount = tasks.length;

    tasks.forEach(task => {
        if (task.realizada) concluidoCount++;

        const li = document.createElement('li');
        li.className = `task-item ${task.realizada ? 'completed' : ''}`;
        const iconeEstado = task.realizada
            ? '<i class="fa-solid fa-circle-check"></i>'
            : '<i class="fa-regular fa-circle"></i>';

        li.innerHTML = `
        <div class="task-content">
                    <button class="check-btn" onclick="toggleTask(${task.id})">${iconeEstado}</button>
                    <span class="task-text">${task.tarefa}</span>
                </div>
                <div class="task-actions">
                    <button class="edit-btn" onclick="prepareEdit(${task.id})" title="Editar"><i class="fa-regular fa-pen-to-square"></i></button>
                    <button class="delete-btn" onclick="deleteTask(${task.id})" title="Excluir"><i class="fa-regular fa-trash-can"></i></button>
                </div>
        `;
        taskList.appendChild(li);
    });
    counterText.innerText = `${concluidoCount}/${totalCount}`;

};

async function saveTask(e) {
    e.preventDefault();
    const tarefaTexto = taskInput.value.trim();

    if (!tarefaTexto) return;

    try {
        if (editingTaskId) {
            const taskAtual = tasks.find(t=> t.id === editingTaskId);
            await axios.put(`${API_URL}/${editingTaskId}`,{
            tarefa : tarefaTexto,
            realizada : taskAtual.realizada
            });
            editingTaskId = null;
        } else {

            await axios.post(API_URL, {
                tarefa: tarefaTexto,
            });
        }

        taskInput.value = '';
        fetchTasks();

    } catch (error) {
        console.error("Erro ao salvar a tarefa ", error);
        alert("Erro ao tentar salvar a tarefa");
    }

}

async function deleteTask(id) {
    if (!confirm("Tem certeza que deseja excluir ?")) return;

    try {
        axios.delete(`${API_URL}/${id}`);
        fetchTasks();

    } catch (error) {
        console.error("Erro ao deletar tarefa");
    }
}

function prepareEdit(id) {
    const taskAtual = tasks.find(t => t.id === id);
    if (!taskAtual) return;

    editingTaskId = id;
    taskInput.value = taskAtual.tarefa;
    inputLavel.innerText = "Edite sua tarefa";
    taskInput.focus();

}

async function toggleTask(id){
    const taskAtual = tasks.find(t => t.id === id);
    if (!taskAtual) return;

    const novoStatus = !taskAtual.realizada;

    try {
        await axios.put(`${API_URL}/${id}`, {
            tarefa: taskAtual.tarefa,
            realizada: novoStatus
        });
        fetchTasks();

    } catch(erro){
        console.error("Erro ao atualizar status da tarefa", error);
    }
}

taskForm.addEventListener('submit', saveTask);
fetchTasks();
