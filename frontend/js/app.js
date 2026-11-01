
// ELEMENTOS DEL HTML
const authSection = document.getElementById('auth-section');
const dashboardSection = document.getElementById('dashboard-section');

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

const showLoginBtn = document.getElementById('show-login');
const showRegisterBtn = document.getElementById('show-register');

const authMessage = document.getElementById('auth-message');
const taskMessage = document.getElementById('task-message');

const welcomeMessage = document.getElementById('welcome-message');
const logoutBtn = document.getElementById('logout-btn');

const taskForm = document.getElementById('task-form');
const taskTitle = document.getElementById('task-title');
const taskDescription = document.getElementById('task-description');

const taskList = document.getElementById('task-list');
const taskCount = document.getElementById('task-count');
const completedCount = document.getElementById('completed-count');

const formTitle = document.getElementById('form-title');
const saveTaskBtn = document.getElementById('save-task-btn');
const cancelEditBtn = document.getElementById('cancel-edit-btn');

let editingTaskId = null;
let currentUser = null;

// MOSTRAR MENSAJES
function showMessage(element, message, type = 'success') {
    element.textContent = message;
    element.className = `message ${type}`;
}

// CAMBIAR ENTRE LOGIN Y REGISTRO
function showLogin() {
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');

    showLoginBtn.classList.add('active');
    showRegisterBtn.classList.remove('active');

    showMessage(authMessage, '');
}

function showRegister() {
    registerForm.classList.remove('hidden');
    loginForm.classList.add('hidden');

    showRegisterBtn.classList.add('active');
    showLoginBtn.classList.remove('active');

    showMessage(authMessage, '');
}

showLoginBtn.addEventListener('click', showLogin);
showRegisterBtn.addEventListener('click', showRegister);

// REGISTRAR USUARIO
registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;

    try {
        const data = await apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password })
        });

        showMessage(
            authMessage,
            data.mensaje + '. Ahora inicia sesión.',
            'success'
        );

        registerForm.reset();
        showLogin();

    } catch (error) {
        showMessage(authMessage, error.message, 'error');
    }
});

// INICIAR SESIÓN
loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    try {
        const data = await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });

        localStorage.setItem('taskflow_token', data.token);

        currentUser = data.usuario;

        loginForm.reset();

        showDashboard();

    } catch (error) {
        showMessage(authMessage, error.message, 'error');
    }
});

// MOSTRAR PANEL PRINCIPAL
function showDashboard() {
    authSection.classList.add('hidden');
    dashboardSection.classList.remove('hidden');

    welcomeMessage.textContent =
        `Hola, ${currentUser?.name || 'usuario'}. ¡Organiza tu día!`;

    loadTasks();
}

// CERRAR SESIÓN
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('taskflow_token');

    currentUser = null;
    editingTaskId = null;

    dashboardSection.classList.add('hidden');
    authSection.classList.remove('hidden');

    taskForm.reset();
    showLogin();
});

// CARGAR TODAS LAS TAREAS
async function loadTasks() {
    try {
        const data = await apiRequest('/tasks');

        renderTasks(data.tareas);

        showMessage(taskMessage, '');

    } catch (error) {
        showMessage(taskMessage, error.message, 'error');

        if (error.message.includes('Token')) {
            logoutBtn.click();
        }
    }
}

