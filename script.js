// Check if user is logged in when the To-Do page loads
if (window.location.pathname === '/todo.html') {
    console.log('Checking if user is logged in...');
    checkLogin();
}

// Show Register Form
function showRegister() {
    console.log('Switching to Register form...');
    document.getElementById('registerSection').style.display = 'block';
    document.getElementById('loginSection').style.display = 'none';
}

// Show Login Form
function showLogin() {
    console.log('Switching to Login form...');
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('registerSection').style.display = 'none';
}

// Handle Registration
document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();
    console.log('Registering new user...');

    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;
    const displayName = document.getElementById('displayName').value;

    // Save user data to localStorage
    const userData = { username, password, displayName };
    localStorage.setItem(username, JSON.stringify(userData));

    // Redirect to login page after registration
    alert("Registration successful! You can now log in.");
    showLogin();
});

// Handle Login
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    console.log('Logging in user...');

    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    // Check if user exists in localStorage
    const storedUser = localStorage.getItem(username);
    console.log('Checking stored user data for:', username);

    if (storedUser) {
        const userData = JSON.parse(storedUser);
        console.log('User found:', userData);
        if (userData.password === password) {
            // Save the logged-in user's session
            localStorage.setItem('loggedInUser', username);
            console.log('Login successful. Redirecting to To-Do page...');
            // Redirect to To-Do page
            window.location.href = 'todo.html';
        } else {
            alert("Invalid password!");
        }
    } else {
        alert("No account found with that username.");
    }
});

// Redirect to login if not logged in
function checkLogin() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    console.log('Checking if logged in user exists...', loggedInUser);

    if (!loggedInUser) {
        console.log('No logged-in user. Redirecting to login...');
        window.location.href = 'index.html'; // Redirect to home page (login)
    } else {
        const userData = JSON.parse(localStorage.getItem(loggedInUser));
        document.getElementById('displayNameSpan').textContent = userData.displayName;
        console.log('Logged in as:', userData.displayName);
        loadTasks(); // Load tasks for logged-in user
    }
}

// Logout function
function logout() {
    console.log('Logging out...');
    localStorage.removeItem('loggedInUser');
    window.location.href = 'index.html'; // Redirect to home page (login)
}

// Task Management
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');

// Load tasks for the logged-in user
function loadTasks() {
    console.log('Loading tasks...');
    const loggedInUser = localStorage.getItem('loggedInUser');
    const tasks = JSON.parse(localStorage.getItem(loggedInUser + '_tasks')) || [];
    console.log('Loaded tasks:', tasks);
    tasks.forEach(task => {
        createTaskElement(task);
    });
}

// Save task to localStorage
function saveTask(task) {
    const loggedInUser = localStorage.getItem('loggedInUser');
    const tasks = JSON.parse(localStorage.getItem(loggedInUser + '_tasks')) || [];
    tasks.push(task);
    localStorage.setItem(loggedInUser + '_tasks', JSON.stringify(tasks));
}

// Save updated tasks to localStorage after modification (completion/deletion)
function updateTasksInStorage() {
    console.log('Updating tasks in storage...');
    const loggedInUser = localStorage.getItem('loggedInUser');
    const tasks = [];
    document.querySelectorAll('.task-item').forEach(taskElement => {
        const taskText = taskElement.querySelector('span').textContent;
        const completed = taskElement.classList.contains('complete');
        tasks.push({ text: taskText, completed });
    });
    localStorage.setItem(loggedInUser + '_tasks', JSON.stringify(tasks));
}

// Add a new task
    
addTaskBtn.addEventListener('click', function() {
    const taskText = taskInput.value.trim();

    if (taskText !== "") {
        const task = { text: taskText, completed: false };
        createTaskElement(task);
        saveTask(task);

        taskInput.value = '';
    }
});

// Create a task element
function createTaskElement(task) {
    console.log('Creating task element for:', task.text);
    const li = document.createElement('li');
    li.classList.add('task-item');

    const taskSpan = document.createElement('span');
    taskSpan.textContent = task.text;
    li.appendChild(taskSpan);

    // Task completion toggle
    li.addEventListener('click', function() {
        task.completed = !task.completed;
        li.classList.toggle('complete', task.completed);
        updateTasksInStorage(); // Save the updated status to localStorage
    });

    // Task delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent triggering the task completion toggle
        deleteTask(task);
        li.remove();
        updateTasksInStorage(); // Update tasks in localStorage after deletion
    });

    li.appendChild(deleteBtn);
    taskList.appendChild(li); // Append the new task to the task list
}

// Delete task from localStorage
function deleteTask(task) {
    console.log('Deleting task:', task.text);
    const loggedInUser = localStorage.getItem('loggedInUser');
    let tasks = JSON.parse(localStorage.getItem(loggedInUser + '_tasks')) || [];
    tasks = tasks.filter(t => t.text !== task.text); // Remove the task
    localStorage.setItem(loggedInUser + '_tasks', JSON.stringify(tasks));
}
