// Define default rates
let rates = {
    under_high_school: 5,
    above_high_school: 10
};

// Function to calculate payment based on student age and hours worked
function calculatePayment() {
    // Fetch input values
    let studentName = document.getElementById('student-name').value;
    let studentAge = document.getElementById('student-age').value;
    let hoursInput = document.getElementById('hours-input').value.trim();

    // Convert hours input to total hours worked
    let totalHours = calculateTotalHours(hoursInput);

    if (totalHours === null) {
        return; // Exit function if input is invalid
    }

    // Define rate per hour based on student age
    let ratePerHour = (studentAge === 'under_high_school') ? rates.under_high_school : rates.above_high_school;

    // Calculate payment
    let paymentAmount = ratePerHour * totalHours;

    // Display result
    let paymentResult = document.getElementById('payment-result');
    paymentResult.innerHTML = `<p><strong>${studentName}</strong> למד ${totalHours.toFixed(2)} שעות. סך כל התשלום: ₪${paymentAmount.toFixed(2)}</p>`;

    // Reset form fields
    document.getElementById('student-name').value = '';
    document.getElementById('student-age').value = 'under_high_school';
    document.getElementById('hours-input').value = '';

    // Add payment summary to manager's view
    addPaymentSummary(studentName, totalHours, paymentAmount, studentAge);

    // Save data to localStorage
    saveDataLocally();
}

// Function to calculate total hours from input
function calculateTotalHours(input) {
    let hoursArray = input.split('+');
    let totalHours = 0;

    for (let i = 0; i < hoursArray.length; i++) {
        let hoursStr = hoursArray[i].trim();
        let isMinutes = hoursStr.endsWith('m');
        let hours = parseFloat(hoursStr);

        if (isMinutes) {
            hours /= 60; // Convert minutes to hours
        }

        if (isNaN(hours)) {
            alert('שעות לא תקינות. אנא הזן מספרים תקינים מופרדים ב-+.');
            return null;
        }

        totalHours += hours;
    }

    return totalHours;
}

// Function to add payment summary to manager's view
function addPaymentSummary(studentName, totalHours, paymentAmount, studentAge) {
    // Create a new card element
    let card = document.createElement('div');
    card.classList.add('card', 'mb-3');

    // Card body
    let cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    // Card title and text
    let cardTitle = document.createElement('h5');
    cardTitle.classList.add('card-title');
    cardTitle.textContent = studentName;

    let cardText = document.createElement('p');
    cardText.classList.add('card-text');
    cardText.innerHTML = `סך כל השעות: ${totalHours.toFixed(2)}<br>תשלום: ₪${paymentAmount.toFixed(2)}<br> ${studentAge === 'under_high_school' ? 'ישיבה קטנה' : 'יש"ג'}`;

    // Mark as paid button
    let paidButton = document.createElement('button');
    paidButton.classList.add('btn', 'btn-secondary', 'float-right', 'ml-2');
    paidButton.textContent = 'שולם';
    paidButton.onclick = function() {
        if (!card.classList.contains('bg-secondary')) {
            card.classList.add('bg-secondary'); // Dark grey background
            cardText.innerHTML += '<br><strong style="color: red;">שולם</strong>'; // Red "Paid" text
            updateTotal();
            saveDataLocally(); // Save after updating
        }
    };

    // Delete button
    let deleteButton = document.createElement('button');
    deleteButton.classList.add('btn', 'btn-danger', 'float-right');
    deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
    deleteButton.onclick = function() {
        if (confirm(`למחוק את הכרטיס של ${studentName}?`)) {
            card.remove();
            updateTotal();
            saveDataLocally(); // Save after updating
        }
    };

    // Append elements to card body
    cardBody.appendChild(deleteButton);
    cardBody.appendChild(paidButton);
    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardText);

    // Append card body to card
    card.appendChild(cardBody);

    // Append card to summary list
    let summaryList = document.getElementById('summary-list');
    summaryList.appendChild(card);

    // Update totals
    updateTotal();

    // Save data to localStorage
    saveDataLocally();
}

