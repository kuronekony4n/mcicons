const searchInput = document.getElementById("search");
const iconList = document.getElementById("resultContainer");

const searchicons = async (searchBox) => {
    try {
        const res = await fetch("assets/file_list-1.21.json");
        if (!res.ok) {
            throw new Error(`Failed to fetch JSON: ${res.status} - ${res.statusText}`);
        }
        const icondata = await res.json();

        let fits = icondata.icons.filter((icon) => {
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
                    <a href="icons-1.21/${icon}" download target="_blank"><img src="icons-1.21-thumb/${icon}" title="${icon}"></a>
                    </div>
                `
            )
            .join("");
        iconList.innerHTML = iconFits;
    }
};

searchInput.addEventListener("input", () => searchicons(search.value));

// Load all icons on page load
window.addEventListener("load", () => {
    searchicons("");
});