/* =====================================================
   POLYCAB - MAHA LAXMI ENTERPRISES
   SCRIPT.JS
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* =================================================
       CURRENT YEAR
    ================================================= */

    const yearElement =
        document.getElementById("current-year");

    if (yearElement) {
        yearElement.textContent =
            new Date().getFullYear();
    }


    /* =================================================
       GITHUB SETTINGS
    ================================================= */

    const GITHUB_OWNER =
        "manishhaatwa-dot";

    const GITHUB_REPO =
        "Polycab-pali";

    const GITHUB_BRANCH =
        "main";


    /* =================================================
       PRODUCT CATEGORIES
    ================================================= */

    const categories = {

        lights:
            "lights-products",

        fans:
            "fans-products",

        switches:
            "switches-products",

        wires:
            "wires-products",

        switchgear:
            "switchgear-products"

    };


    /* =================================================
       SUPPORTED IMAGE TYPES
    ================================================= */

    const imageExtensions = [

        ".jpg",
        ".jpeg",
        ".png",
        ".webp",
        ".gif"

    ];


    /* =================================================
       LOAD PRODUCTS
    ================================================= */

    async function loadProducts() {

        for (const category in categories) {

            const container =
                document.getElementById(
                    categories[category]
                );

            if (!container) {
                continue;
            }


            try {

                const apiUrl =
                    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/assets/products/${category}?ref=${GITHUB_BRANCH}`;


                const response =
                    await fetch(apiUrl, {
                        cache: "no-store"
                    });


                if (!response.ok) {

                    throw new Error(
                        `GitHub API Error: ${response.status}`
                    );

                }


                const files =
                    await response.json();


                const images =
                    files.filter(file => {

                        return (
                            file.type === "file" &&
                            imageExtensions.some(
                                extension =>
                                    file.name
                                        .toLowerCase()
                                        .endsWith(extension)
                            )
                        );

                    });


                renderProducts(
                    container,
                    images
                );


            } catch (error) {

                console.error(
                    `Error loading ${category}:`,
                    error
                );


                showEmptyCollection(
                    container
                );

            }

        }

    }


    /* =================================================
       RENDER PRODUCTS
    ================================================= */

    function renderProducts(
        container,
        images
    ) {

        container.innerHTML = "";


        /* ---------------------------------------------
           NO PRODUCTS
        --------------------------------------------- */

        if (!images.length) {

            showEmptyCollection(
                container
            );

            return;

        }


        /* ---------------------------------------------
           PRODUCTS
        --------------------------------------------- */

        images.forEach(file => {

            const card =
                document.createElement("div");

            card.className =
                "product-card";


            /* -----------------------------------------
               IMAGE WRAPPER
            ----------------------------------------- */

            const imageWrap =
                document.createElement("div");

            imageWrap.className =
                "product-image-wrap";


            /* -----------------------------------------
               IMAGE
            ----------------------------------------- */

            const image =
                document.createElement("img");

            image.className =
                "product-image";


            image.src =
                file.download_url;


            image.loading =
                "lazy";


            image.decoding =
                "async";


            /* -----------------------------------------
               PRODUCT NAME
               Filename → Product Name
            ----------------------------------------- */

            let productName =
                file.name
                    .replace(/\.[^/.]+$/, "")
                    .replace(/[-_]+/g, " ")
                    .replace(/\s+/g, " ")
                    .trim();


            /* -----------------------------------------
               CAPITALIZE ENGLISH WORDS
            ----------------------------------------- */

            if (/^[a-zA-Z]/.test(productName)) {

                productName =
                    productName.replace(
                        /\b[a-z]/g,
                        letter =>
                            letter.toUpperCase()
                    );

            }


            /* -----------------------------------------
               ALT TEXT
            ----------------------------------------- */

            image.alt =
                `${productName} - Maha Laxmi Enterprises Polycab Pali`;


            /* -----------------------------------------
               IMAGE ERROR
            ----------------------------------------- */

            image.onerror = () => {

                imageWrap.innerHTML = `

                    <div style="
                        width:100%;
                        height:100%;
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        color:#b5121b;
                        background:#fff1f2;
                        font-size:32px;
                    ">

                        <i class="fa-regular fa-image"></i>

                    </div>

                `;

            };


            /* -----------------------------------------
               APPEND IMAGE
            ----------------------------------------- */

            imageWrap.appendChild(
                image
            );


            /* -----------------------------------------
               PRODUCT NAME ELEMENT
            ----------------------------------------- */

            const name =
                document.createElement("div");

            name.className =
                "product-name";


            name.textContent =
                productName;


            /* -----------------------------------------
               APPEND CARD
            ----------------------------------------- */

            card.appendChild(
                imageWrap
            );


            card.appendChild(
                name
            );


            container.appendChild(
                card
            );

        });

    }


    /* =================================================
       EMPTY COLLECTION
    ================================================= */

    function showEmptyCollection(
        container
    ) {

        container.innerHTML = `

            <div class="empty-collection">

                <i class="fa-regular fa-images"></i>

                <p>
                    Products coming soon
                </p>

            </div>

        `;

    }


    /* =================================================
       START
    ================================================= */

    loadProducts();

});
