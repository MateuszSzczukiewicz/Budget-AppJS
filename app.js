const budgetSwitch = document.getElementById('budget-switch');
const budgetDescription = document.getElementById('budget-description');
const budgetValue = document.getElementById('budget-value');
const budgetCheck = document.getElementById('budget-check');
const plusIcon = document.getElementById('plus-icon');

const listIncomes = document.getElementById('list-incomes');
const listExpenses = document.getElementById('list-expenses');

const headingIncomes = document.getElementById('heading-incomes');
const headingExpenses = document.getElementById('heading-expenses');

const balanceValue = document.getElementById('balance-value');
const budgetError = document.getElementById('budget-error');

let isActive = false;
let isEditing = false;
let numberOfIncomesItems = 0;
let numberOfExpensesItems = 0;
let totalValue = 0;

const formatNumberWithTwoDecimals = (number) => {
    return number.toFixed(2);
};

const toggleActiveState = () => {
    isActive = !isActive;
    budgetSwitch.style.backgroundColor = isActive ? 'var(--income-color)' : 'var(--expense-color)';
    plusIcon.classList.toggle('budget__icon--isActive', isActive);
};

const createFinance = (id, description, value, type) => {
    const itemValue = type === 'incomes' ? `${formatNumberWithTwoDecimals(value)}` : `-${formatNumberWithTwoDecimals(value)}`;
    const currencyColor = type === 'incomes' ? 'var(--income-color)' : 'var(--expense-color)';
    const plusIconVisibility = type === 'incomes' ? 'visible' : 'hidden';
    const descriptionClass = description.length > 15 ? 'item__description--truncate' : '';

    return `
        <div class="list__list" id="${id}">
            <div class="list__item">
                <p class="item__description ${descriptionClass}">${description}</p>
                <span class="item__plus-icon item__value--incomes" style="visibility: ${plusIconVisibility}">+</span>
                <p class="item__values item__value--${type}">${itemValue}</p>
                <span class="item__currency" style="color: ${currencyColor}">PLN</span>
                <div class="item__buttons">
                    <button class="item__button item__button--edit" onclick="editFinance('${id}', '${type}')">
                        <img class="item__icon" src="assets/editIcon.svg" alt="Edit icon">
                    </button>
                    <button class="item__button item__button--delete" onclick="deleteFinance('${id}', '${type}')">
                        <img class="item__icon" src="assets/deleteIcon.svg" alt="Delete icon">
                    </button>
                </div>
            </div>
        </div>
    `;
};

const isValidInput = (description, value) => {
    const isValid = value > 0 && description.trim() !== '';
    budgetError.style.visibility = isValid ? 'hidden' : 'visible';
    return isValid;
};

const handleBudgetCheckClick = () => {
    if (isEditing) {
        return;
    }
    addFinance();
};

const calculateTotalValue = () => {
    let total = 0;
    document.querySelectorAll('.item__values').forEach((valueElement) => {
        total += parseFloat(valueElement.textContent)
    });
    return total;
};

const saveDataToLocalStorage = () => {
    const incomesData = [];
    const expensesData = [];

    document.querySelectorAll('.list__list').forEach((financeItem) => {
        const id = financeItem.id;
        const description = financeItem.querySelector('.item__description').textContent;
        const value = parseFloat(financeItem.querySelector('.item__values').textContent);
        const type = value >= 0 ? 'incomes' : 'expenses';

        const financeData = { id, description, value };

        if (type === 'incomes') {
            incomesData.push(financeData);
        } else {
            expensesData.push(financeData);
        }
    });

    localStorage.setItem('incomes', JSON.stringify(incomesData));
    localStorage.setItem('expenses', JSON.stringify(expensesData));
};

const getDataToLocalStorage = () => {
    const incomesData = JSON.parse(localStorage.getItem('incomes') || '[]');
    const expensesData = JSON.parse(localStorage.getItem('expenses') || '[]');

    for (const income of incomesData) {
        const newIncomeItem = document.createElement('div');
        newIncomeItem.innerHTML = createFinance(income.id, income.description, income.value, 'incomes');
        listIncomes.append(newIncomeItem);
    }

    for (const expense of expensesData) {
        const newExpenseItem = document.createElement('div');
        newExpenseItem.innerHTML = createFinance(expense.id, expense.description, Math.abs(expense.value), 'expenses');
        listExpenses.append(newExpenseItem);
    }

    totalValue = calculateTotalValue();
    financeHeadingVisibility();
};

