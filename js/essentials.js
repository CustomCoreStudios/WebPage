function loadEssentialsWithRetry() {
    const maxRetries = 5;
    let attempt = 0;
    let customZIndex = 1;

    const path = window.location.pathname;
    const isEditor = () => window.location.hostname === "localhost";

    // 🔍 Check if we're at or near root (main page or 404)
    const isRootLevel = path === "/" || path.split("/").filter(Boolean).length <= 1;

    // Set URL accordingly
    const url = isRootLevel ? "html/essentials.html" : "../html/essentials.html";

    // 🛑 Don't load in editor
    if (isEditor()) {
        console.log("🛑 Detected editor environment. Not loading essentials.");
        return;
    }

    // Custom z-index per page
    const filename = path.split("/").filter(Boolean).slice(-1)[0]?.toLowerCase() || "";
    const zIndexOverrides = {
        "portofolio": 5
    };
    if (filename in zIndexOverrides) {
        customZIndex = zIndexOverrides[filename];
        console.log(`🧪 Detected special page (${filename}), setting z-index to ${customZIndex}`);
    }

    function tryLoadEssentials() {
        const iframe = document.createElement("iframe");
        iframe.src = url;
        iframe.id = "essentials-frame";

        Object.assign(iframe.style, {
            position: "fixed",
            top: "0",
            left: "0",
            width: "100vw",
            height: "100vh",
            border: "none",
            zIndex: String(customZIndex),
            pointerEvents: "auto",
            backgroundColor: "transparent"
        });

        console.log(`📂 Trying to load iframe from ${url}`);

        iframe.onload = () => {
            console.log("✅ Essentials loaded successfully.");
        };

        iframe.onerror = (e) => {
            console.warn(`❌ Failed to load essentials (attempt ${attempt + 1}): `, e);
            iframe.remove();

            if (attempt < maxRetries) {
                attempt++;
                const delay = Math.pow(2, attempt) * 500;
                console.log(`🔁 Retrying in ${delay / 1000}s...`);
                setTimeout(tryLoadEssentials, delay);
            } else {
                console.error("❌ Gave up trying to load essentials.");
            }
        };

        document.body.appendChild(iframe);
    }

    tryLoadEssentials();
}

loadEssentialsWithRetry();
