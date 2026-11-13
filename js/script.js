// Mobile Menu Toggle
        const menuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');

        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // Close mobile menu on link click
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });

        // Kanoa Custom Canoes Rating Component logic (Question 3)
        const ratingContainer = document.getElementById('kanoa-rating-container');
        const hiddenInput = document.getElementById('p3_calificacion');
        const ratingLabel = document.getElementById('rating-label');
        let currentRating = 0;

        // Render 5 Kanoa Canoe SVG rating buttons
        for (let i = 1; i <= 5; i++) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'kanoa-rating-btn p-1 sm:p-2 transition-transform hover:scale-110 focus:outline-none';
            btn.setAttribute('data-rating', i);
            btn.setAttribute('aria-label', `Calificación ${i} de 5`);
            
            btn.innerHTML = `
                <svg class="w-8 h-8 sm:w-10 sm:h-10 text-gray-300 transition-colors duration-200" viewBox="0 0 100 80" fill="currentColor">
                    <!-- Canoe Shape -->
                    <path d="M 15 50 Q 50 68 85 50 Q 75 62 50 62 Q 25 62 15 50 Z"/>
                    <!-- Heart Curve Arc -->
                    <path d="M 20 40 A 25 25 0 0 1 50 25 A 25 25 0 0 1 80 40" stroke="currentColor" stroke-width="6" stroke-linecap="round" fill="none"/>
                    <!-- Sun/Paddle element -->
                    <circle cx="50" cy="22" r="7"/>
                </svg>
            `;

            btn.addEventListener('click', () => setRating(i));
            btn.addEventListener('mouseenter', () => highlightCanoes(i));
            btn.addEventListener('mouseleave', () => highlightCanoes(currentRating));

            ratingContainer.appendChild(btn);
        }

        function setRating(rating) {
            currentRating = rating;
            hiddenInput.value = rating;
            ratingLabel.textContent = `${rating} / 5 Kanoas`;
            highlightCanoes(rating);
        }

        function highlightCanoes(rating) {
            const buttons = ratingContainer.querySelectorAll('.kanoa-rating-btn');
            buttons.forEach((btn, idx) => {
                const svg = btn.querySelector('svg');
                if (idx < rating) {
                    svg.classList.remove('text-gray-300');
                    svg.classList.add('text-kanoa-orange');
                } else {
                    svg.classList.remove('text-kanoa-orange');
                    svg.classList.add('text-gray-300');
                }
            });
        }

        // Form Submit Handler
        function handleFormSubmit(e) {
            e.preventDefault();

            // Validate Rating question #3
            if (currentRating === 0) {
                alertCustom('Por favor selecciona una calificación en la pregunta 3 usando los íconos de Kanoa.');
                return;
            }

            // Display Success Modal
            const modal = document.getElementById('success-modal');
            modal.classList.remove('hidden');
            setTimeout(() => {
                modal.classList.remove('opacity-0');
                modal.querySelector('div').classList.remove('scale-95');
                modal.querySelector('div').classList.add('scale-100');
            }, 10);

            // Reset Form
            document.getElementById('kanoa-feedback-form').reset();
            setRating(0);
        }

        function closeModal() {
            const modal = document.getElementById('success-modal');
            modal.classList.add('opacity-0');
            modal.querySelector('div').classList.remove('scale-100');
            modal.querySelector('div').classList.add('scale-95');
            setTimeout(() => {
                modal.classList.add('hidden');
            }, 300);
        }

        // Custom friendly fallback alert using custom dialog instead of standard browser alert
        function alertCustom(msg) {
            const tempBox = document.createElement('div');
            tempBox.className = 'fixed top-5 right-5 bg-kanoa-navy text-white px-6 py-4 rounded-xl shadow-2xl z-50 flex items-center gap-3 border-l-4 border-kanoa-orange animate-bounce';
            tempBox.innerHTML = `<i class="fa-solid fa-triangle-exclamation text-kanoa-orange text-xl"></i><span>${msg}</span>`;
            document.body.appendChild(tempBox);
            setTimeout(() => tempBox.remove(), 4000);
        }