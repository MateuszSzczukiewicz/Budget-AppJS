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
const budgetError = document.getElementById('budget-error')

let isActive = false;
let isValid = false;
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
        const formattedValue = type === 'incomes' ? `+ ${value} PLN` : `- ${value} PLN`;
        // const formattedValue = value >= 0 ? `+ ${value} PLN` : `- ${Math.abs(value)} PLN`;

        financeItemHTML = `
        <div class="list__list" id="${id}">
            <div class="list__item">
                <p class="item__description">${description}</p>
                <p class="item__values item__value--${type}">${formattedValue}</p>
                <div class="item__buttons">
                    <button class="item__button item__button--edit">
                        <img class="item__icon" src="assets/editIcon.svg" alt="Edit icon">
                    </button>
                    <button class="item__button item__button--delete" onclick="deleteFinance('${id}')">
                        <img class="item__icon" src="assets/deleteIcon.svg" alt="Delete icon">
                    </button>
                </div>
            </div>
        </div>
    `;

        console.log(id);
        return financeItemHTML;
}

const addFinance = () => {
    const newFinanceItem = document.createElement('div');
    const description = budgetDescription.value;
    const value = Number(budgetValue.value);
    const id = `finance-${Date.now()}`;

    if (value <= 0 && description === '') {
        budgetError.style.visibility = 'visible';
        isValid = true;
    } else {
        budgetError.style.visibility = 'hidden';
        isValid = false;
    }

    if (!isActive && !isValid) {
        headingExpenses.style.display = 'block';
        newFinanceItem.innerHTML = createFinance(id, description, value, 'expenses');

        listExpenses.append(newFinanceItem);
        numberOfExpensesItems++;
        totalValue -= value;

        budgetDescription.value = '';
        budgetValue.value = '';
    } else if (isActive && !isValid) {
        headingIncomes.style.display = 'block';
        newFinanceItem.innerHTML = createFinance(id, description, value, 'incomes');

        listIncomes.append(newFinanceItem);
        numberOfIncomesItems++;
        totalValue += value;

        budgetDescription.value = '';
        budgetValue.value = '';
    }

    balanceValue.innerText = totalValue >= 0 ? `+${totalValue} PLN` : `${totalValue} PLN`;
    balanceValue.style.color = totalValue >= 0 ? `var(--income-color)` : `var(--expense-color)`;
    financeHeadingVisibility()
};

const deleteFinance = (id, type) => {
    const financeItem = document.getElementById(id);
    const valueElement = financeItem.querySelector('.item__values');
    const value = Number(valueElement);

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


    balanceValue.innerText = totalValue >= 0 ? `+${totalValue} PLN` : `${totalValue} PLN`;
    balanceValue.style.color = totalValue >= 0 ? `var(--income-color)` : `var(--expense-color)`;
    financeHeadingVisibility()
    return value;
}

const financeHeadingVisibility = () => {
    if (numberOfExpensesItems === 0) {
        headingExpenses.style.display = 'none';
    }

    if (numberOfIncomesItems === 0) {
        headingIncomes.style.display = 'none';
    }
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