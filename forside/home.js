fetch('header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header').innerHTML = data;
        });

    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer').innerHTML = data;
        });

    // Fetch activities and build cards
    fetch('http://localhost:8080/activites')
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById('Activities');

            data.forEach(activity => {
                const card = document.createElement('div');
                card.className = 'card';

                card.innerHTML = `
                    <img src="${activity.img}" alt="${activity.name}">
                    <div class="card-overlay">
                        <h3>${activity.name}</h3>
                        <button class="more-info-btn" data-name="${activity.name}" data-price="${activity.price}" data-lane="${activity.lane}" data-duration="${activity.duration}"">More Info</button>
                    </div>
                `;

                container.appendChild(card);
            });

            // Add event listeners for modal
            document.querySelectorAll('.more-info-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                        console.log(e.target);
                    const name = e.target.dataset.name;
                    const price = e.target.dataset.price;
                    const lane = e.target.dataset.lane;
                    const duration = e.target.dataset.duration;

                    document.getElementById('modal-details').innerHTML = `
                        <div class="modal-text">
                                <p><strong>Name:</strong> ${name}</p>
                                <p><strong>Price:</strong> ${price}</p>
                                <p><strong>Lane:</strong> ${lane}</p>
                                <p><strong>Duration:</strong> ${duration}</p>
                        </div>
                    `;

                    document.getElementById('modal').style.display = 'block';
                });
            });
        });

    // Close modal
    document.querySelector('.close').addEventListener('click', () => {
        document.getElementById('modal').style.display = 'none';
    });

    // Close modal if clicked outside
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('modal');
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });