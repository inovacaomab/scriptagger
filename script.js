document.addEventListener('DOMContentLoaded', function () {
    const versiculos = document.querySelectorAll('.versiculo');
    const popup = document.getElementById('popup');
    const popupContent = document.getElementById('popupContent');
    const closePopup = document.getElementById('closePopup');

    versiculos.forEach(function (versiculo) {
        versiculo.addEventListener('mouseover', async function (e) {
            const file = versiculo.getAttribute('data-ref');
            const chapter = versiculo.getAttribute('data-chapter');
            const verse = versiculo.getAttribute('data-verse');
            const reference = versiculo.textContent;
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
                    popupContent.innerHTML = `
                        <span class="reference">${reference}</span>
                        <span class="verse-text">${verseText}</span>
                    `;
                } else {
                    popupContent.innerHTML = `Erro ao acessar ${url}. Status: ${response.status}`;
                }
            } catch (error) {
                popupContent.innerHTML = 'Erro ao carregar o versículo.';
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
    });

    closePopup.addEventListener('click', function () {
        popup.style.display = 'none';
    });

    document.addEventListener('click', function (e) {
        if (!popup.contains(e.target) && !e.target.classList.contains('versiculo')) {
            popup.style.display = 'none';
        }
    });
});
