/* JS in a single file separated with multiple controllers or "Modules".
Each are encapsulated and proctected using IIFE pattern
🔥MVC🔥
Controller = App Controller
View = UI Controller
Model = Budget Controller */

// Budget Controller
const budgetController = (() => {
  // Expense Function Constructor ** Expense Blueprint **
  const Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calcPercentage = function (totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };

  Expense.prototype.getPercentage = function () {
    return this.percentage;
  };

  // Income Function Constructor ** Income Blueprint **
  const Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  const calculateTotal = (type) => {
    let sum = 0;
    data.allItems[type].forEach((item) => {
      sum += item.value;
    });

    data.totals[type] = sum;
  };

  // Budget Data model
  const data = {
    allItems: {
      inc: [],
      exp: [],
    },
    totals: {
      inc: 0,
      exp: 0,
    },
    budget: 0,
    percentage: -1,
  };
  return {
    addItem: (type, desc, val) => {
      let newItem, id;

      // Random Unique ID
      id = "_" + Math.random().toString(36).substr(2, 9);

      if (type === "exp") {
        newItem = new Expense(id, desc, val);
      } else if (type === "inc") {
        newItem = new Income(id, desc, val);
      }

      // Push to Array
      data.allItems[type].push(newItem);

      // return the new item
      return newItem;
    },
    deleteItem: (type, id) => {
      const ids = data.allItems[type].map((item) => {
        return item.id;
      });

      const idx = ids.indexOf(id);

      if (idx !== -1) {
        // index to delete, no of item to delete
        data.allItems[type].splice(idx, 1);
      }
    },
    calculateBudget: () => {
      // calculate the totals
      calculateTotal("inc");
      calculateTotal("exp");

      // calculate the budget: income - expense
      data.budget = data.totals.inc - data.totals.exp;

      // calculate the percentage
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },
    calculatePercentage: () => {
      data.allItems.exp.forEach((item) => {
        item.calcPercentage(data.totals.inc);
      });
    },
    getBudget: () => {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage,
      };
    },
    getPercentage: () => {
      let allPercentage = data.allItems.exp.map((item) => {
        return { id: item.id, percentage: item.getPercentage() };
      });
      return allPercentage;
    },
    testFunc: () => {
      console.log(data);
    },
  };
})();

// UI Controller

const UIController = (() => {
  // DOM Constants
  const DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputButton: ".add__btn",
    incomeList: ".income__list",
    expenseList: ".expenses__list",
    budgetLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expenseLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage",
    container: ".container",
    expPercentage: ".item__percentage",
    monthLabel: ".budget__title--month",
  };

  const nodeListForEach = function (list, callback) {
    for (var i = 0; i < list.length; i++) {
      callback(list[i], i);
    }
  };

  const formatNumber = (type, value) => {
    let numSplit, int, dec;

    value = Math.abs(value);
    value = value.toFixed(2);

    numSplit = value.split(".");

    int = numSplit[0];

    if (int.length > 3) {
      int = int.substr(0, int.length - 3) + "," + int.substr(int.length - 3, 3); //input 23510, output 23,510
    }

    dec = numSplit[1];

    return (type === "exp" ? "-" : "+") + " " + int + "." + dec;
  };
  return {
    getInput: () => {
      return {
        // inc or exp
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value),
      };
    },
    addListItem: (obj, type) => {
      let html, newHtml, element;

      // Create HTML String for placeholder
      if (type === "inc") {
        element = document.querySelector(DOMstrings.incomeList);

        html =
          '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === "exp") {
        element = document.querySelector(DOMstrings.expenseList);

        html =
          '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      // Replace placeholder with Obj value
      newHtml = html.replace("%id%", obj.id);
      newHtml = newHtml.replace("%description%", obj.description);
      newHtml = newHtml.replace("%value%", formatNumber(type, obj.value));

      // Add the HTML to DOM
      element.insertAdjacentHTML("beforeend", newHtml);
    },
    deleteListItem: (selectorId) => {
      const el = document.getElementById(selectorId);
      el.parentNode.removeChild(el);
    },
    clearFields: () => {
      const fields = document.querySelectorAll(
        DOMstrings.inputDescription + ", " + DOMstrings.inputValue
      );

      const fieldsArr = Array.prototype.slice.call(fields);

      fieldsArr.forEach((field, idx, array) => {
        field.value = "";
      });

      // Set focus to Description again
      fieldsArr[0].focus();
    },
    displayBudget: (obj) => {
      const type = obj.budget > 0 ? "inc" : "exp";
      document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(
        type,
        obj.budget
      );
      document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(
        "inc",
        obj.totalInc
      );
      document.querySelector(
        DOMstrings.expenseLabel
      ).textContent = formatNumber("exp", obj.totalExp);
      if (obj.percentage > 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent =
          obj.percentage + "%";
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = "---";
      }
    },
    displayPercentage: (obj) => {
      const nodeList = document.querySelectorAll(DOMstrings.expPercentage);

      nodeListForEach(nodeList, function (node, index) {
        const nodeItemId = node.parentNode.parentNode.id;
        const expId = nodeItemId.split("-")[1];
        const objItem = obj.filter(function (item) {
          return item.id === expId;
        })[0];
        if (objItem && objItem.percentage > 0) {
          node.textContent = objItem.percentage + "%";
        } else {
          node.textContent = "---";
        }
      });
    },
    displayMonth: () => {
      let now, months, mlist, year;
      now = new Date();
      year = now.getFullYear();

      mlist = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      document.querySelector(DOMstrings.monthLabel).textContent =
        mlist[now.getMonth()] + " of " + year;
    },
    changeType: () => {
      const fields = document.querySelectorAll(
        DOMstrings.inputType +
          ", " +
          DOMstrings.inputDescription +
          ", " +
          DOMstrings.inputValue
      );

      nodeListForEach(fields, (field) => {
        field.classList.toggle("red-focus");
      });

      document.querySelector(DOMstrings.inputButton).classList.toggle("red");
    },
    getDOMStrings: () => {
      return DOMstrings;
    },
  };
})();