const addFinance = () => {
    const description = budgetDescription.value.trim();
    const value = Number(budgetValue.value);
    const id = `finance-${Date.now()}`;

    if (!isActive && isValidInput(description, value) && !isEditing) {
        headingExpenses.style.display = 'block';
        const newFinanceItem = document.createElement('div');
        newFinanceItem.innerHTML = createFinance(id, description, value, 'expenses');

        listExpenses.append(newFinanceItem);
        numberOfExpensesItems++;
        totalValue -= value;

        budgetDescription.value = '';
        budgetValue.value = '';
    } else if (isActive && isValidInput(description, value) && !isEditing) {
        headingIncomes.style.display = 'block';
        const newFinanceItem = document.createElement('div');
        newFinanceItem.innerHTML = createFinance(id, description, value, 'incomes');

        listIncomes.append(newFinanceItem);
        numberOfIncomesItems++;
        totalValue += value;

        budgetDescription.value = '';
        budgetValue.value = '';
        toggleActiveState();
    }

    financeHeadingVisibility();
    saveDataToLocalStorage();
};

const deleteFinance = (id, type) => {
    const financeItem = document.getElementById(id);
    const valueElement = financeItem.querySelector('.item__values');

    const value = Number(valueElement.textContent);

    if (value > 0) {
        totalValue -= value;
    } else if (value < 0) {
        totalValue += Math.abs(value);
    }

    financeItem.remove();
    if (type === 'incomes') {
        numberOfIncomesItems--;
    } else if (type === 'expenses') {
        numberOfExpensesItems--;
    }

    financeHeadingVisibility();
    saveDataToLocalStorage();
};

const editFinance = (id, type) => {
    isEditing = true;
    const financeItem = document.getElementById(id);
    const descriptionElement = financeItem.querySelector('.item__description');
    const valueElement = financeItem.querySelector('.item__values');

    const originalDescription = descriptionElement.textContent;
    const originalValue = Number(valueElement.textContent);

    budgetDescription.value = originalDescription;
    budgetValue.value = Math.abs(originalValue);

    const handleBudgetCheckClickDuringEdit = () => {
        const editedDescription = budgetDescription.value.trim();
        const editedValue = Number(budgetValue.value);
        const typeValue = type === 'incomes' ? editedValue : -editedValue;

        if (isValidInput(editedDescription, editedValue)) {
            totalValue = totalValue - originalValue + typeValue;
            descriptionElement.textContent = editedDescription;
            valueElement.textContent = type === 'incomes' ? `${formatNumberWithTwoDecimals(editedValue)}` : `-${formatNumberWithTwoDecimals(editedValue)}`;

            budgetDescription.value = '';
            budgetValue.value = '';

            isEditing = false;

            financeHeadingVisibility();
        }

        budgetCheck.removeEventListener('click', handleBudgetCheckClickDuringEdit);
        budgetDescription.removeEventListener('keydown', handleBudgetDescriptionKeydown);
        budgetValue.removeEventListener('keydown', handleBudgetValueKeydown);
        toggleActiveState();
        isActive = true;
        switchFinances();
        isEditing = false;
        saveDataToLocalStorage();
    };

    const handleBudgetDescriptionKeydown = (event) => {
        if (event.key === 'Enter') {
            handleBudgetCheckClickDuringEdit();
        }
    };

    const handleBudgetValueKeydown = (event) => {
        if (event.key === 'Enter') {
            handleBudgetCheckClickDuringEdit();
        }
    };

    if ((type === 'incomes' && !isActive) || (type === 'expenses' && isActive)) {
        toggleActiveState();
    }

    budgetCheck.addEventListener('click', handleBudgetCheckClickDuringEdit);
    budgetDescription.addEventListener('keydown', handleBudgetDescriptionKeydown);
    budgetValue.addEventListener('keydown', handleBudgetValueKeydown);
};

const financeHeadingVisibility = () => {
    numberOfIncomesItems = listIncomes.querySelectorAll('.list__list').length;
    numberOfExpensesItems = listExpenses.querySelectorAll('.list__list').length;

    headingExpenses.style.display = numberOfExpensesItems > 0 ? 'block' : 'none';
    headingIncomes.style.display = numberOfIncomesItems > 0 ? 'block' : 'none';

    totalValue = calculateTotalValue();
    const formattedTotalValue = formatNumberWithTwoDecimals(totalValue);
    balanceValue.innerText = totalValue >= 0 ? `+${formattedTotalValue} PLN` : `${formattedTotalValue} PLN`;
    balanceValue.style.color = totalValue >= 0 ? 'var(--income-color)' : 'var(--expense-color)';

    saveDataToLocalStorage();
};

const switchFinances = () => {
    toggleActiveState();
};

budgetSwitch.addEventListener('click', switchFinances);

budgetCheck.addEventListener('click', handleBudgetCheckClick);
budgetDescription.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        handleBudgetCheckClick();
    }
});
budgetValue.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        handleBudgetCheckClick();
    }
});

document.addEventListener('DOMContentLoaded', getDataToLocalStorage);
