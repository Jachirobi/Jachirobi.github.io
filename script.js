document.addEventListener("DOMContentLoaded", function () {
    const tabs = document.querySelectorAll(".tab-item");
    const contents = document.querySelectorAll(".content");
	const API_URL = "http://localhost:8080/api/personal"; // URL des Java-Backends

	    // Funktion zum Speichern der persönlichen Daten
	    async function savePersonalData(event) {
	        event.preventDefault(); // Verhindert das Neuladen der Seite beim Absenden

	        const personalData = {
	            vorname: document.getElementById("vorname").value,
	            nachname: document.getElementById("nachname").value,
	            wohnort: document.getElementById("wohnort").value,
	            postleitzahl: document.getElementById("postleitzahl").value,
	            strasse: document.getElementById("strasse").value,
	            nummer: document.getElementById("nummer").value,
	            email: document.getElementById("email").value,
	            nachricht: document.getElementById("nachricht").value,
	            auswahl: document.getElementById("auswahl").value
	        };

	        const response = await fetch(`${API_URL}/save`, {
	            method: "POST",
	            headers: { "Content-Type": "application/json" },
	            body: JSON.stringify(personalData)
	        });

	        const result = await response.text();
	        alert(result); // Erfolgsmeldung anzeigen
	        loadPersonalData(); // Daten nach Speichern neu laden
	    }

	    // Funktion zum Laden der gespeicherten Daten
	    async function loadPersonalData() {
	        const response = await fetch(`${API_URL}/load`);
	        const data = await response.json();

	        const tableBody = document.querySelector("table tbody");
	        tableBody.innerHTML = ""; // Vorherige Daten löschen

	        data.forEach(person => {
	            const row = document.createElement("tr");
	            row.innerHTML = `
	                <td>${person.vorname} ${person.nachname}</td>
	                <td>${person.email}</td>
	                <td>${person.auswahl}</td>
	            `;
	            tableBody.appendChild(row);
	        });
	    }

	    // Event-Listener für das Speichern
	    document.querySelector("form").addEventListener("submit", savePersonalData);

	    // Daten beim Laden der Seite abrufen
	    loadPersonalData();

    function showTab(tabId) {
        // Alle Inhalte verstecken
        contents.forEach(content => {
            content.classList.remove("active");
        });

        // Alle Tabs inaktiv setzen
        tabs.forEach(tab => {
            tab.classList.remove("active");
            tab.classList.add("inactive"); // Setzt alle Tabs auf inaktiv
        });

        // Aktivierten Tab und Inhalt anzeigen
        const activeContent = document.getElementById(tabId);
        activeContent.classList.add("active");
        
        const activeTab = document.querySelector(`.tab-item[onclick="showTab('${tabId}')"]`);
        activeTab.classList.add("active");
        activeTab.classList.remove("inactive"); // Entfernt 'inactive' vom aktuellen Tab
    }

    // ** Standard: Ersten Tab korrekt als aktiv setzen **
    const firstTab = document.querySelector(".tab-item");
    if (firstTab) {
        firstTab.classList.add("active");
        firstTab.classList.remove("inactive");
    }

    showTab("pers-angaben"); // Standardmäßig "pers-angaben" anzeigen

    // Klick-Events für Tabs setzen
    tabs.forEach(tab => {
        tab.addEventListener("click", function () {
            const tabId = this.getAttribute("onclick").match(/'([^']+)'/)[1];
            showTab(tabId);
        });
    });


    // Funktion zum Sortieren der Tabelle
    function sortTable(columnIndex) {
        const table = document.querySelector('table');
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));
        const ascending = table.getAttribute('data-sort-order') === 'asc';
        
        rows.sort((a, b) => {
            const aText = a.children[columnIndex].innerText.toLowerCase();
            const bText = b.children[columnIndex].innerText.toLowerCase();
            
            if (!isNaN(aText) && !isNaN(bText)) {
                return ascending ? aText - bText : bText - aText;
            }

            return ascending 
                ? aText.localeCompare(bText, 'de')
                : bText.localeCompare(aText, 'de');
        });

        tbody.innerHTML = '';
        rows.forEach(row => tbody.appendChild(row));
        
        table.setAttribute('data-sort-order', ascending ? 'desc' : 'asc');
    }

    // Klick-Ereignisse für sortierbare Tabellenüberschriften setzen
    const tableHeaders = document.querySelectorAll("table th");
    tableHeaders.forEach((th, index) => {
        th.addEventListener("click", function () {
            sortTable(index);
        });
    });

    // Funktion, um Zeilen zu markieren
    const tableRows = document.querySelectorAll('table tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('click', function () {
            tableRows.forEach(r => r.classList.remove('highlight'));
            this.classList.add('highlight');
        });
    });
	
});
