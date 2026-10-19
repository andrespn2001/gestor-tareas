let tasks = [];
let currentFilter = 'all';

function saveTasks() {
    localStorage.setItem('tasks-andres', JSON.stringify(tasks));
}

function loadTasks() {
    const saved = localStorage.getItem('tasks-andres');
    if (saved) tasks = JSON.parse(saved);
}

function addTask(text) {
    const newTask = {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    tasks.push(newTask);
    saveTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
}

function toggleTask(id) {
    tasks = tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task);
    saveTasks();
}

function clearCompleted() {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    renderTasks();
}

const taskInput = document.getElementById('taskInput');
const addButton = document.getElementById('addButton');
const taskList = document.getElementById('taskList');
const counter = document.getElementById('counter');
const filterBtns = document.querySelectorAll('.filter-btn');
const clearBtn = document.getElementById('clearCompleted');

function updateCounter() {
    const pending = tasks.filter(t => !t.completed).length;
    counter.textContent = `${pending} tarea${pending !== 1 ? 's' : ''} pendiente${pending !== 1 ? 's' : ''}`;
}

function renderTasks() {
    taskList.innerHTML = '';
    const tasksToRender = tasks.filter(task => {
        if (currentFilter === 'pending') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
        return true;
    });

    tasksToRender.forEach(task => {
        const li = document.createElement('li');
        if (task.completed) li.classList.add('completed');
        
        const infoDiv = document.createElement('div');
        infoDiv.className = 'task-info';
        
        const span = document.createElement('span');
        span.className = 'task-text';
        span.textContent = task.text;
        
        const dateSpan = document.createElement('span');
        dateSpan.className = 'task-date';
        dateSpan.textContent = `Creada a las ${task.createdAt}`;
        
        infoDiv.appendChild(span);
        infoDiv.appendChild(dateSpan);
        
        infoDiv.addEventListener('click', () => {
            toggleTask(task.id);
            renderTasks();
        });
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '🗑';
        deleteBtn.className = 'delete-btn';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteTask(task.id);
            renderTasks();
        });
        
        li.appendChild(infoDiv);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });
    updateCounter();
}

addButton.addEventListener('click', () => {
    const text = taskInput.value.trim();
    if (text === '') return;
    addTask(text);
    renderTasks();
    taskInput.value = '';
    taskInput.focus();
});

taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addButton.click();
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderTasks();
    });
});

clearBtn.addEventListener('click', clearCompleted);

loadTasks();
renderTasks();
