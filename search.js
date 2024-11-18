const searchInput = document.getElementById("search");
const iconList = document.getElementById("resultContainer");
const mainResult = document.getElementById("mainResult");

mainResult.style.display = "none"; 

let iconData = null; 

const fetchIconData = async () => {
    try {
        const res = await fetch("assets/icon_list.json");
        if (!res.ok) {
            throw new Error(`Failed to fetch JSON: ${res.status} - ${res.statusText}`);
        }
        iconData = await res.json(); 
    } catch (error) {
        console.error(error);
    }
};

const searchicons = (searchBox) => {
    if (!iconData) return; 

    const { thumbnail, url } = iconData.urls;

    let fits = iconData.icons.filter((icon) => {
        const regex = new RegExp(searchBox, "gi");
        return icon.match(regex);
    });

    if (searchBox.length === 0) {
        fits = [];
        iconList.innerHTML = "";
        mainResult.style.display = "none"; 
    } else {
        mainResult.style.display = "block"; 
    }

    outputHtml(fits, thumbnail, url);
};

const outputHtml = (fits, thumbnailUrl, fullUrl) => {
    if (fits.length > 0) {
        const iconFits = fits
            .map((icon) => {
                const iconName = icon.replace('.png', '').replace(/_/g, ' ');
                const iconNameArray = iconName.split(' ');
                let formattedText = '';
                
                iconNameArray.forEach((word, i) => {
                    formattedText += word + ' ';
                    if ((i + 1) % 2 === 0) {
                        formattedText += '<br>';
                    }
                });

                formattedText = formattedText.trim();

                return `
                    <div class="inventory-item tooltip">
                        <a href="${fullUrl}${icon}" download target="_blank">
                            <img src="${thumbnailUrl}${icon}">
                        </a>
                        <span class="tooltiptext">${formattedText}</span>
                    </div>
                `;
            })
            .join("");
        iconList.innerHTML = iconFits;
    }
};

searchInput.addEventListener("input", () => searchicons(searchInput.value));

window.addEventListener("load", fetchIconData);