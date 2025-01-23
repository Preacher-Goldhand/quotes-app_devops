const apiUrl = 'http://localhost:5000/api/quotes';

async function fetchQuotes() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Failed to fetch quotes');
        
        const quotes = await response.json();
        const quotesList = document.getElementById('quotes-list');
        quotesList.innerHTML = '';

        quotes.forEach(quote => {
            const quoteElement = document.createElement('li');
            quoteElement.textContent = `"${quote.text}" - ${quote.author}`;

            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.onclick = () => editQuote(quote.id, quote.text, quote.author);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = () => deleteQuote(quote.id);

            quoteElement.appendChild(editButton);
            quoteElement.appendChild(deleteButton);

            quotesList.appendChild(quoteElement);
        });
    } catch (error) {
        alert('Error fetching quotes');
    }
}

async function addQuote(event) {
    event.preventDefault();
    const text = document.getElementById('quote-text').value;
    const author = document.getElementById('quote-author').value;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text, author }),
        });

        if (!response.ok) throw new Error('Failed to add quote');

        const newQuote = await response.json();

        const quotesList = document.getElementById('quotes-list');
        const quoteElement = document.createElement('li');
        quoteElement.textContent = `"${newQuote.text}" - ${newQuote.author}`;

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.onclick = () => editQuote(newQuote.id, newQuote.text, newQuote.author);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteQuote(newQuote.id);

        quoteElement.appendChild(editButton);
        quoteElement.appendChild(deleteButton);

        quotesList.appendChild(quoteElement);

        document.getElementById('quote-text').value = '';
        document.getElementById('quote-author').value = '';
    } catch (error) {
        alert('Error adding quote');
    }
}

async function editQuote(id, currentText, currentAuthor) {
    const newText = prompt("Edit the quote text:", currentText);
    const newAuthor = prompt("Edit the author:", currentAuthor);

    if (newText && newAuthor) {
        try {
            const response = await fetch(`${apiUrl}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: newText, author: newAuthor }),
            });

            if (!response.ok) throw new Error('Failed to edit quote');

            fetchQuotes();
        } catch (error) {
            alert('Error editing quote');
        }
    }
}

async function deleteQuote(id) {
    if (confirm("Are you sure you want to delete this quote?")) {
        try {
            const response = await fetch(`${apiUrl}/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete quote');

            fetchQuotes();
        } catch (error) {
            alert('Error deleting quote');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const quoteForm = document.getElementById('quote-form');
    if (quoteForm) {
        quoteForm.addEventListener('submit', addQuote);
    }

    fetchQuotes();
});
