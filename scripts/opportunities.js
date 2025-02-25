"use strict";

class Contact {
    constructor(fullName = "", emailAddress = "", subject = "", message = "") {
        this._fullName = fullName;
        this._emailAddress = emailAddress;
        this._subject = subject;
        this._message = message;
    }

    get fullName() {
        return this._fullName;
    }

    set fullName(fullName) {
        if (typeof fullName !== "string" || fullName.trim() === "") {
            throw new Error("Invalid fullName: must be a non-empty string");
        }
        this._fullName = fullName;
    }

    get emailAddress() {
        return this._emailAddress;
    }

    set emailAddress(emailAddress) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailAddress)) {
            throw new Error("Invalid emailAddress: must be in proper email format");
        }
        this._emailAddress = emailAddress;
    }

    get subject() {
        return this._subject;
    }

    set subject(subject) {
        if (typeof subject !== "string" || subject.trim() === "") {
            throw new Error("Invalid subject: must be a non-empty string");
        }
        this._subject = subject;
    }

    get message() {
        return this._message;
    }

    set message(message) {
        if (typeof message !== "string" || message.trim() === "") {
            throw new Error("Invalid message: must be a non-empty string");
        }
        this._message = message;
    }

    toString() {
        return `Full Name: ${this._fullName}\nEmail Address: ${this._emailAddress}\nSubject: ${this._subject}\nMessage: ${this._message}`;
    }

    serialize() {
        if (!this._fullName || !this._emailAddress || !this._subject || !this._message) {
            console.error("One or more of the contact properties are missing or invalid");
            return null;
        }
        return `${this._fullName},${this._emailAddress},${this._subject},${this._message}`;
    }

    deserialize(data) {
        if (typeof data !== "string" || data.split(",").length !== 4) {
            console.error("Invalid data format for deserialization");
            return;
        }

        const propArray = data.split(",");
        this._fullName = propArray[0];
        this._emailAddress = propArray[1];
        this._subject = propArray[2];
        this._message = propArray[3];
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const opportunitiesList = document.getElementById('opportunities-list');

    // Fetch data from JSON file
    fetch('./data/events.json')
        .then(response => response.json())
        .then(opportunities => {
            opportunities.forEach(opportunity => {
                const card = document.createElement('div');
                card.className = 'col-md-4 opportunity-card';

                // Convert date and time to readable format
                const startDate = new Date(opportunity.start);
                const endDate = new Date(opportunity.end);
                const formattedDate = startDate.toLocaleDateString();
                const formattedStartTime = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const formattedEndTime = endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                card.innerHTML = `
                    <div class="card shadow-sm">
                        <div class="card-body">
                            <h5 class="card-title">${opportunity.title}</h5>
                            <p class="card-text">${opportunity.description}</p>
                            <p class="card-text"><strong>Date:</strong> ${formattedDate}</p>
                            <p class="card-text"><strong>Time:</strong> ${formattedStartTime} - ${formattedEndTime}</p>
                            <p class="card-text"><strong>Location:</strong> ${opportunity.location}</p>
                            <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#signUpModal" onclick="setOpportunity('${opportunity.title}')">Sign Up</button>
                        </div>
                    </div>
                `;
                opportunitiesList.appendChild(card);
            });
        })
        .catch(error => console.error('Error fetching opportunities:', error));

    // Handle form submission
    document.getElementById('signUpForm').addEventListener('submit', function (e) {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const role = document.getElementById('role').value;

        if (name && email && role) {
            document.getElementById('confirmationMessage').textContent = 'Thank you for signing up!';

            setTimeout(() => {
                document.getElementById('confirmationMessage').textContent = '';
                document.getElementById('signUpForm').reset();

                const signUpModal = bootstrap.Modal.getInstance(document.getElementById('signUpModal'));
                signUpModal.hide();
            }, 3000);
        }
    });
});

// Update modal title when signing up
function setOpportunity(title) {
    document.getElementById('signUpModalLabel').textContent = `Sign Up for ${title}`;
}
