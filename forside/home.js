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

const activities = fetchActivities();

async function fetchActivities() {
        let response = await fetch('http://localhost:8080/activites');
        let data = await response.json();
        return data;
}