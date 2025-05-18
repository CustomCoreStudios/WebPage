function loadEssentialsWithRetry() {
    const maxRetries = 5;
    let attempt = 0;
    let customZIndex = 1;

    const path = window.location.pathname;
    const parts = path.split('/');
    const filename = parts[parts.length - 2]?.toLowerCase() || "";
    
    // 🔍 Determine which path to load
    let url;
    if (path.endsWith("/") && parts.length <= 3) {
        // Main site: e.g. /WebPage/
        url = "https://customcorestudios.github.io/WebPage/html/essentials.html";
    } else {
        // Subpage: e.g. /WebPage/portofolio/
        url = "https://customcorestudios.github.io/WebPage/html/essentials.html";
    }

    // Editor detection
    const isEditor = () => {
        return window.location.hostname === "localhost";
    };

    if (isEditor()) {
        console.log("🛑 Detected editor environment. Not loading essentials.");
        return;
    }

    // zIndex overrides
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