// MOSTRAR TAREAS EN PANTALLA
function renderTasks(tasks) {
    taskList.replaceChildren();

    const completed = tasks.filter(task => task.completed).length;

    taskCount.textContent =
        `${tasks.length} ${tasks.length === 1 ? 'tarea' : 'tareas'}`;

    completedCount.textContent =
        `${completed} completadas`;

    if (tasks.length === 0) {
        const empty = document.createElement('p');

        empty.className = 'empty-message';
        empty.textContent = 'Todavía no tienes tareas. ¡Agrega tu primera actividad!';

        taskList.appendChild(empty);
        return;
    }

    tasks.forEach(task => {
        const card = document.createElement('article');

        card.className = 'task-card';

        if (task.completed) {
            card.classList.add('completed');
        }

        const title = document.createElement('h3');
        title.textContent = task.title;

        const description = document.createElement('p');
        description.textContent =
            task.description || 'Sin descripción';

        const status = document.createElement('span');
        status.className = 'task-status';
        status.textContent =
            task.completed ? 'Completada' : 'Pendiente';

        const actions = document.createElement('div');
        actions.className = 'task-actions';

        const completeButton = document.createElement('button');
        completeButton.type = 'button';
        completeButton.textContent =
            task.completed ? 'Reabrir' : 'Completar';

        completeButton.addEventListener('click', () => {
            toggleTask(task);
        });

        const editButton = document.createElement('button');
        editButton.type = 'button';
        editButton.textContent = 'Editar';

        editButton.addEventListener('click', () => {
            editTask(task);
        });

        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.textContent = 'Eliminar';
        deleteButton.classList.add('delete-btn');

        deleteButton.addEventListener('click', () => {
            deleteTask(task._id);
        });

        actions.append(
            completeButton,
            editButton,
            deleteButton
        );

        card.append(
            title,
            description,
            status,
            actions
        );

        taskList.appendChild(card);
    });
}

// CREAR O ACTUALIZAR TAREA
taskForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const title = taskTitle.value.trim();
    const description = taskDescription.value.trim();

    if (!title) {
        showMessage(taskMessage, 'Escribe el título de la tarea.', 'error');
        return;
    }

    try {
        if (editingTaskId) {
            await apiRequest(`/tasks/${editingTaskId}`, {
                method: 'PUT',
                body: JSON.stringify({ title, description })
            });

            showMessage(taskMessage, 'Tarea actualizada correctamente.');

        } else {
            await apiRequest('/tasks', {
                method: 'POST',
                body: JSON.stringify({ title, description })
            });

            showMessage(taskMessage, 'Tarea creada correctamente.');
        }

        resetTaskForm();
        await loadTasks();

    } catch (error) {
        showMessage(taskMessage, error.message, 'error');
    }
});

// PREPARAR EDICIÓN
function editTask(task) {
    editingTaskId = task._id;

    taskTitle.value = task.title;
    taskDescription.value = task.description || '';

    formTitle.textContent = 'Editar tarea';
    saveTaskBtn.textContent = 'Guardar cambios';

    cancelEditBtn.classList.remove('hidden');

    taskForm.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// CANCELAR EDICIÓN
function resetTaskForm() {
    editingTaskId = null;

    taskForm.reset();

    formTitle.textContent = 'Agregar nueva tarea';
    saveTaskBtn.textContent = 'Agregar tarea';

    cancelEditBtn.classList.add('hidden');
}

cancelEditBtn.addEventListener('click', resetTaskForm);

// COMPLETAR O REABRIR TAREA
async function toggleTask(task) {
    try {
        await apiRequest(`/tasks/${task._id}`, {
            method: 'PUT',
            body: JSON.stringify({
                completed: !task.completed
            })
        });

        await loadTasks();

    } catch (error) {
        showMessage(taskMessage, error.message, 'error');
    }
}

// ELIMINAR TAREA
async function deleteTask(id) {
    const confirmed = confirm(
        '¿Estás seguro de que deseas eliminar esta tarea?'
    );

    if (!confirmed) {
        return;
    }

    try {
        await apiRequest(`/tasks/${id}`, {
            method: 'DELETE'
        });

        showMessage(taskMessage, 'Tarea eliminada correctamente.');

        await loadTasks();

    } catch (error) {
        showMessage(taskMessage, error.message, 'error');
    }
}

// RECUPERAR SESIÓN AL RECARGAR LA PÁGINA
async function initializeApp() {
    const token = localStorage.getItem('taskflow_token');

    if (!token) {
        showLogin();
        return;
    }

    try {
        const data = await apiRequest('/tasks');

        // El token es válido si la consulta protegida funcionó.
        currentUser = {
            name: 'usuario'
        };

        authSection.classList.add('hidden');
        dashboardSection.classList.remove('hidden');

        welcomeMessage.textContent =
            'Bienvenido de nuevo. ¡Organiza tu día!';

        renderTasks(data.tareas);

    } catch (error) {
        localStorage.removeItem('taskflow_token');
        showLogin();
    }
}

// INICIAR APLICACIÓN
initializeApp();
