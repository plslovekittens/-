// ==================== ЧАТ ПОДДЕРЖКИ ====================

function toggleChat() {
    const chatWindow = document.getElementById('chatWindow');
    if (chatWindow) {
        chatWindow.classList.toggle('active');
    }
}

function openChat() {
    const chatWindow = document.getElementById('chatWindow');
    if (chatWindow) {
        chatWindow.classList.add('active');
    }
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const messagesContainer = document.getElementById('chatMessages');
    
    if (!input || !messagesContainer) return;
    
    const message = input.value.trim();
    if (!message) return;
    
    // Добавляем сообщение пользователя
    const userMessage = document.createElement('div');
    userMessage.className = 'chat-message user';
    userMessage.innerHTML = `<span>Вы:</span><div class="message-text">${escapeHtml(message)}</div>`;
    messagesContainer.appendChild(userMessage);
    
    input.value = '';
    
    // Автоответ поддержки
    setTimeout(() => {
        let response = '';
        const lowerMsg = message.toLowerCase();
        
        if (lowerMsg.includes('проблем') || lowerMsg.includes('помощ')) {
            response = 'Опишите подробнее вашу проблему, и мы обязательно поможем!';
        } else if (lowerMsg.includes('заказ') || lowerMsg.includes('покупк')) {
            response = 'Все заказы приходят на вашу почту мгновенно. Проверьте папку "Спам"';
        } else if (lowerMsg.includes('возврат')) {
            response = 'Возврат возможен в течение 14 дней, если ключ не был активирован.';
        } else if (lowerMsg.includes('продавец')) {
            response = 'Все продавцы проходят верификацию. Ваши деньги под защитой!';
        } else if (lowerMsg.includes('оплат') || lowerMsg.includes('деньг')) {
            response = 'Оплата происходит через СБП. Деньги замораживаются до получения товара.';
        } else if (lowerMsg.includes('ключ') || lowerMsg.includes('активац')) {
            response = 'Ключ активации приходит на email после подтверждения оплаты.';
        } else {
            response = 'Спасибо за обращение! Наш специалист свяжется с вами в ближайшее время.';
        }
        
        const supportMessage = document.createElement('div');
        supportMessage.className = 'chat-message support';
        supportMessage.innerHTML = `<span>Поддержка:</span><div class="message-text">${response}</div>`;
        messagesContainer.appendChild(supportMessage);
        
        // Прокрутка вниз
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 800);
    
    // Прокрутка вниз
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Отправка по Enter
document.addEventListener('DOMContentLoaded', function() {
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    console.log('Chat.js загружен');
});
