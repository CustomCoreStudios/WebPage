function loadEssentialsWithRetry() {
    const url = "/html/essentials.html";
    const maxRetries = 5;
    let attempt = 0;
    let customZIndex = 1; // default

    // Check if in an editor environment
    const isEditor = () => {
        // Example condition: Adjust based on how your editor indicates its presence
        return window.location.hostname === "localhost"; // Modify this for your editor's setup
    };

    if (isEditor()) {
        console.log("🛑 Detected editor environment. Not loading essentials.");
        return;
    }

    // 🔍 Override zIndex if the page matches certain names
    const parts = window.location.pathname.split('/');
    const filename = parts[parts.length - 2].toLowerCase();
    
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

loadEssentialsWithRetry()
