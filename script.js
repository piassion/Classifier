const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwi6sybA5YwkSlXeB17bCRIfI6SVfAr6kDBPdV61Ox8X_49eCmMR_6StO1CMFVbDKIsZA/exec";

let people = [];


// LOAD DATA FROM GOOGLE APPS SCRIPT
async function loadData() {

    try {

        const response = await fetch(APPS_SCRIPT_URL);
        const data = await response.json();

        people = data.records.map(person => {

            return {
                name: person.name,
                age: Number(person.age),
                profession: person.profession,
                gender: person.gender,

                // CLASSIFY AGE
                ageGroup: getAgeGroup(Number(person.age))
            };

        });


        displayPeople(people);
        loadFilters();

    } catch (error) {

        document.getElementById("resultsGrid").innerHTML =
            "<p>Error loading data.</p>";

        console.error(error);
    }
}



// AGE CLASSIFIER
function getAgeGroup(age) {

    if (age >= 18 && age <= 25) {
        return "Young Adult";
    }

    if (age >= 26 && age <= 40) {
        return "Adult";
    }

    if (age >= 41 && age <= 60) {
        return "Middle-Aged";
    }

    if (age >= 61) {
        return "Senior";
    }

    return "Unknown";
}



// DISPLAY PEOPLE
function displayPeople(records) {

    const resultsGrid =
        document.getElementById("resultsGrid");


    if (records.length === 0) {

        resultsGrid.innerHTML =
            "<p>No records found.</p>";

        return;
    }


    resultsGrid.innerHTML = records.map(person => `

        <div class="person">

            <h3>${person.name}</h3>

            <p>Age: ${person.age}</p>

            <p>Age Group: ${person.ageGroup}</p>

            <p>Gender: ${person.gender}</p>

            <p>Profession: ${person.profession}</p>

        </div>

    `).join("");
}



// CREATE PROFESSION AND GENDER FILTERS
function loadFilters() {

    const professionFilter =
        document.getElementById("professionFilter");

    const genderFilter =
        document.getElementById("genderFilter");


    const professions =
        [...new Set(
            people.map(person => person.profession)
        )];


    const genders =
        [...new Set(
            people.map(person => person.gender)
        )];


    professions.forEach(profession => {

        professionFilter.innerHTML += `
            <option value="${profession}">
                ${profession}
            </option>
        `;

    });


    genders.forEach(gender => {

        genderFilter.innerHTML += `
            <option value="${gender}">
                ${gender}
            </option>
        `;

    });

}



// FILTER PEOPLE
function applyFilters() {

    const ageGroup =
        document.getElementById("ageFilter").value;

    const profession =
        document.getElementById("professionFilter").value;

    const gender =
        document.getElementById("genderFilter").value;


    const filteredPeople = people.filter(person => {

        const ageMatch =
            ageGroup === "all" ||
            person.ageGroup === ageGroup;


        const professionMatch =
            profession === "all" ||
            person.profession === profession;


        const genderMatch =
            gender === "all" ||
            person.gender === gender;


        return ageMatch &&
               professionMatch &&
               genderMatch;

    });


    displayPeople(filteredPeople);
}



// START PROGRAM
loadData();