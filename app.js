const budgetSwitch = document.getElementById('budget-switch')
const budgetDescription = document.getElementById('budget-description')
const budgetValue = document.getElementById('budget-value')
const budgetCheck = document.getElementById('budget-check')
const plusIcon = document.getElementById('plus-icon')

const listIncomes = document.getElementById('list-incomes')
const listExpenses = document.getElementById('list-expenses')

const headingIncomes = document.getElementById('heading-incomes')
const headingExpenses = document.getElementById('heading-expenses')

let isActive = false;

const switchFinances = () => {
    if (!isActive) {
        budgetSwitch.style.backgroundColor = 'var(--income-color)'
        plusIcon.style.transform = 'rotate(90deg)'
        isActive = true;
    } else {
        budgetSwitch.style.backgroundColor = 'var(--expense-color)'
        plusIcon.style.transform = 'rotate(0deg)'
        isActive = false;
    }
}

const addFinance = () => {
    const newFinanceItem = document.createElement('div');
    newFinanceItem.classList.add('list__list')
    const description = budgetDescription.value;
    const value = budgetValue.value;

    if (!isActive) {
        headingExpenses.style.display = 'block'
        newFinanceItem.innerHTML = `
                <div class="list__item">
                  <p class="item__description">${description}</p>
                  <p class="item__values item__value--expenses">+ ${value} PLN</p>
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
    } else {
        headingIncomes.style.display = 'block'
        newFinanceItem.innerHTML = `
                <div class="list__item">
                  <p class="item__description">${description}</p>
                  <p class="item__values item__value--incomes">+ ${value} PLN</p>
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

        listIncomes.append(newFinanceItem)
    }
}

budgetSwitch.addEventListener('click', switchFinances)
budgetCheck.addEventListener('click', addFinance)