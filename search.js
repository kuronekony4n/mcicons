const searchInput = document.getElementById("search");
const animeList = document.getElementById("resultContainer");

const searchanime = async (searchBox) => {
    try {
        const res = await fetch("assets/file_list.json");
        if (!res.ok) {
            throw new Error(`Failed to fetch JSON: ${res.status} - ${res.statusText}`);
        }
        const animedata = await res.json();

        let fits = animedata.icons.filter((icon) => {
            const regex = new RegExp(searchBox, "gi"); // Removed the "^" to match anywhere in the string
            return icon.match(regex);
        });

        if (searchBox.length === 0) {
            fits = [];
        }

        outputHtml(fits);
    } catch (error) {
        console.error(error);
    }
};

const outputHtml = (fits) => {
    if (fits.length > 0) {
        const iconFits = fits
            .map(
                (icon) =>
                    `
                    <div class="inventory-item">
                    <a href="/icons/${icon}" download><img src="icons/${icon}" title="${icon}"></a>
                    </div>
                `
            )
            .join("");
        animeList.innerHTML = iconFits;
    }
};

searchInput.addEventListener("input", () => searchanime(search.value));

// Load all icons on page load
window.addEventListener("load", () => {
    searchanime("");
});
