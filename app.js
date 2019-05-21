// * Module that handles the budget data
// IIFE
var budgetController = (function () {

    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var allExpenses = [];
    var allIncomes = [];
    var totalExpenses = 0;

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        total: {
            exp: 0,
            inc: 0

        }
    };

    return {
        addItem: function (type, des, val) {
            var newItem, ID;

            // ? Create new id
            if (data.allItems[type].length > 0)
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            else
                ID = 0;

            // ? Create new item based on type
            if (type === 'exp')
                newItem = new Expense(ID, des, val);
            else if (type === 'inc')
                newItem = new Income(ID, des, val);

            // ? push into dataStructure

                data.allItems[type].push(newItem);

            return newItem;
        },
        testing: function () {
            console.log(data);
        }
    }
})();

// * UI Controller
var UIController = (function () {

    // ? Because of better refactoring and potential
    var DOMinputs = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn'
    };


    return {
        getInput: function () {
            // ? returning an object, only way to return more than 1 thing at a time
            return {
                type: document.querySelector(DOMinputs.inputType).value, // * will be either inc or exp
                description: document.querySelector(DOMinputs.inputDescription).value,
                value: document.querySelector(DOMinputs.inputValue).value
            }

        },

        getDOMput: function () {
            return DOMinputs;
        }


    }
})();

// * Global App Controller
var controller = (function (budgetCtrl, UICtrl) {

    var setupEventListeners = function () {
        var DOM = UICtrl.getDOMput();
        document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function (event) {
            if (event.key === 'Enter')
                ctrlAddItem();

        });

    };
    var ctrlAddItem = function () {
        var input, newItem;
        // * 1) Get the field input data

        input = UICtrl.getInput();
        console.log(input);
        // * 2) Add the item to the budget controller

        newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        // * 3) Add the item to the UI
        // * 4) Calculate the budget
        // * 5) Display the budget on the UI
    };

    return {
        init: function () {
            console.log('App has started');
            setupEventListeners();
        }
    }

    // ? passing the other 2 modules as arguments
})(budgetController, UIController);

// * where all the code can be executed right at the beginning when the application starts
controller.init();