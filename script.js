// Format investment amount on input and blur
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

// Add input event listener for real-time formatting
document.getElementById('investmentAmount').addEventListener('input', function(e) {
    formatInvestmentAmount(this);
});

// Keep blur event for when focus is lost
document.getElementById('investmentAmount').addEventListener('blur', function(e) {
    formatInvestmentAmount(this);
});

document.getElementById('investmentForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get input values
    const investmentAmount = parseFloat(document.getElementById('investmentAmount').value);
    const annualInterest = parseFloat(document.getElementById('annualInterest').value) / 100;
    const months = parseInt(document.getElementById('months').value);
    
    // Validate inputs
    if (isNaN(investmentAmount) || investmentAmount <= 0) {
        alert('Please enter a valid investment amount');
        return;
    }
    if (isNaN(annualInterest) || annualInterest < 0) {
        alert('Please enter a valid interest rate');
        return;
    }
    if (isNaN(months) || months <= 0) {
        alert('Please enter a valid number of months');
        return;
    }

    // Calculate simple interest
    const simpleInterest = months * investmentAmount * annualInterest / 12;
    document.getElementById('simpleInterest').textContent = `$${simpleInterest.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;

    // Calculate monthly interest rate
    const monthlyInterest = annualInterest / 12;
    
    // Clear previous results
    document.getElementById('monthlyDetails').innerHTML = '';
    
    // Calculate compound interest and show monthly breakdown
    let currentAmount = investmentAmount;
    for (let i = 1; i <= months; i++) {
        const interestEarned = currentAmount * monthlyInterest;
        currentAmount += interestEarned;
        
        // Create monthly detail row
        const detailRow = document.createElement('div');
        detailRow.className = 'monthly-detail';
        detailRow.innerHTML = `
            <span>Month ${i}:</span>
            <span>Interest: $${interestEarned.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            <span>Total: $${currentAmount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
        `;
        document.getElementById('monthlyDetails').appendChild(detailRow);
    }
    
    // Calculate and display final yield
    const yieldAmount = currentAmount - investmentAmount;
    document.getElementById('totalYield').textContent = `$${yieldAmount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    
    // Calculate and display the difference
    const difference = yieldAmount - simpleInterest;
    document.getElementById('difference').textContent = `$${difference.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
});
