document.addEventListener("DOMContentLoaded", () => {
    const dogBar = document.getElementById('dog-bar');
    const dogInfo = document.getElementById('dog-info');
    const filterButton = document.getElementById('good-dog-filter');

    let allDogs = [];
    let filterOn = false;

    fetch('http://localhost:3000/pups')
        .then(response => response.json())
        .then(dogs => {
            allDogs = dogs;
            displayDogs(dogs);
        });

    function displayDogs(dogs) {
        dogBar.innerHTML = '';  
        dogs.forEach(dog => {
            const span = document.createElement('span');
            span.textContent = dog.name;

            span.addEventListener('click', () => {
                displayDogInfo(dog);
            });

            dogBar.appendChild(span);
        });
    }

    function displayDogInfo(dog) {
        dogInfo.innerHTML = `
            <img src="${dog.image}" alt="${dog.name}">
            <h2>${dog.name}</h2>
            <button id="toggle-good-dog">${dog.isGoodDog ? 'Good Dog!' : 'Bad Dog!'}</button>
        `;

        const toggleButton = document.getElementById('toggle-good-dog');
        toggleButton.addEventListener('click', () => {
            toggleGoodDog(dog);
        });
    }

    function toggleGoodDog(dog) {
        const newStatus = !dog.isGoodDog;

        fetch(`http://localhost:3000/pups/${dog.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ isGoodDog: newStatus })
        })
        .then(response => response.json())
        .then(updatedDog => {
            dog.isGoodDog = updatedDog.isGoodDog;
            displayDogInfo(updatedDog);
        });
    }

    filterButton.addEventListener('click', () => {
        filterOn = !filterOn;
        filterButton.textContent = `Filter good dogs: ${filterOn ? 'ON' : 'OFF'}`;

        const dogsToDisplay = filterOn ? allDogs.filter(dog => dog.isGoodDog) : allDogs;
        displayDogs(dogsToDisplay);
    });
});
