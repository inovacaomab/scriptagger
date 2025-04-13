document.addEventListener('DOMContentLoaded', function () {
    const popup = document.createElement('div');
    popup.id = 'popup';
    popup.style.position = 'absolute';
    popup.style.display = 'none';
    popup.style.backgroundColor = 'white';
    popup.style.border = '1px solid #ccc';
    popup.style.padding = '10px';
    popup.style.boxShadow = '2px 2px 5px rgba(0,0,0,0.3)';
    popup.style.zIndex = '1000';
    popup.style.width = '300px';
    document.body.appendChild(popup);

    document.querySelectorAll('.versiculo').forEach(function(versiculo) {
        versiculo.addEventListener('mouseover', async function(e) {
            const file = versiculo.getAttribute('data-ref');
            const chapter = versiculo.getAttribute('data-chapter');
            const verse = versiculo.getAttribute('data-verse');
            
            const url = `https://inovacaomab.github.io/bibliaACFestudo/acf/${file}`;

            try {
                const response = await fetch(url);
                if (response.ok) {
                    const xmlText = await response.text();
                    const parser = new DOMParser();
                    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

                    const chapterElement = xmlDoc.querySelector(`chapter[number="${chapter}"]`);
                    const verseElement = chapterElement?.querySelector(`verse[number="${verse}"]`);
                    const verseText = verseElement?.textContent || 'Versículo não encontrado.';
                    
                    const chapterUrl = `${url}#capitulo-${chapter}`;
                    popup.innerHTML = `${verseText} <a href="${chapterUrl}" target="_blank">ACF - Português</a>`;
                } else {
                    popup.innerHTML = `Erro ao acessar ${url}. Status: ${response.status}`;
                }
            } catch (error) {
                popup.innerHTML = 'Erro ao carregar o versículo.';
            }

            popup.style.display = 'block';
            const popupWidth = popup.offsetWidth;
            const popupHeight = popup.offsetHeight;
            let left = e.pageX + 10;
            let top = e.pageY + 10;

            if (left + popupWidth > window.innerWidth) {
                left = window.innerWidth - popupWidth - 10;
            }
            if (top + popupHeight > window.innerHeight) {
                top = window.innerHeight - popupHeight - 10;
            }

            popup.style.left = `${left}px`;
            popup.style.top = `${top}px`;
        });

        versiculo.addEventListener('mouseout', function() {
            popup.style.display = 'none';
        });
    });

    document.addEventListener('click', function(e) {
        if (!popup.contains(e.target) && !e.target.classList.contains('versiculo')) {
            popup.style.display = 'none';
        }
    });
});
