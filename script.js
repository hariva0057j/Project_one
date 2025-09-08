document.addEventListener('DOMContentLoaded', function() {
    
    const form = document.getElementById('attendanceForm');
    const totalClassesInput = document.getElementById('totalClasses');
    const attendedInput = document.getElementById('attended');
    const absentInput = document.getElementById('absent');
    const resetBtn = document.getElementById('resetBtn');
    const resultsContainer = document.getElementById('resultsContainer');

    // Auto-calculate absent classes
    function autoCalculateAbsent() {
        const total = parseInt(totalClassesInput.value) || 0;
        const attended = parseInt(attendedInput.value) || 0;
        
        if (total > 0 && attended >= 0 && attended <= total) {
            const absent = total - attended;
            absentInput.value = absent;
        } else if (total > 0 && attended > total) {
            // If attended exceeds total, reset attended
            attendedInput.value = total;
            absentInput.value = 0;
        } else {
            absentInput.value = '';
        }
    }

    // Add event listeners for auto-calculation
    totalClassesInput.addEventListener('input', autoCalculateAbsent);
    attendedInput.addEventListener('input', autoCalculateAbsent);

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        calculateAttendance();
    });

    // Reset functionality
    resetBtn.addEventListener('click', function() {
        form.reset();
        resultsContainer.style.display = 'none';
        resultsContainer.innerHTML = '';
    });

    function calculateAttendance() {
        const total = parseInt(totalClassesInput.value);
        const attended = parseInt(attendedInput.value);
        const absent = parseInt(absentInput.value);

        if (!total || total <= 0) {
            alert('Please enter a valid number of total classes');
            return;
        }

        if (attended < 0 || attended > total) {
            alert('Classes attended cannot be negative or exceed total classes');
            return;
        }

        const attendancePercentage = (attended / total) * 100;
        const requiredPercentage = 75;
        
        let statusClass, statusIcon, statusMessage;
        let recoverySection = '';
        let skipSection = '';

        // Determine status
        if (attendancePercentage >= requiredPercentage) {
            statusClass = 'good';
            statusIcon = '🎉';
            statusMessage = '✅ Excellent! Your attendance is above the required 75%';
            
            // Calculate how many classes can be skipped while maintaining 75%
            const classesCanSkip = Math.floor(attended / 0.75 - total);
            
            if (classesCanSkip > 0) {
                skipSection = `
                    <div class="skip-section">
                        <div class="skip-title">
                            🎯 Freedom Calculator
                        </div>
                        <div class="skip-classes">
                            You can skip up to <strong>${classesCanSkip}</strong> upcoming classes and still maintain 75% attendance!
                        </div>
                        <div class="skip-warning">
                            ⚠️ <strong>Use Wisely:</strong> This is your maximum buffer - consider saving some for emergencies!
                        </div>
                    </div>
                `;
            } else {
                skipSection = `
                    <div class="skip-section warning-skip">
                        <div class="skip-title">
                            ⚡ Just Above the Line
                        </div>
                        <div class="skip-classes">
                            You're doing great at <strong>${attendancePercentage.toFixed(1)}%</strong>, but you can't afford to skip any more classes right now.
                        </div>
                        <div class="skip-advice">
                            💪 Keep attending regularly to build a buffer for future flexibility!
                        </div>
                    </div>
                `;
            }
        } else if (attendancePercentage >= 65) {
            statusClass = 'warning';
            statusIcon = '⚠️';
            statusMessage = '⚠️ Need Improvement - You can still reach 75%!';
        } else {
            statusClass = 'danger';
            statusIcon = '🚨';
            statusMessage = '🚨 Critical - Immediate action needed!';
        }

        // Calculate classes needed to reach 75% (for low attendance)
        if (attendancePercentage < requiredPercentage) {
            const classesNeeded = Math.ceil((0.75 * total - attended) / 0.25);
            recoverySection = `
                <div class="recovery-section">
                    <div class="recovery-title">
                        🎯 Path to Recovery
                    </div>
                    <div class="needed-classes">
                        To reach 75% attendance, you need <strong>${classesNeeded}</strong> consecutive classes without any absences.
                    </div>
                    <div class="alternatives">
                        <h4>💡 Alternative approaches:</h4>
                        <ul>
                            <li>Focus on perfect attendance going forward</li>
                            <li>Speak with your instructor about make-up opportunities</li>
                            <li>Consider audit/withdrawal options if available</li>
                            <li>Attend extra classes or tutorials if offered</li>
                        </ul>
                    </div>
                </div>
            `;
        }

        // Create results HTML
        const resultsHTML = `
            <div class="attendance-status">
                <span class="status-icon">${statusIcon}</span>
                <div class="attendance-percentage percentage-${statusClass}">
                    ${attendancePercentage.toFixed(2)}%
                </div>
                <div class="status-message status-${statusClass}">
                    ${statusMessage}
                </div>
            </div>

            <div class="breakdown-grid">
                <div class="breakdown-item breakdown-total">
                    <div class="label">Total Classes</div>
                    <div class="value">${total}</div>
                </div>
                <div class="breakdown-item breakdown-attended">
                    <div class="label">Attended</div>
                    <div class="value">${attended}</div>
                </div>
                <div class="breakdown-item breakdown-absent">
                    <div class="label">Absent</div>
                    <div class="value">${absent}</div>
                </div>
            </div>

            ${skipSection}
            ${recoverySection}

            <div class="motivation-section">
                🌟 Every class you attend builds your knowledge and brings you closer to success. You've got this! 🌟
            </div>
        `;

        resultsContainer.innerHTML = resultsHTML;
        resultsContainer.style.display = 'block';

        // Smooth scroll to results
        resultsContainer.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }

    // Add some interactive effects
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'translateY(-2px)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'translateY(0)';
        });
    });
});
