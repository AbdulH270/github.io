"use strict";

/*
Authors: Abdul Hadi, James Swaine, Vedant Kapadia
Student ID's: 100923581,
Date of Completion: 02-24-2025
 */

//IIFE - Immediately invoked Functional Expression
(function(){
    function DisplayHomePage(){
        console.log("DisplayHomePage()");
        // Redirect to the "Opportunities" page when the button is clicked
        let volunteerButton = document.getElementById("getInvolvedButton");
        volunteerButton.addEventListener("click", () => {
            location.href = "opportunities.html";
        });
    }

    async function HandleSearch(query) {
        try {
            const response = await fetch("./data/events.json");
            if (!response.ok) throw new Error("Failed to fetch search data");

            const data = await response.json();
            const results = data.filter(item =>
                item.title.toLowerCase().includes(query.toLowerCase()) ||
                item.description.toLowerCase().includes(query.toLowerCase()) ||
                item.category.toLowerCase().includes(query.toLowerCase())
            );

            DisplaySearchResults(results);

        } catch (error) {
            console.error("[ERROR] Search failed", error);
            alert("Search currently unavailable. Please try again later.");
        }
    }

    function DisplaySearchResults(results) {
        const resultsContainer = document.getElementById("search-results");
        resultsContainer.innerHTML = "";

        if (results.length === 0) {
            resultsContainer.innerHTML = "<p>No results found.</p>";
            return;
        }

        results.forEach(item => {
            const resultItem = document.createElement("div");
            resultItem.className = "search-result-item";
            resultItem.innerHTML = `
            <h5>${item.title}</h5>
            <p>${item.description}</p>
            <p class="text-muted">${item.category}</p>
        `;
            resultsContainer.appendChild(resultItem);
        });
    }

    // Function to fetch gallery data and create the gallery
    function LoadGallery() {
        console.log("LoadGallery() called");
        fetch('./data/events.json') // Fetching the same events.json file
            .then(response => response.json())
            .then(events => {
                const galleryContainer = document.getElementById('galleryDisplay');
                events.forEach(event => {
                    if (event.image) { // Only add events with an image_url field
                        // Create a gallery item
                        const galleryItem = document.createElement('div');
                        galleryItem.classList.add('gallery-item');

                        // Create an image element for the thumbnail
                        const image = document.createElement('img');
                        image.src = event.image; // Set the image URL
                        image.alt = event.title; // Set the image alt text

                        // Create a link element to wrap the image for lightbox
                        const link = document.createElement('a');
                        link.setAttribute('href', event.image); // Full-size image for the lightbox
                        link.setAttribute('data-lg-size', '800-600'); // Optional, set the size for the lightbox
                        link.appendChild(image);

                        // Append the link to the gallery item, then the gallery item to the gallery container
                        galleryItem.appendChild(link);
                        galleryContainer.appendChild(galleryItem);
                    }
                });

                // Initialize the lightbox after images are loaded
                lightGallery(galleryContainer, {
                    selector: 'a'
                });
            })
            .catch(error => console.error('Error loading gallery data:', error));
    }



    function CheckLogin(){
        console.log("[INFO] Checking user login status.")

        const loginNav = document.getElementById("navbarLogin");

        if(!loginNav){
            console.warn("[WARNING] loginNav element not found! Skipping CheckLogin().")
            return;
        }

        const userSession = sessionStorage.getItem("user");
        if(userSession){
            loginNav.innerHTML = `<i class="fas fa-sign-out-alt"></i> Logout`;
            loginNav.href = "#";

            loginNav.addEventListener("click", (event)=> {
                event.preventDefault();
                sessionStorage.removeItem("user");
                location.href = "login.html";
            });
        }
    }

    function DisplayLoginPage() {
        console.log("[INFO] DisplayLoginPage() called...");

        const messageArea = document.getElementById("messageArea");
        const loginButton = document.getElementById("loginButton");
        const cancelButton = document.getElementById("cancelButton");

        // Hide the message initially
        messageArea.style.display = "none";

        if(!loginButton){
            console.error("[ERROR] loginButton not found in the DOM");
            return;
        }

        loginButton.addEventListener("click", async (event) => {
            event.preventDefault();

            const username = document.getElementById("username").value.trim();
            const password = document.getElementById("password").value.trim();

            try {

                const response = await fetch("data/user.json");

                if(!response.ok){
                    throw new Error(`[ERROR]HTTP error Status: ${response.statusText}`);
                }

                const jsonData = await response.json();
                const users = jsonData.users;

                if(!Array.isArray(users)){
                    throw new Error(`[ERROR] JSON data does not contain a valid users array`);
                }

                let success = false;
                let authenticatedUser = null;

                for(const user of users){
                    if(user.Username === username && user.Password === password){
                        success = true;
                        authenticatedUser = user;
                        break;
                    }
                }

                if(success){
                    sessionStorage.setItem("user", JSON.stringify({
                        DisplayName: authenticatedUser.DisplayName,
                        EmailAddress: authenticatedUser.EmailAddress,
                        Username: authenticatedUser.Username
                    }));

                    messageArea.style.display = "none";
                    messageArea.classList.remove("alert", "alert-danger");
                    location.href = "index.html";


                }else{
                    messageArea.style.display = "block";
                    messageArea.classList.add("alert", "alert-danger");
                    messageArea.textContent = "Invalid username or password. Please try again";

                    document.getElementById("username").focus();
                    document.getElementById("username").select();

                }


            }catch(error){
                console.error("[ERROR] Failed to login", error);
            }

        });

        cancelButton.addEventListener("click",(event) => {
            document.getElementById("loginForm").reset();
            location.href = "index.html";
        })

    }

    function UpdateActiveNavLink(){
        console.log("[INFO] UpdateActiveNavLink() called...");
        const currentPage = document.title.trim();
        const navLinks = document.querySelectorAll("nav a");
        navLinks.forEach(link => {
            if(link.textContent.trim() === currentPage){
                link.classList.add("active");
            }else{
                link.classList.remove("active");
            }
        });
    }

    /**
     * Dynamically loads the header from the header.html into the current page
     * @returns {Promise<void>}
     */
    function LoadHeader() {
        console.log("[INFO] LoadHeader() called...");

        return fetch("header.html")
            .then(response => response.text())
            .then(data => {
                document.querySelector('header').innerHTML = data;
                UpdateActiveNavLink();
            })
            .catch(error => console.log("[ERROR] Unable to load header", error));
    }

    /**
     * Dynamically loads the footer from footer.html into the current page
     * @returns {Promise<void>}
     */
    function LoadFooter() {
        console.log("[INFO] LoadFooter() called...");

        return fetch("footer.html")
            .then(response => response.text())
            .then(data => {
                document.querySelector("footer").innerHTML = data;
            })
            .catch(error => console.log("[ERROR] Unable to load footer", error));
    }

    async function DisplayOpportunitiesPage() {
        console.log("DisplayOpportunitiesPage()");

        let opportunitiesContainer = document.getElementById("opportunities-list");

        // Fetch data from events.json
        fetch("events.json")
            .then(response => response.json())
            .then(opportunities => {
                // Generate cards dynamically
                opportunities.forEach((opportunity) => {
                    let card = document.createElement("div");
                    card.className = "col-md-4 mb-4";

                    // Format the date
                    let eventDate = new Date(opportunity.start).toLocaleDateString("en-US", {
                        year: "numeric", month: "long", day: "numeric"
                    });

                    // Extract time from start and end
                    let startTime = new Date(opportunity.start).toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' });
                    let endTime = new Date(opportunity.end).toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' });

                    card.innerHTML = `
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">${opportunity.title}</h5>
                        <p class="card-text">${opportunity.description}</p>
                        <p class="text-muted"><i class="fa-solid fa-location-dot"></i> ${opportunity.location}</p>
                        <p class="text-muted"><i class="fa-solid fa-calendar-days"></i> ${eventDate}</p>
                        <p class="text-muted"><i class="fa-solid fa-clock"></i> ${startTime} - ${endTime}</p>
                        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#signUpModal">Sign Up</button>
                    </div>
                </div>
            `;

                    opportunitiesContainer.appendChild(card);
                });
            })
            .catch(error => console.error("Error loading events.json:", error));

        // Handle form submission
        const signupForm = document.getElementById("signupForm");
        const confirmationMessage = document.getElementById("confirmationMessage");

        signupForm.addEventListener("submit", (e) => {
            e.preventDefault();
            confirmationMessage.classList.remove("d-none");
            setTimeout(() => {
                confirmationMessage.classList.add("d-none");
                signupForm.reset();
            }, 3000);
        });
    }


    // Function to display events on FullCalendar
    function DisplayEventsPage() {
        console.log("DisplayEventsPage()");

        fetch('./data/events.json')
            .then(response => response.json())
            .then(events => {
                // Initialize FullCalendar with fetched events
                $('#calendar').fullCalendar({
                    events: events.map(event => ({
                        title: event.title,
                        start: event.start,
                        category: event.category
                    })),
                    eventRender: function(event, element) {
                        // Remove the time and only show the event title
                        element.find('.fc-title').text(event.title);
                    },

                });

                // Populate filter dropdown dynamically
                const eventCategoryDropdown = document.getElementById('eventCategory');
                const uniqueCategories = ["all", ...new Set(events.map(event => event.category))];

                eventCategoryDropdown.innerHTML = uniqueCategories
                    .map(category => `<option value="${category}">${category}</option>`)
                    .join("");

                // Event listener for filtering
                eventCategoryDropdown.addEventListener('change', function () {
                    const selectedCategory = this.value;

                    const filteredEvents = selectedCategory === "all"
                        ? events
                        : events.filter(event => event.category === selectedCategory);

                    $('#calendar').fullCalendar('removeEvents');
                    $('#calendar').fullCalendar('addEventSource', filteredEvents.map(event => ({
                        title: event.title,
                        start: event.start,
                        category: event.category
                    })));
                    $('#calendar').fullCalendar('rerenderEvents');
                });
            })
            .catch(error => console.error('Error loading events:', error));
    }

    function DisplayContactPage() {
        console.log("DisplayContactPage()");

        // Get form and modal elements
        const contactForm = document.getElementById("contact-form");

        // Add event listener to the form
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();

            // Validate form fields
            const name = document.getElementById("fullName").value.trim();
            const email = document.getElementById("emailAddress").value.trim();
            const subject = document.getElementById("subject").value.trim();
            const message = document.getElementById("message").value.trim();

            if (!name || !email || !subject || !message) {
                alert("All fields are required. Please fill out the form completely.");
                return;
            }

            if (!validateEmail(email)) {
                alert("Please enter a valid email address.");
                return;
            }

            // Show confirmation message
            alert("Thank you for your message! You will now be redirected to the Home page.");

            // Redirect to Home page after 5 seconds
            setTimeout(() => {
                window.location.href = "index.html";
            }, 4000);
        });
    }

    function SendFeedback() {
        console.log("Called SendFeedback()");

        // Get form and modal elements
        const contactForm = document.getElementById("feedback-form");

        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const fbSubject = document.getElementById("feedbackSubject").value.trim();
            const feedback = document.getElementById("feedback").value.trim();

            if (!fbSubject || !feedback) {
                alert("All fields are required. Please fill out the form completely.");
                return;
            }

            // Show confirmation message
            alert("Thank you for your feedback! We'll take it into consideration. You will now be redirected to the Home page.");

            // Redirect to Home page after 5 seconds
            setTimeout(() => {
                window.location.href = "index.html";
            }, 4000);
        });
    }

    function validateEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }
    function DisplayAboutPage(){
        console.log("Called AboutPage()...");
    }
    function DisplayTermsOfServicePage(){
        console.log("Called TermsOfServicePage()...");
    }
    function DisplayPrivacyPolicyPage(){
        console.log("Called PrivacyPolicyPage()...");
    }

    function start() {
        console.log("Start App...");

        // Load header first, then run CheckLogin after
        LoadHeader().then(()=>{
            CheckLogin();
        });

        // Add event listener for search input to call handleSearch
        const searchInput = document.getElementById("search-input");
        if (searchInput) {
            searchInput.addEventListener("input", (event) => {
                HandleSearch(event.target.value);
            });
        }



        switch (document.title) {
            case "Home":
                DisplayHomePage();
                break;
            case "Opportunities":
                DisplayOpportunitiesPage();
                break;
            case "Events":
                DisplayEventsPage();
                break;
            case "Contacts":
                DisplayContactPage();
                SendFeedback();
                break;
            case "About":
                DisplayAboutPage();
                break;
            case "PrivacyPolicy":
                DisplayPrivacyPolicyPage();
                break;
            case "Terms of Services":
                DisplayTermsOfServicePage();
                break;
            case "Login":
                DisplayLoginPage();
                break;
            case "Gallery":
                LoadGallery();
                break;

        }
    }
    window.addEventListener("load", start);

    document.addEventListener("DOMContentLoaded", () => {
        LoadHeader().then(() => console.log("[INFO] Header loaded successfully."));
        LoadFooter().then(() => console.log("[INFO] Footer loaded successfully."));
        // Highlight the current page in the navbar
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            if (link.href === window.location.href) {
                link.classList.add('active');
            }
        });
    });

})()