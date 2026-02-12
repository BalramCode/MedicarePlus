// Patient Form Handling
document.getElementById('patientForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        dob: document.getElementById('dob').value,
        gender: document.getElementById('gender').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        physician: document.getElementById('physician').value,
        insurance: document.getElementById('insurance').value,
        medicalHistory: document.getElementById('medicalHistory').value
    };

    console.log('Patient Registration Data:', formData);

    // Show success message
    const successMsg = document.getElementById('successMessage');
    successMsg.style.display = 'block';

    // Auto-generate summary in chat
    const summary = `New patient registered: ${formData.firstName} ${formData.lastName}`;
    addBotMessage(`✅ Registration received!\n\n📋 Summary:\n${summary}\n📧 Email: ${formData.email}\n📞 Phone: ${formData.phone}\n\nOur team will reach out within 24 hours to confirm your appointment.`);

    // Reset form after 3 seconds
    setTimeout(() => {
        this.reset();
        successMsg.style.display = 'none';
    }, 3000);
});

// Chat Functionality
async function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();

    if (!message) return;

    // Add user message
    addUserMessage(message);
    input.value = '';

    // Show typing indicator
    showTyping();

    // Get AI response
    await getAIResponse(message);
}

async function sendQuickMessage(message) {
    document.getElementById('chatInput').value = message;
    await sendMessage();
}

function addUserMessage(message) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message user-message';
    messageDiv.innerHTML = `<div class="message-content">${escapeHtml(message)}</div>`;
    chatMessages.insertBefore(messageDiv, document.getElementById('typingIndicator'));
    scrollToBottom();
}

function addBotMessage(message) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message bot-message';
    messageDiv.innerHTML = `<div class="message-content">${escapeHtml(message).replace(/\n/g, '<br>')}</div>`;
    chatMessages.insertBefore(messageDiv, document.getElementById('typingIndicator'));
    scrollToBottom();
}

function showTyping() {
    document.getElementById('typingIndicator').style.display = 'block';
    scrollToBottom();
}

function hideTyping() {
    document.getElementById('typingIndicator').style.display = 'none';
}

async function getAIResponse(userMessage) {
    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 1000,
                system: `You are a helpful healthcare assistant for MediCare Plus clinic. You can:
1. Answer questions about clinic services, hours (Mon-Fri 8AM-6PM, Sat 9AM-2PM), and general healthcare FAQs
2. Help patients understand symptoms and provide general wellness advice (always remind users to consult healthcare professionals for medical decisions)
3. Guide patients on scheduling appointments or accessing services
4. Provide information about insurance and billing

Be friendly, empathetic, and professional. Keep responses concise but informative. Always prioritize patient safety and encourage seeking professional medical care when appropriate.`,
                messages: [
                    { role: 'user', content: userMessage }
                ]
            })
        });

        const data = await response.json();
        hideTyping();

        if (data.content && data.content[0] && data.content[0].text) {
            addBotMessage(data.content[0].text);
        } else {
            addBotMessage("I'm here to help! Could you please rephrase your question?");
        }
    } catch (error) {
        hideTyping();
        console.error('Chat error:', error);
        addBotMessage("I apologize, but I'm having trouble connecting right now. Please try again in a moment, or call our office at (555) 123-4567 for immediate assistance.");
    }
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function scrollToBottom() {
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// FAQ Accordion
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const faqItem = question.parentElement;
        faqItem.classList.toggle('active');
    });
});

// Initialize
console.log('MediCare Plus Healthcare Support App Loaded');