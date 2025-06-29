// Format appliance cost on input and blur
function formatInvestmentAmount(input) {
    if (input.value === '') {
        document.getElementById('formattedAmount').textContent = '';
        return;
    }
    
    let value = input.value.replace(/,/g, ''); // Remove any existing commas
    value = Number(value); // Convert to number
    if (!isNaN(value) && value >= 0) {
        // Display formatted value in the span
        const formattedValue = value.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        document.getElementById('formattedAmount').textContent = `$${formattedValue}`;
    }
}

// Calculate monthly savings from optional fields
function calculateMonthlySavings() {
    const currentCost = parseFloat(document.getElementById('currentMonthlyCost').value);
    const savingsPercent = parseFloat(document.getElementById('monthlySavingsPercent').value);
    
    if (!isNaN(currentCost) && !isNaN(savingsPercent) && currentCost > 0 && savingsPercent > 0) {
        const calculatedSavings = (currentCost * savingsPercent) / 100;
        document.getElementById('annualInterest').value = calculatedSavings.toFixed(2);
    }
}

// Add input event listener for real-time formatting
document.getElementById('investmentAmount').addEventListener('input', function(e) {
    formatInvestmentAmount(this);
});

// Keep blur event for when focus is lost
document.getElementById('investmentAmount').addEventListener('blur', function(e) {
    formatInvestmentAmount(this);
});

// Add event listeners for optional fields
document.getElementById('currentMonthlyCost').addEventListener('input', calculateMonthlySavings);
document.getElementById('monthlySavingsPercent').addEventListener('input', calculateMonthlySavings);

document.getElementById('investmentForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get input values
    const applianceCost = parseFloat(document.getElementById('investmentAmount').value);
    let monthlySavings = parseFloat(document.getElementById('annualInterest').value);
    
    // Check if we should calculate monthly savings from optional fields
    const currentCost = parseFloat(document.getElementById('currentMonthlyCost').value);
    const savingsPercent = parseFloat(document.getElementById('monthlySavingsPercent').value);
    
    if (!isNaN(currentCost) && !isNaN(savingsPercent) && currentCost > 0 && savingsPercent > 0) {
        // Use calculated monthly savings from optional fields
        monthlySavings = (currentCost * savingsPercent) / 100;
    }
    
    // Validate inputs
    if (isNaN(applianceCost) || applianceCost <= 0) {
        alert('Please enter a valid appliance cost');
        return;
    }
    if (isNaN(monthlySavings) || monthlySavings <= 0) {
        alert('Please enter a valid monthly savings amount or provide current cost and savings percentage');
        return;
    }

    // Calculate months to payoff
    const monthsToPayoff = Math.ceil(applianceCost / monthlySavings);
    const yearsToPayoff = monthsToPayoff / 12;
    
    // Calculate total savings after payoff
    const totalSavingsAfterPayoff = (monthsToPayoff * monthlySavings) - applianceCost;
    
    // Display results
    document.getElementById('totalYield').textContent = monthsToPayoff;
    
    // Format years display
    const formattedYears = yearsToPayoff % 1 === 0 ? yearsToPayoff : yearsToPayoff.toFixed(1);
    document.getElementById('simpleInterest').textContent = formattedYears;
    
    document.getElementById('difference').textContent = `$${totalSavingsAfterPayoff.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    
    // Clear previous results
    document.getElementById('monthlyDetails').innerHTML = '';
    
    // Show monthly breakdown
    let remainingCost = applianceCost;
    for (let i = 1; i <= Math.min(monthsToPayoff, 24); i++) { // Show max 24 months to avoid too much output
        const savingsThisMonth = Math.min(monthlySavings, remainingCost);
        remainingCost -= savingsThisMonth;
        
        // Create monthly detail row
        const detailRow = document.createElement('div');
        detailRow.className = 'monthly-detail';
        
        if (remainingCost <= 0) {
            detailRow.innerHTML = `
                <span>Month ${i}:</span>
                <span>Savings: $${savingsThisMonth.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                <span>PAID OFF!</span>
            `;
        } else {
            detailRow.innerHTML = `
                <span>Month ${i}:</span>
                <span>Savings: $${savingsThisMonth.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                <span>Remaining: $${remainingCost.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            `;
        }
        document.getElementById('monthlyDetails').appendChild(detailRow);
        
        // Stop if paid off
        if (remainingCost <= 0) {
            break;
        }
    }
    
    // Add note if more months exist
    if (monthsToPayoff > 24) {
        const noteRow = document.createElement('div');
        noteRow.className = 'monthly-detail';
        noteRow.innerHTML = `
            <span colspan="3" style="text-align: center; color: #666; font-style: italic;">
                ... and ${monthsToPayoff - 24} more months until payoff
            </span>
        `;
        document.getElementById('monthlyDetails').appendChild(noteRow);
    }
});
