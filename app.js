const budgetSwitch = document.getElementById('budget-switch')
const budgetDescription = document.getElementById('budget-description')
const budgetValue = document.getElementById('budget-value')
const budgetCheck = document.getElementById('budget-check')
const plusIcon = document.getElementById('plus-icon')

const listIncomes = document.getElementById('list-incomes')
const listExpenses = document.getElementById('list-expenses')

const headingIncomes = document.getElementById('heading-incomes')
const headingExpenses = document.getElementById('heading-expenses')

const balanceValue = document.getElementById('balance-value')
const balanceCurrency = document.querySelector('.item__currency')
const budgetError = document.getElementById('budget-error')

let isActive = false;
let isEditing = false
let numberOfIncomesItems = 0;
let numberOfExpensesItems = 0;
let totalValue = 0;

const switchFinances = () => {
    if (!isActive) {
        budgetSwitch.style.backgroundColor = 'var(--income-color)'
        plusIcon.classList.add('budget__icon--isActive');
        isActive = true;
    } else {
        budgetSwitch.style.backgroundColor = 'var(--expense-color)'
        plusIcon.classList.remove('budget__icon--isActive');
        isActive = false;
    }
}

    const createFinance = (id, description, value, type) => {
        let financeItemHTML = '';
        let itemValue = type === 'incomes' ? `${value}` : `${-value}`;
        let currencyColor = type === 'incomes' ? `${'var(--income-color)'}` : `${'var(--expense-color)'}`;

        financeItemHTML = `
        <div class="list__list" id="${id}">
            <div class="list__item">
                <p class="item__description">${description}</p>
                <p class="item__values item__value--${type}">${itemValue}</p>
                <span class="item__currency" style="color: ${currencyColor}">PLN</span>
                <div class="item__buttons">
                    <button class="item__button item__button--edit" onclick="editFinance('${id}')">
                        <img class="item__icon" src="assets/editIcon.svg" alt="Edit icon">
                    </button>
                    <button class="item__button item__button--delete" onclick="deleteFinance('${id}', '${type}')">
                        <img class="item__icon" src="assets/deleteIcon.svg" alt="Delete icon">
                    </button>
                </div>
            </div>
        </div>
        `;

        return financeItemHTML;
}

isValidInput = (description, value) => {
    if (value <= 0 || description.trim() === '') {
        budgetError.style.visibility = 'visible';
        return false;
    } else {
        budgetError.style.visibility = 'hidden';
        return true;
    }
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
    }

    financeHeadingVisibility();
};

const deleteFinance = (id, type) => {
    const financeItem = document.getElementById(id);
    const typeItem = document.getElementById(type);
    const valueElement = financeItem.querySelector('.item__values');
    const value = Number(valueElement.textContent);

    if (value > 0) {
        totalValue -= value;
    } else if (value < 0) {
        totalValue += Math.abs(value);
    }

    financeItem.remove()
    if (type === 'incomes') {
        numberOfIncomesItems--;
    } else if (type === 'expenses') {
        numberOfExpensesItems--;
    }

    financeHeadingVisibility()
}

const editFinance = (id) => {
    const financeItem = document.getElementById(id);
    const descriptionElement = financeItem.querySelector('.item__description');
    const valueElement = financeItem.querySelector('.item__values');

    const originalDescription = descriptionElement.textContent;
    const originalValue = Number(valueElement.textContent);

    budgetDescription.value = originalDescription;
    budgetValue.value = Math.abs(originalValue);

    budgetCheck.addEventListener('click', () => {
        const editedDescription = budgetDescription.value;
        const editedValue = Number(budgetValue.value);

        if (isValidInput(editedDescription, editedValue)) {
            descriptionElement.textContent = editedDescription;
            valueElement.textContent = `${editedValue}`;

            isEditing = false;

            financeHeadingVisibility();
        }
    });
};


const financeHeadingVisibility = () => {
    if (numberOfExpensesItems === 0) {
        headingExpenses.style.display = 'none';
    }

    if (numberOfIncomesItems === 0) {
        headingIncomes.style.display = 'none';
    }

    balanceValue.innerText = totalValue >= 0 ? `+${totalValue} PLN` : `${totalValue} PLN`;
    balanceValue.style.color = totalValue >= 0 ? `var(--income-color)` : `var(--expense-color)`;
}

budgetSwitch.addEventListener('click', switchFinances)
budgetCheck.addEventListener('click', addFinance)
budgetDescription.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        addFinance();
    }
});
budgetValue.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        addFinance();
    }
});