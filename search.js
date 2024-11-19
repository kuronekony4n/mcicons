const searchInput = document.getElementById("search");
const iconList = document.getElementById("resultContainer");
const mainResult = document.getElementById("mainResult");
const iconTypeSelect = document.getElementById("iconType");
const iconCount = document.getElementById("iconCount");

mainResult.style.display = "none";

let iconData = null;

const populateSelectOptions = (data) => {
    let totalCount = 0;
    iconTypeSelect.innerHTML = '';

    data.assets.forEach(asset => {
        const key = Object.keys(asset)[0];
        const { count } = asset[key];
        totalCount += count;
        iconTypeSelect.innerHTML += `<option value="${key}">${key.charAt(0).toUpperCase() + key.slice(1)} (${count})</option>`;
    });

    iconTypeSelect.innerHTML = `<option value="all">All (${totalCount})</option>` + iconTypeSelect.innerHTML;
    iconCount.innerText = totalCount;
};

const fetchIconData = async () => {
    try {
        const res = await fetch("assets/data.json");
        if (!res.ok) {
            throw new Error(`Failed to fetch JSON: ${res.status} - ${res.statusText}`);
        }
        const data = await res.json();
        iconData = data;
        populateSelectOptions(data);
    } catch (error) {
        console.error(error);
    }
};

const searchicons = (searchBox) => {
    if (!iconData) return;

    const selectedType = iconTypeSelect.value;
    let fits = [];

    iconData.assets.forEach(asset => {
        const key = Object.keys(asset)[0];
        if (selectedType === 'all' || selectedType === key) {
            const { url_thumb, url_full, files } = asset[key];
            const regex = new RegExp(searchBox, "gi");

            const matchedIcons = searchBox === "!show" ? files : files.filter(icon => icon.match(regex));
            fits = fits.concat(matchedIcons.map(icon => ({ icon, thumbnail: url_thumb, url: url_full, category: key.charAt(0).toUpperCase() + key.slice(1) })));
        }
    });

    if (fits.length === 0 || (searchBox.length === 0 && searchBox !== "!")) {
        fits = [];
        iconList.innerHTML = "";
        mainResult.style.display = "none";
    } else {
        mainResult.style.display = "block";
    }

    outputHtml(fits);
};

const isMobileDevice = () => {
    return /Mobi|Android/i.test(navigator.userAgent);
};

const outputHtml = (fits) => {
    if (fits.length > 0) {
        const iconFits = fits
            .map(({ icon, thumbnail, url, category }) => {
                const iconName = icon.replace('.png', '').replace(/_/g, ' ');
                const iconNameArray = iconName.split(' ');
                let formattedText = '';

                iconNameArray.forEach((word, i) => {
                    formattedText += word + ' ';
                    if (isMobileDevice() && (i + 1) % 2 === 0) {
                        formattedText += '<br>';
                    }
                });

                formattedText = formattedText.trim();

                return `
                    <div class="inventory-item tooltip">
                        <a href="${url}${icon}" download target="_blank">
                            <img src="${thumbnail}${icon}">
                        </a>
                        <span class="tooltiptext">${formattedText} <span class="tooltipcategory">${category}</span></span>
                    </div>
                `;
            })
            .join("");
        iconList.innerHTML = iconFits;
    }
};

searchInput.addEventListener("input", () => searchicons(searchInput.value));
iconTypeSelect.addEventListener("change", () => searchicons(searchInput.value));

window.addEventListener("load", fetchIconData);