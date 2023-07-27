class BudgetApp {
    constructor() {
        this.budgetSwitch = document.getElementById('budget-switch');
        this.budgetDescription = document.getElementById('budget-description');
        this.budgetValue = document.getElementById('budget-value');
        this.budgetCheck = document.getElementById('budget-check');
        this.plusIcon = document.getElementById('plus-icon');

        this.listIncomes = document.getElementById('list-incomes');
        this.listExpenses = document.getElementById('list-expenses');

        this.headingIncomes = document.getElementById('heading-incomes');
        this.headingExpenses = document.getElementById('heading-expenses');

        this.balanceValue = document.getElementById('balance-value');
        this.budgetError = document.getElementById('budget-error');

        this.isActive = false;
        this.isEditing = false;
        this.numberOfIncomesItems = 0;
        this.numberOfExpensesItems = 0;
        this.totalValue = 0;

        this.budgetSwitch.addEventListener('click', this.switchFinances.bind(this));
        this.budgetCheck.addEventListener('click', this.handleBudgetCheckClick.bind(this));
        this.budgetDescription.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                this.handleBudgetCheckClick();
            }
        });
        this.budgetValue.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                this.handleBudgetCheckClick();
            }
        });

        document.addEventListener('DOMContentLoaded', this.getDataToLocalStorage.bind(this));
    }

    formatNumberWithTwoDecimals(number) {
        return number.toFixed(2);
    }

    toggleActiveState() {
        this.isActive = !this.isActive;
        this.budgetSwitch.style.backgroundColor = this.isActive ? 'var(--income-color)' : 'var(--expense-color)';
        this.plusIcon.classList.toggle('budget__icon--isActive', this.isActive);
    }

    createFinance(id, description, value, type) {
        const itemValue = type === 'incomes' ? `${this.formatNumberWithTwoDecimals(value)}` : `-${this.formatNumberWithTwoDecimals(value)}`;
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
                        <button class="item__button item__button--edit" onclick="app.editFinance('${id}', '${type}')">
                            <img class="item__icon" src="assets/editIcon.svg" alt="Edit icon">
                        </button>
                        <button class="item__button item__button--delete" onclick="app.deleteFinance('${id}', '${type}')">
                            <img class="item__icon" src="assets/deleteIcon.svg" alt="Delete icon">
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    isValidInput(description, value) {
        const isValid = value > 0 && description.trim() !== '';
        this.budgetError.style.visibility = isValid ? 'hidden' : 'visible';
        return isValid;
    }

    handleBudgetCheckClick() {
        if (this.isEditing) {
            return;
        }
        this.addFinance();
    }

    calculateTotalValue() {
        let total = 0;
        document.querySelectorAll('.item__values').forEach((valueElement) => {
            total += parseFloat(valueElement.textContent)
        });
        return total;
    }

    saveDataToLocalStorage() {
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
    }

    getDataToLocalStorage() {
        const incomesData = JSON.parse(localStorage.getItem('incomes') || '[]');
        const expensesData = JSON.parse(localStorage.getItem('expenses') || '[]');

        for (const income of incomesData) {
            const newIncomeItem = document.createElement('div');
            newIncomeItem.innerHTML = this.createFinance(income.id, income.description, income.value, 'incomes');
            this.listIncomes.append(newIncomeItem);
        }

        for (const expense of expensesData) {
            const newExpenseItem = document.createElement('div');
            newExpenseItem.innerHTML = this.createFinance(expense.id, expense.description, Math.abs(expense.value), 'expenses');
            this.listExpenses.append(newExpenseItem);
        }

        this.totalValue = this.calculateTotalValue();
        this.financeHeadingVisibility();
    }

    addFinance() {
        const description = this.budgetDescription.value.trim();
        const value = Number(this.budgetValue.value);
        const id = `finance-${Date.now()}`;

        if (!this.isActive && this.isValidInput(description, value) && !this.isEditing) {
            this.headingExpenses.style.display = 'block';
            const newFinanceItem = document.createElement('div');
            newFinanceItem.innerHTML = this.createFinance(id, description, value, 'expenses');

            this.listExpenses.append(newFinanceItem);
            this.numberOfExpensesItems++;
            this.totalValue -= value;

            this.budgetDescription.value = '';
            this.budgetValue.value = '';
        } else if (this.isActive && this.isValidInput(description, value) && !this.isEditing) {
            this.headingIncomes.style.display = 'block';
            const newFinanceItem = document.createElement('div');
            newFinanceItem.innerHTML = this.createFinance(id, description, value, 'incomes');

            this.listIncomes.append(newFinanceItem);
            this.numberOfIncomesItems++;
            this.totalValue += value;

            this.budgetDescription.value = '';
            this.budgetValue.value = '';
            this.toggleActiveState();
        }

        this.financeHeadingVisibility();
        this.saveDataToLocalStorage();
    }

    deleteFinance(id, type) {
        const financeItem = document.getElementById(id);
        const valueElement = financeItem.querySelector('.item__values');

        const value = Number(valueElement.textContent);

        if (value > 0) {
            this.totalValue -= value;
        } else if (value < 0) {
            this.totalValue += Math.abs(value);
        }

        financeItem.remove();
        if (type === 'incomes') {
            this.numberOfIncomesItems--;
        } else if (type === 'expenses') {
            this.numberOfExpensesItems--;
        }

        this.financeHeadingVisibility();
        this.saveDataToLocalStorage();
    }

    editFinance(id, type) {
        this.isEditing = true;
        const financeItem = document.getElementById(id);
        const descriptionElement = financeItem.querySelector('.item__description');
        const valueElement = financeItem.querySelector('.item__values');

        const originalDescription = descriptionElement.textContent;
        const originalValue = Number(valueElement.textContent);

        this.budgetDescription.value = originalDescription;
        this.budgetValue.value = Math.abs(originalValue);

        const handleBudgetCheckClickDuringEdit = () => {
            const editedDescription = this.budgetDescription.value.trim();
            const editedValue = Number(this.budgetValue.value);
            const typeValue = type === 'incomes' ? editedValue : -editedValue;

            if (this.isValidInput(editedDescription, editedValue)) {
                this.totalValue = this.totalValue - originalValue + typeValue;
                descriptionElement.textContent = editedDescription;
                valueElement.textContent = type === 'incomes' ? `${this.formatNumberWithTwoDecimals(editedValue)}` : `-${this.formatNumberWithTwoDecimals(editedValue)}`;

                this.budgetDescription.value = '';
                this.budgetValue.value = '';

                this.isEditing = false;
                this.financeHeadingVisibility();
            }

            this.budgetCheck.removeEventListener('click', handleBudgetCheckClickDuringEdit);
            this.budgetDescription.removeEventListener('keydown', handleBudgetDescriptionKeydown);
            this.budgetValue.removeEventListener('keydown', handleBudgetValueKeydown);

            if (this.isEditing) {
                this.budgetCheck.addEventListener('click', handleBudgetCheckClickDuringEdit);
                this.budgetDescription.addEventListener('keydown', handleBudgetDescriptionKeydown);
                this.budgetValue.addEventListener('keydown', handleBudgetValueKeydown);
            } else {
                this.toggleActiveState();
                this.isActive = true;
                this.switchFinances();
                this.saveDataToLocalStorage();
            }
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

        if ((type === 'incomes' && !this.isActive) || (type === 'expenses' && this.isActive)) {
            this.toggleActiveState();
        }

        this.budgetCheck.addEventListener('click', handleBudgetCheckClickDuringEdit);
        this.budgetDescription.addEventListener('keydown', handleBudgetDescriptionKeydown);
        this.budgetValue.addEventListener('keydown', handleBudgetValueKeydown);
    }

    financeHeadingVisibility() {
        this.numberOfIncomesItems = this.listIncomes.querySelectorAll('.list__list').length;
        this.numberOfExpensesItems = this.listExpenses.querySelectorAll('.list__list').length;

        this.headingExpenses.style.display = this.numberOfExpensesItems > 0 ? 'block' : 'none';
        this.headingIncomes.style.display = this.numberOfIncomesItems > 0 ? 'block' : 'none';

        this.totalValue = this.calculateTotalValue();
        const formattedTotalValue = this.formatNumberWithTwoDecimals(this.totalValue);
        this.balanceValue.innerText = this.totalValue >= 0 ? `+${formattedTotalValue} PLN` : `${formattedTotalValue} PLN`;
        this.balanceValue.style.color = this.totalValue >= 0 ? 'var(--income-color)' : 'var(--expense-color)';

        this.saveDataToLocalStorage();
    }

    switchFinances() {
        this.toggleActiveState();
    }
}

const app = new BudgetApp();

