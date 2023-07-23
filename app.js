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
let numberOfItems = 0;
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

const addFinance = () => {
    const newFinanceItem = document.createElement('div');
    newFinanceItem.classList.add('list__list')
    const description = budgetDescription.value;
    const value = Number(budgetValue.value);

    if (value <= 0 && description === '') {
        budgetError.style.visibility = 'visible';
        isValid = true;
    } else {
        budgetError.style.visibility = 'hidden';
        isValid = false;
    }

    if (!isActive && !isValid) {
        headingExpenses.style.display = 'block'
        newFinanceItem.innerHTML = `
                <div class="list__item">
                  <p class="item__description">${description}</p>
                  <p class="item__values item__value--expenses">- ${value} PLN</p>
                </div>
                <div class="item__buttons">
                  <button class="item__button item__button--edit">
                    <img class="item__icon" src="assets/editIcon.svg" alt="Edit icon">
                  </button>
                  <button class="item__button item__button--delete">
                    <img class="item__icon" src="assets/deleteIcon.svg" alt="Delete icon">
                  </button>
                </div>
        `

        listExpenses.append(newFinanceItem)
        numberOfItems++;
        totalValue -= value;

        budgetDescription.value = '';
        budgetValue.value = '';
    } else if (isActive && !isValid) {
        headingIncomes.style.display = 'block'
        newFinanceItem.innerHTML = `
            <div class="list__item">
                <p class="item__description">${description}</p>
                <p class="item__values item__value--incomes">+ ${value} PLN</p>
                <div class="item__buttons">
                    <button class="item__button item__button--edit">
                        <img class="item__icon" src="assets/editIcon.svg" alt="Edit icon">
                    </button>
                    <button class="item__button item__button--delete">
                        <img class="item__icon" src="assets/deleteIcon.svg" alt="Delete icon">
                    </button>
                </div>
            </div>
        `

        listIncomes.append(newFinanceItem)
        numberOfItems++;
        totalValue += value;

        budgetDescription.value = '';
        budgetValue.value = '';
    }

    if (numberOfItems === 0) {
        headingExpenses.style.display = 'none';
        headingIncomes.style.display = 'none';
    }

    balanceValue.innerText = totalValue >= 0 ? `+${totalValue} PLN` : `${totalValue} PLN`
    balanceValue.style.color = totalValue >= 0 ? `var(--income-color)` : `var(--expense-color)`
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