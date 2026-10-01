const MAX_TASKS = 10;
let tasks = JSON.parse(localStorage.getItem('tasks_cdl_v2')) || [];
let editIndex = -1;

// Vinculando o evento de clique no botão via JS (evita inline HTML)
document.getElementById('btnSubmit').addEventListener('click', saveTask);

function showAlert(msg) {
  const alertBox = document.getElementById('alert');
  alertBox.innerText = msg;
  alertBox.style.display = 'block';
  setTimeout(() => { alertBox.style.display = 'none'; }, 3500);
}

function saveAndRender() {
  localStorage.setItem('tasks_cdl_v2', JSON.stringify(tasks));
  render();
}

function render() {
  const list = document.getElementById('taskList');
  list.innerHTML = '';
  document.getElementById('taskCount').innerText = tasks.length;

  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    
    // Formatação da Data (caso inserida)
    let dateDisplay = task.date ? task.date.split('-').reverse().join('/') : 'Sem data';

    li.innerHTML = `
      <div class="task-header">
        <span class="task-title">${task.text}</span>
        <span class="badge-prio prio-${task.prio}">${task.prio}</span>
      </div>
      <div class="task-details">
        <span>📅 Conclusão: ${dateDisplay}</span>
      </div>
      <div class="actions">
        <button class="btn-edit" onclick="editTask(${index})">Editar</button>
        <button class="btn-del" onclick="removeTask(${index})">Excluir</button>
      </div>
    `;
    list.appendChild(li);
  });
}

function saveTask() {
  const input = document.getElementById('taskInput');
  const prio = document.getElementById('taskPrio').value;
  const date = document.getElementById('taskDate').value;
  let text = input.value.trim();

  // RD01: Validação de Entrada
  if (!text) {
    showAlert('Por favor, digite o nome da tarefa.');
    return;
  }

  // RN02: Formatação Automática (Primeira letra maiúscula)
  text = text.charAt(0).toUpperCase() + text.slice(1);

  if (editIndex === -1) {
    // RN01: Limite de 10 Tarefas (Novo cadastro)
    if (tasks.length >= MAX_TASKS) {
      showAlert('Limite máximo de 10 tarefas atingido.');
      return;
    }
    tasks.push({ text, prio, date });
  } else {
    // Edição de Tarefa existente
    tasks[editIndex] = { text, prio, date };
    editIndex = -1;
    document.getElementById('btnSubmit').innerText = 'Adicionar Tarefa';
  }

  // Limpar campos
  input.value = '';
  document.getElementById('taskDate').value = '';
  document.getElementById('taskPrio').value = 'Média';
  
  saveAndRender();
}

function editTask(index) {
  const task = tasks[index];
  document.getElementById('taskInput').value = task.text;
  document.getElementById('taskPrio').value = task.prio;
  document.getElementById('taskDate').value = task.date || '';
  
  editIndex = index;
  document.getElementById('btnSubmit').innerText = 'Salvar Alteração';
}

function removeTask(index) {
  tasks.splice(index, 1);
  if(editIndex === index) {
    editIndex = -1;
    document.getElementById('btnSubmit').innerText = 'Adicionar Tarefa';
  }
  saveAndRender();
}

// Inicializar aplicação
render();