// In ExpensesTracker/static/ExpensesTracker/js/data.js

document.addEventListener('DOMContentLoaded', function () {
    // Get data from the template using Django template tags
    var expensesData = JSON.parse('{{ expenses|json_script:"expensesData" }}');

    // Extract dates and amounts from the data
    var dates = expensesData.map(function (expense) {
        return expense.expense_set.timestamp;
    });

    var amounts = expensesData.map(function (expense) {
        return parseFloat(expense.amount);
    });

    // Create a Chart.js chart
    var ctx = document.getElementById('expenseChart').getContext('2d');
    var expenseChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Expenses Over Time',
                data: amounts,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: false,
            }],
        },
        options: {
            scales: {
                x: [{
                    type: 'time',
                    time: {
                        unit: 'day', // You can adjust the time unit based on your data
                    },
                }],
                y: {
                    beginAtZero: true,
                },
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                },
            },
        },
    });
});