// APP Controller
const appController = ((budgetCtlr, uiCtlr) => {
  let input, newItem;

  // Initialize Listeners
  const initListeners = () => {
    document.querySelector(DOM.inputButton).addEventListener("click", addItem);

    document
      .querySelector(DOM.inputValue)
      .addEventListener("keypress", function (event) {
        if (event.keyCode === 13 || event.which === 13) {
          addItem();
        }
      });

    document
      .querySelector(DOM.container)
      .addEventListener("click", ctrlDeleteItem);

    document
      .querySelector(DOM.inputType)
      .addEventListener("change", uiCtlr.changeType);
  };

  const DOM = uiCtlr.getDOMStrings();

  const updateBudget = () => {
    // Calculate Budget
    budgetController.calculateBudget();

    // Return Budget
    const budget = budgetController.getBudget();

    // Display Budget in UI
    uiCtlr.displayBudget(budget);
  };

  const updatePerentage = () => {
    // Calculate Percentage
    budgetController.calculatePercentage();

    // Read from Budget
    const allPercentage = budgetController.getPercentage();

    // Update the UI
    uiCtlr.displayPercentage(allPercentage);
  };

  const addItem = () => {
    // Get Input data
    input = uiCtlr.getInput();

    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      // Add data to budget Controller
      newItem = budgetCtlr.addItem(input.type, input.description, input.value);

      // Add Item in UI
      uiCtlr.addListItem(newItem, input.type);

      // Clear fields and set focus
      uiCtlr.clearFields();

      // Calculate and update budget
      updateBudget();

      // Calculate and update percentage
      updatePerentage();
    }
  };

  const ctrlDeleteItem = (event) => {
    let itemId, type, id;

    // Find target
    itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if (itemId) {
      type = itemId.split("-")[0];
      id = itemId.split("-")[1];
      console.log(itemId, type, id);
    }

    // Delete from DOM structure
    budgetController.deleteItem(type, id);

    // Delete from the UI
    uiCtlr.deleteListItem(itemId);

    // Recalculate the Budget
    updateBudget();

    // Calculate and update percentage
    updatePerentage();
  };
  return {
    init: () => {
      console.log("Application Started");
      uiCtlr.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1,
      });
      uiCtlr.displayMonth();
      initListeners();
    },
  };
})(budgetController, UIController);

// Starter
appController.init();
