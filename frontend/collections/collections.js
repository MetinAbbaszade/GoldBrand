document.addEventListener("DOMContentLoaded", async function () {
    document.body.classList.add('page-loaded');
    const collectionGrid = document.querySelector(".collection-grid");

    try {
        const collections = await fetchCollections();

        collections.forEach((collection) => {
            const collectionItem = document.createElement("div");
            collectionItem.classList.add("collection-item");
            collectionItem.innerHTML = `
                <div class="collection-image">
                    <img src="${collection.image}" alt="${collection.name}">
                    <div class="overlay">
                        <a href="../products/products.html" class="btn">Explore</a>
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