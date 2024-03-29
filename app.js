// * Module that handles the budget data
// IIFE
var budgetController = (function () {

    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercent = function (totalIncome) {
        if (totalIncome > 0)
            this.percentage = Math.round((this.value / totalIncome) * 100);
        else
            this.percentage = -1;
    };

    Expense.prototype.getPercent = function () {
        return this.percentage;
    };

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function (type) {
        var sum = 0;

        data.allItems[type].forEach(function (current) {
            sum += current.value;
        });

        data.total[type] = sum;


    };


    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        total: {
            exp: 0,
            inc: 0

        },
        budget: 0,
        percentage: -1
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
        deleteItem: function (type, id) {
            var ids, index;
            ids = data.allItems[type].map(function (current) {
                return current.id;
            });

            index = ids.indexOf(id);

            if (index !== -1)
                data.allItems[type].splice(index, 1)

        }
        ,
        calculateBudget: function () {
            // ? calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            // ? calculate the budget : income - expenses
            data.budget = data.total.inc - data.total.exp;

            // ? Calculate the percentage of income that has been spent
            if (data.total.inc > 0)
                data.percentage = Math.round((data.total.exp / data.total.inc) * 100);
            else
                data.percentage = -1;
        },
        calculatePercentages: function () {

            data.allItems.exp.forEach(function (current) {
                current.calcPercent(data.total.inc);
            });
        },
        getPercentage: function () {
            return data.allItems.exp.map(function (current) {
                return current.getPercent();
            });
        }
        ,
        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.total.inc,
                totalExp: data.total.exp,
                percentage: data.percentage
            }

        }
        ,
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
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercentLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };

    var formatNumber = function (num, type) {
        var numSplit, int, decimal, numberOfCommas;

        num = Math.abs(num);

        // * exactly 2 decimal points
        num = num.toFixed(2);

        // * comma separating the thousands
        numSplit = num.split('.');
        int = numSplit[0];
        if (int.length > 3) {
            // ? First find the number of commas to be added.
            numberOfCommas = Math.floor((int.length - 1) / 3);

            /*
             ? Then iterate over the string to add commas at the
             ? right position while keeping in mind that every iteration will make the string longer.
            */
            for (var i = 0; i < numberOfCommas; i++) {
                var position = 3 + 3 * i + i;
                int = int.slice(0, -position) + ',' + int.slice(-position);
            }
        }

        decimal = numSplit[1];

        // * + or - before number
        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + decimal;

    };

    var nodeListForEach = function (list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };


    return {
        getInput: function () {
            // ? returning an object, only way to return more than 1 thing at a time
            return {
                type: document.querySelector(DOMinputs.inputType).value, // * will be either inc or exp
                description: document.querySelector(DOMinputs.inputDescription).value,
                value: parseFloat(document.querySelector(DOMinputs.inputValue).value) // ? this will convert a string to float
            }

        },

        addList: function (obj, type) {
            // ? create html string with placeholder text
            var html, newHtml, element;

            if (type === 'inc') {
                element = DOMinputs.incomeContainer;
                html = '  <div class="item clearfix" id="inc-%id%">\n' +
                    '       <div class="item__description">%description%</div>\n' +
                    '       <div class="right clearfix">\n' +
                    '            <div class="item__value">%value%</div>\n' +
                    '            <div class="item__delete">\n' +
                    '                <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>\n' +
                    '            </div>\n' +
                    '        </div>\n' +
                    '    </div>';
            } else if (type === 'exp') {
                element = DOMinputs.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%">\n' +
                    '       <div class="item__description">%description%</div>\n' +
                    '       <div class="right clearfix">\n' +
                    '            <div class="item__value">%value%</div>\n' +
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
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

            // ? Insert the HTML into the DOM

            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },
        deleteListItem: function (selectorID) {
            var element;
            element = document.getElementById(selectorID);
            element.parentNode.removeChild(element);
        }
        ,

        clearFields: function () {
            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMinputs.inputDescription + ', ' + DOMinputs.inputValue);

            // ? converting the list into an Array
            fieldsArr = Array.prototype.slice.call(fields);

            // ? clears the fields
            fieldsArr.forEach(function (current) {
                current.value = "";
            });

            // ? so that it focuses on the description bit
            fieldsArr[0].focus();
        },
        displayBudget: function (object) {
            var type;
            object.budget > 0 ? type = 'inc' : type = 'exp';
            document.querySelector(DOMinputs.budgetLabel).textContent = formatNumber(object.budget, type);
            document.querySelector(DOMinputs.incomeLabel).textContent = formatNumber(object.totalInc, 'inc');
            document.querySelector(DOMinputs.expensesLabel).textContent = formatNumber(object.totalExp, 'exp');

            if (object.percentage > 0)
                document.querySelector(DOMinputs.percentageLabel).textContent = object.percentage + '%';
            else
                document.querySelector(DOMinputs.percentageLabel).textContent = '--';


        }
        ,
        displayPercentages: function (percentages) {
            // ? returns a node list
            var fields = document.querySelectorAll(DOMinputs.expensesPercentLabel);


            nodeListForEach(fields, function (current, index) {
                if (percentages[index] > 0)
                    current.textContent = percentages[index] + '%';
                else
                    current.textContent = '--';

            });
        }
        ,
        displayMonth: function () {
            var now, year, month, monthNames;
            monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];
            now = new Date();
            month = now.getMonth();
            year = now.getFullYear();
            document.querySelector(DOMinputs.dateLabel).textContent = monthNames[month] + ' ' + year;
        }
        ,
        changedType: function () {
            // ? returns nodelist, so cant use forEach

            var fields = document.querySelectorAll(
                DOMinputs.inputType + ' ,'+
                         DOMinputs.inputDescription + ' ,' +
                         DOMinputs.inputValue
            );

            nodeListForEach(fields,function (current) {
                current.classList.toggle('red-focus');
            });

            document.querySelector(DOMinputs.inputButton).classList.toggle('red');
        }
        ,

        getDOMput: function () {
            return DOMinputs;
        }


    };
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

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        document.querySelector(DOM.inputType).addEventListener('change',UICtrl.changedType) ;

    };

    var updateBudget = function () {
        // * 4) Calculate the budget
        budgetCtrl.calculateBudget();


        // * 5) Return the budget
        var budget = budgetCtrl.getBudget();

        // * 6) Display the budget on the UI
        UICtrl.displayBudget(budget);
    };

    var updatePercentages = function () {
        // * 1) Calculate percentages
        budgetCtrl.calculatePercentages();

        // * 2) Read percentages from the budget controller
        var percentages = budgetCtrl.getPercentage();

        // * 3) Update the UI with the new percentages
        UICtrl.displayPercentages(percentages);

    };
    var ctrlAddItem = function () {
        var input, newItem;
        // * 1) Get the field input data

        input = UICtrl.getInput();
        console.log(input);

        // ? Validity checks
        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            // * 2) Add the item to the budget controller

            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            // * 3) Add the item to the UI

            UICtrl.addList(newItem, input.type);

            // ? Gotta clear the fields
            UICtrl.clearFields();

            // * 4) Calculate and update the budget
            updateBudget();

            // * 5) Calculate and update the percentages
            updatePercentages();
        }


    };

    var ctrlDeleteItem = function (event) {
        var itemID, splitID, type, ID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {
            splitID = itemID.split('-');
            type = splitID[0];
            // ? if not it reads as a string
            ID = parseInt(splitID[1]);
            // * 1 Delete the item from the data structure
            budgetCtrl.deleteItem(type, ID);

            // * 2 Delete the item from the UI
            UICtrl.deleteListItem(itemID);

            // * 3 Update and show the new budget
            updateBudget();

            // * 4 Calculate and update the percentages
            updatePercentages();

        }
    };

    return {
        init: function () {
            console.log('App has started');
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    }

    // ? passing the other 2 modules as arguments
})(budgetController, UIController);

// * where all the code can be executed right at the beginning when the application starts
controller.init();