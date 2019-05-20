// * Module that handles the budget data
// IIFE
var budgetController = (function () {

})();

// * UI Controller
var UIController = (function(){

    // ? Because of better refactoring and potential
    var DOMinputs = {
        inputType : '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn'
    };


    return{
        getInput: function () {
            // ? returning an object, only way to return more than 1 thing at a time
            return{
                 type: document.querySelector(DOMinputs.inputType).value, // * will be either inc or exp
                 description: document.querySelector(DOMinputs.inputDescription).value,
                 value: document.querySelector(DOMinputs.inputValue).value
            }

        },

        getDOMput : function () {
            return DOMinputs;
        }



    }
})();

// * Global App Controller
var controller = (function (budgetCtrl, UICtrl) {

    var DOM = UICtrl.getDOMput();
    var ctrlAddItem = function(){
        // * 1) Get the field input data

        var input = UICtrl.getInput();
        console.log(input);
        // * 2) Add the item to the budget controller
        // * 3) Add the item to the UI
        // * 4) Calculate the budget
        // * 5) Display the budget on the UI
    };

    document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function (event) {
        if(event.key === 'Enter')
            ctrlAddItem();

    });

    // ? passing the other 2 modules as arguments
})(budgetController, UIController);