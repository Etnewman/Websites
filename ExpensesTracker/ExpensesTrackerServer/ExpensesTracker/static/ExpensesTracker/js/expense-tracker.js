var runningTotal = 0;

document.getElementById("saveButton").addEventListener("click", function() {
    // Call saveExpenses function with dynamic data
    saveExpensesDynamicData();
});

        function addExpense() {
            var expenseNameInput = document.getElementById("expenseName");
            var expenseAmountInput = document.getElementById("expenseAmount");

            var expenseName = expenseNameInput.value;
            var expenseAmount = parseFloat(expenseAmountInput.value);

            if (expenseName && !isNaN(expenseAmount) && expenseAmount >= 0) {
                var table = document.getElementById("expenseTable").getElementsByTagName('tbody')[0];
                var newRow = table.insertRow(table.rows.length);

                var cell1 = newRow.insertCell(0);
                var cell2 = newRow.insertCell(1);
                var cell3 = newRow.insertCell(2);
                var cell4 = newRow.insertCell(3);

                cell1.innerHTML = expenseName;
                cell2.innerHTML = "$" + expenseAmount.toFixed(2);
                cell3.innerHTML = '<button type="button" onclick="deleteExpense(this)">Delete</button>';

                // Update running total
                runningTotal += expenseAmount;
                cell4.innerHTML = "$" + runningTotal.toFixed(2);

                // Update the running total display
                document.getElementById("runningTotal").innerHTML = "Running Total: $" + runningTotal.toFixed(2);

                // Clear input fields after adding an expense
                expenseNameInput.value = "";
                expenseAmountInput.value = "";
            } else {
                alert("Please enter a valid expense name and a non-negative amount.");
            }
        }

        function deleteExpense(button) {
            var row = button.parentNode.parentNode;
            var amountCell = row.cells[1];
            var amount = parseFloat(amountCell.innerHTML.substring(1)); // Remove the "$" sign
            runningTotal -= amount;

            // Update the running total display
            document.getElementById("runningTotal").innerHTML = "Running Total: $" + runningTotal.toFixed(2);

            row.parentNode.removeChild(row);
        }

        function saveExpenses(expenses) {
            // Gather the running total from the last cell of the table
            var runningTotal = document.getElementById("runningTotal").innerText.replace("Running Total: $", "");
            var data = {
                'expenses': expenses,
                'runningTotal': parseFloat(runningTotal),
            };
            // Use AJAX to send data to the server
            fetch('/ExpensesTracker/save_expense/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken'),  // Include CSRF token for Django
                },
                body: JSON.stringify(data),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Handle the response from the server (if needed)
                console.log('Expenses saved successfully:', data);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
        }
        
        function saveExpensesDynamicData() {
            // Loop through the table rows and gather dynamic data
            var expenseRows = document.getElementById("expenseTable").getElementsByTagName("tbody")[0].getElementsByTagName("tr");
            var expenseList = []; // Initialize an empty array to store multiple entries
        
            for (var i = 0; i < expenseRows.length; i++) {
                var cells = expenseRows[i].getElementsByTagName("td");
                var expenseName = cells[0].innerHTML;
                var expenseAmountString = cells[1].innerHTML.substring(1);
                var expenseAmount = parseFloat(expenseAmountString);
        
                // Add the data to the expenseList array
                expenseList.push({ name: expenseName, amount: expenseAmount });
            }
            var runningTotal = calculateRunningTotal(expenseList);

            // Call saveExpenses with the gathered dynamic data and running total
            saveExpenses(expenseList, runningTotal);
        }
        
        function calculateRunningTotal(expenses) {
            // Calculate the running total from the array of expenses
            var total = 0;
            for (var i = 0; i < expenses.length; i++) {
                total += expenses[i].amount;
            }
            return total;
        }

        // Function to get CSRF token from cookies (needed for Django)
        function getCookie(name) {
            var cookieValue = null;
            if (document.cookie && document.cookie !== '') {
                var cookies = document.cookie.split(';');
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = cookies[i].trim();
                    // Check if the cookie name starts with the specified name
                    if (cookie.substring(0, name.length + 1) === (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        }