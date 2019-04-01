// * Module that handles the budget data
// IIFE
var budgetController = (function () {

})();

// * UI Controller
var UIController = (function(){

})();

// * Global App Controller
var controller = (function (budgetCtrl, UICtrl) {

    var ctrlAddItem = function(){
        // * 1) Get the field input data
        // * 2) Add the item to the budget controller
        // * 3) Add the item to the UI
        // * 4) Calculate the budget
        // * 5) Display the budget on the UI
    };

    document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function (event) {
        if(event.key === 'Enter')
            ctrlAddItem();

    });

    // ? passing the other 2 modules as arguments
})(budgetController, UIController);