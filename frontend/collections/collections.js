document.addEventListener("DOMContentLoaded", async function () {
    const collectionGrid = document.querySelector(".collection-grid");

    try {
        const collections = await fetchCollections(); // Await the async function

        collections.forEach((collection) => {
            const collectionItem = document.createElement("div");
            collectionItem.classList.add("collection-item");
            collectionItem.innerHTML = `
                <div class="collection-image">
                    <img src="${collection.image}" alt="${collection.name}">
                    <div class="overlay">
                        <a href="#" class="btn">Explore</a>
                    </div>
                </div>
                <div class="collection-info">
                    <h2>${collection.name}</h2>
                    <p>${collection.description}</p>
                </div>
            `;
            collectionGrid.appendChild(collectionItem);
        });
    } catch (error) {
        console.error("Failed to load collections:", error);
    }
});

const fetchCollections = async () => {
    try {
        const response = await fetch("./collections.json");
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const collections = await response.json();
        return collections;
    } catch (error) {
        console.error("Error fetching collections:", error);
    }
}