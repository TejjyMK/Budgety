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
        inputButton: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list'
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

        addList: function (obj, type) {
            // ? create html string with placeholder text
            var html, newHtml,element;

            if (type === 'inc') {
                element = DOMinputs.incomeContainer;
                html = '  <div class="item clearfix" id="income-%id%">\n' +
                    '       <div class="item__description">%description%</div>\n' +
                    '       <div class="right clearfix">\n' +
                    '            <div class="item__value">+ %value%</div>\n' +
                    '            <div class="item__delete">\n' +
                    '                <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>\n' +
                    '            </div>\n' +
                    '        </div>\n' +
                    '    </div>';
            } else if (type === 'exp') {
                element = DOMinputs.expensesContainer;
                html = '<div class="item clearfix" id="expense-%id%">\n' +
                    '       <div class="item__description">%description%</div>\n' +
                    '       <div class="right clearfix">\n' +
                    '            <div class="item__value">- %value%</div>\n' +
                    '            <div class="item__percentage">21%</div>\n' +
                    '            <div class="item__delete">\n' +
                    '                 <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>\n' +
                    '            </div>\n' +
                    '        </div>\n' +
                    '   </div> ';
            }

            // ? replace the placeholder text with actual data

            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            // ? Insert the HTML into the DOM

            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);

        },

        clearFields: function(){
            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMinputs.inputDescription+', '+ DOMinputs.inputValue);

            // ? converting the list into an Array
            fieldsArr = Array.prototype.slice.call(fields);

            // ? clears the fields
            fieldsArr.forEach(function (current, index, array) {
                current.value="";
            });

            // ? so that it focuses on the description bit
            fieldsArr[0].focus();
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

        UICtrl.addList(newItem, input.type);

        // ? Gotta clear the fields
        UICtrl.clearFields();


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