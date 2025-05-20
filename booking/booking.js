const apiUrl = "http://localhost:8080/bookings";


function fetchAllBookings() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => renderBookingTable(data))
        .catch(error => console.error("Fejl ved hentning af bookinger:", error));
}


function fetchBookingById() {
    const id = document.getElementById("searchId").value;
    if (!id) return;

    fetch(`${apiUrl}/${id}`)
        .then(response => {
            if (!response.ok) throw new Error("Booking ikke fundet");
            return response.json();
        })
        .then(data => renderBookingTable([data]))
        .catch(error => alert(error.message));
}


function createBooking() {
    const booking = getBookingFormData();

    fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(booking)
    })
        .then(response => {
            if (!response.ok) throw new Error("Fejl ved oprettelse");
            return response.json();
        })
        .then(() => {
            clearForm();
            fetchAllBookings();
        })
        .catch(error => alert(error.message));
}


function updateBooking() {
    const id = document.getElementById("bookingId").value;
    const booking = getBookingFormData();

    fetch(`${apiUrl}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(booking)
    })
        .then(response => {
            if (!response.ok) throw new Error("Fejl ved opdatering");
            return response.json();
        })
        .then(() => {
            clearForm();
            fetchAllBookings();
        })
        .catch(error => alert(error.message));
}


function deleteBooking(id) {
    fetch(`${apiUrl}/${id}`, {
        method: "DELETE"
    })
        .then(() => fetchAllBookings())
        .catch(error => alert("Fejl ved sletning: " + error.message));
}


function renderBookingTable(bookings) {
    const tbody = document.getElementById("booking-table-body");
    tbody.innerHTML = "";

    bookings.forEach(b => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${b.bookingId}</td>
            <td>${b.name}</td>
            <td>${b.email}</td>
            <td>${b.telefon}</td>
            <td>${b.activity?.name || "Ukendt"}</td>
            <td>
                <button onclick="prefillForm(${b.bookingId})">Rediger</button>
                <button onclick="deleteBooking(${b.bookingId})">Slet</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}


function prefillForm(id) {
    fetch(`${apiUrl}/${id}`)
        .then(res => res.json())
        .then(b => {
            document.getElementById("bookingId").value = b.bookingId;
            document.getElementById("name").value = b.name;
            document.getElementById("email").value = b.email;
            document.getElementById("telefon").value = b.telefon;
            document.getElementById("activityId").value = b.activity?.activityId || "";

            document.getElementById("submitButton").innerText = "Opdater";
        });
}


function getBookingFormData() {
    return {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        telefon: parseInt(document.getElementById("telefon").value),
        activity: {
            activityId: parseInt(document.getElementById("activityId").value)
        }
    };
}


function clearForm() {
    document.getElementById("bookingId").value = "";
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("telefon").value = "";
    document.getElementById("activityId").value = "";
    document.getElementById("submitButton").innerText = "Opret";
}


document.addEventListener("DOMContentLoaded", () => {
    fetchAllBookings();

    document.getElementById("submitButton").addEventListener("click", function () {
        if (this.innerText === "Opret") {
            createBooking();
        } else {
            updateBooking();
        }
    });

    document.getElementById("searchButton").addEventListener("click", fetchBookingById);
});
