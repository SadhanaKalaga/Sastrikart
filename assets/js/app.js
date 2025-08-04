document.addEventListener('DOMContentLoaded', function() {
    // Search functionality
    function initSearch() {
        const serviceSearchForm = document.getElementById('serviceSearchForm');
        if (!serviceSearchForm) return;

        const serviceSearchInput = document.getElementById('serviceSearchInput');
        const serviceCards = document.querySelectorAll('.service-card');
        const suggestionsContainer = document.getElementById('suggestions-container');

        const allServiceTitles = Array.from(serviceCards).map(card => card.querySelector('.card-title').textContent.trim());

        serviceSearchInput.addEventListener('input', function() {
            const query = this.value.trim().toLowerCase();
            suggestionsContainer.innerHTML = '';

            if (query.length === 0) {
                suggestionsContainer.classList.remove('show');
                return;
            }

            const matchedServices = allServiceTitles.filter(title => title.toLowerCase().includes(query));

            if (matchedServices.length > 0) {
                matchedServices.forEach(title => {
                    const suggestionItem = document.createElement('a');
                    suggestionItem.classList.add('dropdown-item');
                    suggestionItem.href = '#';
                    suggestionItem.textContent = title;
                    suggestionItem.addEventListener('click', function(e) {
                        e.preventDefault();
                        serviceSearchInput.value = this.textContent;
                        suggestionsContainer.classList.remove('show');
                        serviceSearchForm.dispatchEvent(new Event('submit'));
                        const correspondingCard = Array.from(serviceCards).find(card => card.querySelector('.card-title').textContent.trim() === this.textContent);
                        if (correspondingCard) {
                            const sectionId = correspondingCard.closest('section').id;
                            window.location.hash = sectionId;
                        }
                    });
                    suggestionsContainer.appendChild(suggestionItem);
                });
                suggestionsContainer.classList.add('show');
            } else {
                suggestionsContainer.classList.remove('show');
            }
        });

        document.addEventListener('click', function(e) {
            if (!serviceSearchForm.contains(e.target)) {
                suggestionsContainer.classList.remove('show');
            }
        });

        serviceSearchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const query = serviceSearchInput.value.trim().toLowerCase();
            let resultsFound = false;

            serviceCards.forEach(card => {
                const title = card.querySelector('.card-title').textContent.trim().toLowerCase();
                if (title.includes(query)) {
                    card.closest('.col-md-4').style.display = 'block';
                    resultsFound = true;
                } else {
                    card.closest('.col-md-4').style.display = 'none';
                }
            });

            const noResultsMessage = document.getElementById('no-results');
            if (noResultsMessage) {
                noResultsMessage.remove();
            }

            if (!resultsFound) {
                const mainContainer = document.querySelector('.container');
                const noResultsHTML = `<div id="no-results" class="text-center"><p>No services found matching your search.</p></div>`;
                mainContainer.insertAdjacentHTML('beforeend', noResultsHTML);
            }
        });
    }

    // Navbar dynamic logic
    function updateNavbar() {
        const mainLinks = document.getElementById('mainNavbarLinks');
        const authLinks = document.getElementById('authNavbarLinks');
        if (!mainLinks || !authLinks) return;
        mainLinks.querySelectorAll('.dashboard-link').forEach(el => el.remove());
        authLinks.innerHTML = '';
        const userRole = localStorage.getItem('role');
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (userRole) {
            let dashLink = '';
            let dashHref = '';
            if (userRole === 'customer') {
                dashLink = 'Customer Dashboard';
                dashHref = 'customer.html';
            } else if (userRole === 'priest') {
                dashLink = 'Priest Dashboard';
                dashHref = 'priest.html';
            } else if (userRole === 'admin') {
                dashLink = 'Admin Dashboard';
                dashHref = 'admin.html';
            }
            if (dashLink) {
                const li = document.createElement('li');
                li.className = 'nav-item dashboard-link';
                li.innerHTML = `<a class="nav-link" href="${dashHref}">${dashLink}</a>`;
                mainLinks.appendChild(li);
            }
            authLinks.innerHTML = `
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="fas fa-user-circle"></i> ${userData ? userData.name : 'User'}
                    </a>
                    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                        <li><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#profileModal">My Profile</a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item" href="#" id="logoutBtn">Logout</a></li>
                    </ul>
                </li>
            `;
        } else {
            authLinks.innerHTML = `
                <li class="nav-item">
                    <a class="nav-link" href="#" data-bs-toggle="modal" data-bs-target="#authModal">Login / Sign Up</a>
                </li>
            `;
        }
    }

    // Auth logic
    function initAuth() {
        ['user','priest','admin'].forEach(role => {
            const loginForm = document.getElementById(role + 'LoginForm');
            if(loginForm) {
                loginForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    const email = document.getElementById(role + 'Email').value;
                    localStorage.setItem('role', role === 'user' ? 'customer' : role);
                    localStorage.setItem('userData', JSON.stringify({ name: role.charAt(0).toUpperCase() + role.slice(1), email: email }));
                    updateNavbar();
                    bootstrap.Modal.getInstance(document.getElementById('authModal')).hide();
                });
            }
        });

        const registerForm = document.getElementById('userRegisterForm');
        if(registerForm) {
            registerForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const name = document.getElementById('registerName').value;
                const email = document.getElementById('registerEmail').value;
                const password = document.getElementById('registerPassword').value;
                const confirmPassword = document.getElementById('registerConfirmPassword').value;
                if(password !== confirmPassword) { alert('Passwords do not match'); return; }
                const userData = { name: name, email: email };
                localStorage.setItem('role', 'customer');
                localStorage.setItem('userData', JSON.stringify(userData));
                updateNavbar();
                bootstrap.Modal.getInstance(document.getElementById('authModal')).hide();
                alert('Registration successful!');
            });
        }

        document.addEventListener('click', function(e){
            if(e.target && e.target.id === 'logoutBtn'){
                localStorage.clear();
                updateNavbar();
                window.location.href = 'index.html';
            }
        });
    }

    function init() {
        updateNavbar();
        initAuth();
        initSearch();
    }

    init();
});