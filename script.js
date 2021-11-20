
const store = {
    getItems() {
        const result = localStorage.getItem('todo-list');
        return result ? JSON.parse(result) : [];
    },

    setItems(newItems) {
        const result = JSON.stringify(newItems);
        localStorage.setItem('todo-list', result);
    },

    addItem(text) {
        const item = {
            text,
            done: false
            //id : new Date()
        }
        const items = this.getItems();
        items.push(item)
        this.setItems(items);
    },
    deleteItem(index) {
        const items = this.getItems();
        items.splice(index, 1);
        this.setItems(items);
    },

    getOne(index) {
        return this.getItems()[index];
    },
    updateText(index, text) {
        const items = this.getItems();
        const item = items[index]
        item.text = text;
        items.splice(index, 1, item);
        this.setItems(items);
    },
    toggleTodo(index) {
        const items = this.getItems();
        const item = items[index]
        item.done = !item.done;
        items.splice(index, 1, item);
        this.setItems(items);
    },
    clear() { this.setItems([]) }

};


function getItemValue(item) {
    return item.text;
}
function isDone(item) {
    return item.done;
}

const input = document.getElementById('input');
const editIndex = document.getElementById('edit-index');
const todoList = document.getElementById('todo-list');
const addBtn = document.getElementById('add-btn');
const saveBtn = document.getElementById('save-btn');

function refreshList() {
    const items = store.getItems();
    const output = items.map(function (item, index) {
        return `
        <li style="display: flex;justify-content-between;padding: 16px;align-items: center ;gap : 40%;">
        <div style="display: flex;align-items: center ; width:60%;">
        <input onchange="toggleTodo(${index})" type="checkbox" ${isDone(item) ? 'checked' : ''}>
        <div style="margin-left:1rem" class="${isDone(item) ? 'done' : ''}">${getItemValue(item)}</div>
        </div>
        <div style="width:20%;">
        <button onclick="editTodo(${index})" class="fa fa-edit" style="color:green ;border:none"></button>
        <button onclick="deleteTodo(${index})" class="fa fa-trash" style="color:red;border:none"></button>
        </div>
         </li>

        `
    })

    todoList.innerHTML = output.reverse().join('');

};

function addTodo() {
    const value = input.value;
    if (value.trim()) {
        store.addItem(value);
        refreshList();
        input.value = '';
    }
};

function editTodo(index) {
    addBtn.style.display = 'none';
    saveBtn.style.display = 'block';
    editIndex.value = index;
    input.value = getItemValue(store.getOne(index));
};

function saveTodo() {
    const index = editIndex.value;
    const text = input.value;
    store.updateText(index, text);
    refreshList();
    cancelEdit();
};

function cancelEdit() {
    addBtn.style.display = 'block';
    saveBtn.style.display = 'none';
    editIndex.value = '';
    input.value = '';
};

function deleteTodo(index) {
    store.deleteItem(index);
    refreshList();
};

function toggleTodo(index) {
    store.toggleTodo(index);
    refreshList();
}


function clearAll() {
    store.clear();
    cancelEdit();
    refreshList();
};

function init() {
    refreshList();
    console.log("program init")
}

function onKeyDown(event) {
    if (event.which === 13) {
        if (editIndex.value === '') { addTodo() }
        else { saveTodo() }
    }
}