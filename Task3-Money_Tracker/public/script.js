let expenses = [];
let totalAmount = 0;

const categorySelect = document.getElementById('category_select');
const amountInput = document.getElementById('amount_input');
const infoInput = document.getElementById('info');
const dateInput = document.getElementById('date_input');
const addBtn = document.getElementById('add_btn');
const expenseTableBody = document.getElementById('expense-table-body');
const totalAmountCell = document.getElementById('total-amount');

// Add transaction to the table and database
addBtn.addEventListener('click', function (event) {
    event.preventDefault(); // Prevent form submission from reloading the page

    const category = categorySelect.value;
    const amount = Number(amountInput.value);
    const info = infoInput.value;
    const date = dateInput.value;

    // Form validation
    if (!category || isNaN(amount) || amount <= 0 || !info || !date) {
        alert('Please fill in all fields with valid information.');
        return;
    }

    // Add new transaction to the table
    const newTransaction = { category, amount, info, date };
    expenses.push(newTransaction);
    updateTotalAmount(category, amount);
    renderTransactionRow(newTransaction);

    // Clear the form fields
    clearFormFields();

    // Send data to the server
    saveTransactionToServer(newTransaction);
});

// Function to update the total amount
function updateTotalAmount(category, amount) {
    if (category === 'Income') {
        totalAmount += amount;
    } else if (category === 'Expense') {
        totalAmount -= amount;
    }
    totalAmountCell.textContent = totalAmount.toFixed(2);
}

// Function to render a new row in the expenses table
function renderTransactionRow(expense) {
    const newRow = expenseTableBody.insertRow();

    newRow.insertCell().textContent = expense.category;
    newRow.insertCell().textContent = expense.amount;
    newRow.insertCell().textContent = expense.info;
    newRow.insertCell().textContent = expense.date;

    const deleteCell = newRow.insertCell();
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.addEventListener('click', function () {
        removeTransaction(expense, newRow);
    });
    deleteCell.appendChild(deleteBtn);
}

// Function to remove a transaction and update the total
function removeTransaction(expense, row) {
    expenses.splice(expenses.indexOf(expense), 1);
    updateTotalAmount(expense.category, -expense.amount); // Revert the total
    expenseTableBody.removeChild(row);
}

// Function to clear form fields after adding a transaction
function clearFormFields() {
    categorySelect.value = '';
    amountInput.value = '';
    infoInput.value = '';
    dateInput.value = '';
}

// Function to save the transaction to the server using fetch API
function saveTransactionToServer(transaction) {
    fetch('/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(transaction),
    })
    .then(response => response.json())
    .then(data => console.log('Transaction saved:', data))
    .catch(error => console.error('Error saving transaction:', error));
}
