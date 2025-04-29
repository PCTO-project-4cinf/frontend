document.addEventListener("alpine:init", () => {
    Alpine.data("spaRouter", () => ({
        currentPage: "pages/home.html", // Pagina iniziale

        loadPage(url) {
            fetch(url)
                .then(res => res.text())
                .then(html => {
                    let spaContent = document.getElementById("spa-content");
                    spaContent.innerHTML = html;
        
                    // 🔥 Esegui manualmente gli script presenti nella pagina caricata
                    spaContent.querySelectorAll("script").forEach(script => {
                        let newScript = document.createElement("script");
                        newScript.textContent = script.textContent; // Copia il contenuto dello script
                        document.body.appendChild(newScript); // Esegui lo script
                        document.body.removeChild(newScript); // Rimuovi dopo l'esecuzione
                    });
        
                    // 🔥 IMPORTANTE: Re-inizializza Alpine dopo aver caricato la nuova pagina
                    Alpine.initTree(spaContent);
                })
                .catch(() => {
                    document.getElementById("spa-content").innerHTML = "<h1>404 - Pagina non trovata</h1>";
                });
        },

        navigate(page) {
            this.currentPage = `pages/${page}.html`;
            setTimeout(() => {
                this.loadPage(this.currentPage);
                history.pushState({}, "", `#${page}`);
            }, 200);
            
        },

        init() {
            let route = location.hash.replace("#", "") || "home";
            this.navigate(route);

            window.addEventListener("hashchange", () => {
                let route = location.hash.replace("#", "");
                this.navigate(route);
            });
        }
    }));
});