// Function to update totals on the manager's view
function updateTotal() {
    let cards = document.querySelectorAll('#summary-list .card');
    let totalHours = 0;
    let totalPayment = 0;
    let totalPaymentUnder = 0;
    let totalPaymentAbove = 0;
    let totalPaidUnder = 0;
    let totalPaidAbove = 0;

    cards.forEach(card => {
        let hours = parseFloat(card.querySelector('.card-text').innerHTML.split('סך כל השעות: ')[1].split('<br>')[0]);
        let payment = parseFloat(card.querySelector('.card-text').innerHTML.split('תשלום: ₪')[1].split('<br>')[0]);
        let studentAge = card.querySelector('.card-text').innerHTML.includes('ישיבה קטנה') ? 'under_high_school' : 'above_high_school';
        let isPaid = card.querySelector('.card-text').innerHTML.includes('<strong style="color: red;">שולם</strong>');

        totalHours += hours;
        totalPayment += payment;

        if (studentAge === 'under_high_school') {
            totalPaymentUnder += payment;
            if (isPaid) {
                totalPaidUnder += payment;
            }
        } else {
            totalPaymentAbove += payment;
            if (isPaid) {
                totalPaidAbove += payment;
            }
        }
    });

    // Update totals on the screen
    document.getElementById('total-hours').textContent = totalHours.toFixed(1);
    document.getElementById('total-payment').textContent = totalPayment.toFixed(2);
    document.getElementById('total-payment-under').textContent = totalPaymentUnder.toFixed(2);
    document.getElementById('total-payment-above').textContent = totalPaymentAbove.toFixed(2);
    document.getElementById('total-paid-under').textContent = totalPaidUnder.toFixed(2);
    document.getElementById('total-paid-above').textContent = totalPaidAbove.toFixed(2);

    // Save data to localStorage after updating totals
    saveDataLocally();
}

// Function to save data to localStorage
function saveDataLocally() {
    let cards = document.querySelectorAll('#summary-list .card');
    let savedData = [];

    cards.forEach(card => {
        let studentName = card.querySelector('.card-title').textContent;
        let totalHours = parseFloat(card.querySelector('.card-text').innerHTML.split('סך כל השעות: ')[1].split('<br>')[0]);
        let paymentAmount = parseFloat(card.querySelector('.card-text').innerHTML.split('תשלום: ₪')[1].split('<br>')[0]);
        let studentAge = card.querySelector('.card-text').innerHTML.includes('ישיבה קטנה') ? 'under_high_school' : 'above_high_school';
        let isPaid = card.querySelector('.card-text').innerHTML.includes('<strong style="color: red;">שולם</strong>');

        savedData.push({
            studentName: studentName,
            totalHours: totalHours,
            paymentAmount: paymentAmount,
            studentAge: studentAge,
            isPaid: isPaid
        });
    });

    // Store data in localStorage
    localStorage.setItem('paymentData', JSON.stringify(savedData));
}

// Function to load data from localStorage on page load
function loadDataFromStorage() {
    let savedData = JSON.parse(localStorage.getItem('paymentData'));

    if (savedData) {
        savedData.forEach(data => {
            addPaymentSummary(data.studentName, data.totalHours, data.paymentAmount, data.studentAge);

            // Mark as paid if necessary
            if (data.isPaid) {
                let cards = document.querySelectorAll('#summary-list .card');
                cards.forEach(card => {
                    let cardTitle = card.querySelector('.card-title').textContent;
                    if (cardTitle === data.studentName) {
                        card.classList.add('bg-secondary'); // Dark grey background
                        let cardText = card.querySelector('.card-text');
                        if (!cardText.innerHTML.includes('<strong style="color: red;">שולם</strong>')) {
                            cardText.innerHTML += '<br><strong style="color: red;">שולם</strong>'; // Red "Paid" text
                        }
                    }
                });
            }
        });
    }
}

// Initialize function to load data from localStorage on page load
loadDataFromStorage();

// Function to search for a student card by name
function searchStudentCard() {
    let searchInput = document.getElementById('search-input').value.toLowerCase();
    let cards = document.querySelectorAll('#summary-list .card');

    cards.forEach(card => {
        let cardTitle = card.querySelector('.card-title').textContent.toLowerCase();

        if (cardTitle.includes(searchInput)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Function to clear the search and show all cards
function clearSearch() {
    document.getElementById('search-input').value = '';
    let cards = document.querySelectorAll('#summary-list .card');
    cards.forEach(card => {
        card.style.display = 'block';
    });
}

// Function to update rates
function updateRates() {
    let underRate = parseFloat(document.getElementById('under-rate').value);
    let aboveRate = parseFloat(document.getElementById('above-rate').value);

    if (!isNaN(underRate) && !isNaN(aboveRate)) {
        rates.under_high_school = underRate;
        rates.above_high_school = aboveRate;
        alert('תעריפים עודכנו בהצלחה!');
    } else {
        alert('אנא הזן תעריפים תקינים.');
    }
}

// Initialize tooltips
$(function () {
    $('[data-toggle="tooltip"]').tooltip()
});
