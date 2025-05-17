let activities = [];

document.addEventListener('DOMContentLoaded', async () => {

  // Load header and footer
  const headerRes = await fetch('../forside/header.html');
  const headerHtml = await headerRes.text();
  document.getElementById('header').innerHTML = headerHtml;

  const footerRes = await fetch('../forside/footer.html');
  const footerHtml = await footerRes.text();
  document.getElementById('footer').innerHTML = footerHtml;

  // Fetch activities and build cards
  await fetchActivities();
  buildActivityCards();

  // Setup modal and buttons
  setupEventListeners();
});

async function fetchActivities() {
  try {
    const res = await fetch('http://localhost:8080/activites');
    const data = await res.json();
    activities = data;
  } catch (err) {
    console.error('Could not fetch activities:', err);
  }
}

function buildActivityCards() {
  const container = document.querySelector('.activity-cards');
  container.innerHTML = ''; // clear old cards if any

  activities.forEach(activity => {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.activity = activity.activityId;

    card.innerHTML = `
      <div class="card-overlay">
        <h3>${activity.name}</h3>
        <button class="more-info-btn">Edit</button>
      </div>
    `;

    container.appendChild(card);
  });
}

function setupEventListeners() {
  const modal = document.getElementById('modal');
  const modalDetails = document.getElementById('modal-details');
  const closeBtn = document.querySelector('.close');

  // Delegate event to container for dynamically created buttons
  document.querySelector('.activity-cards').addEventListener('click', (e) => {
    if (!e.target.classList.contains('more-info-btn')) return;

    const card = e.target.closest('.card');
    const activityId = card.dataset.activity;
    const activity = activities.find(a => String(a.activityId) === activityId);

    if (!activity) {
      console.error('Activity not found:', activityId);
      return;
    }

    modalDetails.innerHTML = `
      <div class="modal-bg">
        <div class="modal-text">
          <form id="edit-activity-form">
            <label>
              Name:<br>
              <input type="text" name="name" value="${activity.name}">
            </label><br><br>

            <label>
              Price:<br>
              <input type="number" name="price" value="${activity.price}">
            </label><br><br>

            <label>
              Duration:<br>
              <input type="text" name="duration" value="${activity.duration}">
            </label><br><br>

            <label>
              Lane:<br>
              <input type="text" name="lane" value="${activity.lane}">
            </label><br><br>

            <button type="submit">Save</button>
          </form>
        </div>
      </div>
    `;

    modal.style.display = 'block';

    const form = document.getElementById('edit-activity-form');
    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const updatedActivity = {
        activityId: activity.activityId,
        name: form.name.value,
        price: parseFloat(form.price.value),
        duration: form.duration.value,
        lane: form.lane.value
      };

      try {
        const res = await fetch(`http://localhost:8080/activites/${activity.activityId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedActivity)
        });

        if (res.ok) {
          alert('Activity saved.');
          modal.style.display = 'none';

          // Update local activities array and UI
          const index = activities.findIndex(a => a.activityId === activity.activityId);
          if (index !== -1) {
            activities[index] = updatedActivity;
          }

          // Update card title
          const updatedCard = document.querySelector(`.card[data-activity="${activity.activityId}"]`);
          if (updatedCard) {
            updatedCard.querySelector('h3').textContent = updatedActivity.name;
          }
        } else {
          alert('Failed to save activity.');
        }
      } catch (err) {
        console.error('Error saving activity:', err);
        alert('Error saving activity.');
      }
    });
  });

  // Close modal button
  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // Click outside modal to close
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
}
