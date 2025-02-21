class AutoCompleteInput {
    constructor(options) {

        const select = document.getElementById(options.selectId);

        this.select = select;

        // Default options
        const defaultOptions = {
            selectId: 'autocomplete', // ID dari input
            data: [], // Data yang akan ditampilkan
            apiUrl: '', // URL endpoint API
            debounceTime: 500, // Waktu tunggu setelah pengguna berhenti mengetik (dalam milidetik)
            keyToDisplay: select.attributes['name'].value || 'name', // Properti yang akan ditampilkan
            keyToQuery: select.attributes['name'].value || 'name',
            keyToBeValue: 'id',
            searchInputClass: 'form-control', // Class untuk input search
            onSelect: null // Callback saat item dipilih
        };

        // Gabungkan default options dengan user options
        this.options = { ...defaultOptions, ...options };

        const data = Array.from(select).map(option => {
            return {
                [this.options.keyToBeValue]: option.value,
                [this.options.keyToDisplay]: option.text
            }
        })

        this.options.data = this.options.data || data;

        this.loadingItem = { [this.options.keyToDisplay]: 'Mengambil data...', [this.options.keyToBeValue]: '' };

        this.displayInput = document.createElement('input');
        this.searchInput = document.createElement('input');

        this.searchInput.className = this.options.searchInputClass;
        this.searchInput.classList.add('search-input');

        // Jika input tidak ditemukan, throw error
        if (!this.select) {
            throw new Error(`Elemmen dengan ID "${this.options.selectId}" tidak ditemukan.`);
        }

        // Buat wrapper relatif dan bungkus input di dalamnya
        this.wrapper = document.createElement('div');
        this.wrapper.classList.add('naqs-autocomplete-wrapper');

        // tambahkan class dari select ke display input
        this.displayInput.classList.add(...select.classList);

        this.displayInput.placeholder = select.options[0].text;
        this.displayInput.value = [...select.options].filter(option => option.selected)[0].text;

        this.select.parentNode.insertBefore(this.wrapper, this.select);
        this.wrapper.appendChild(this.select);

        // Sembunyikan select
        this.select.style.display = 'none';

        // Buat container untuk hasil autocomplete
        this.resultsContainer = document.createElement('div');
        this.resultsContainer.classList.add('autocomplete-results');

        this.wrapper.appendChild(this.displayInput);

        // buat display input readonly
        this.displayInput.setAttribute('readonly', true);

        // buat elemen untuk membungkus input search dan hasil autocomplete
        this.searchWrapper = document.createElement('div');
        this.searchWrapper.classList.add('search-wrapper');
        this.searchWrapper.appendChild(this.searchInput);
        this.searchWrapper.appendChild(this.resultsContainer);

        this.wrapper.appendChild(this.searchWrapper);

        // Inisialisasi debounce
        this.debounceTimeout = null;

        // Event listeners
        this.displayInput.addEventListener('click', () => {
            this.searchWrapper.style.display = 'block';
            this.searchInput.focus();
        })
        this.searchInput.addEventListener('input', this.handleInput.bind(this));
        this.searchInput.addEventListener('focus', this.handleFocus.bind(this));
        document.addEventListener('click', this.handleClickOutside.bind(this));
    }

    handleFocus(e) {
        this.searchInput.value = '';
        this.fetchItems('');
    }

    handleInput(e) {
        const query = e.target.value.trim();

        // Hapus timeout sebelumnya jika ada
        if (this.debounceTimeout) {
            clearTimeout(this.debounceTimeout);
        }

        // Set timeout baru untuk debounce
        this.debounceTimeout = setTimeout(() => {
            this.fetchItems(query);
        }, this.options.debounceTime);
    }

    fetchItems(query) {
        if (this.options.data.length > 0) {
            // Gunakan data lokal jika tersedia
            const items = this.options.data.filter(item =>
                item[this.options.keyToDisplay].toLowerCase().includes(query.toLowerCase())
            );

            if (items.length > 0) {
                this.displayResults(items);
                return;
            }
        }

        let url = new URL(this.options.apiUrl);

        // Tambahkan query parameter
        url.searchParams.append(this.options.keyToQuery, query);

        // Tambahkan loading item
        this.displayResults([this.loadingItem, ...this.options.data]);

        // Ambil data dari API jika tidak ada data lokal
        fetch(url)
            .then(response => response.json())
            .then(({ data }) => {
                // normalisasi data

                data = data.map(item => {
                    return {
                        [this.options.keyToBeValue]: item[this.options.keyToBeValue],
                        [this.options.keyToDisplay]: item[this.options.keyToDisplay]
                    }
                })

                this.options.data = [...new Set([...this.options.data, ...data].map(JSON.stringify))].map(JSON.parse)
                this.displayResults(data);
            })
            .catch(error => {
                console.error('Error fetching items:', error);
            });
    }

    displayResults(items) {
        // buat item unik
        items = [...new Set(items.map(JSON.stringify))].map(JSON.parse)

        this.clearResults();
        this.searchWrapper.style.display = 'block';

        if (items.length > 0) {
            items.forEach(item => {
                const itemElement = document.createElement('div');
                const text = item[this.options.keyToDisplay];
                itemElement.classList.add('item');

                if (text === this.loadingItem[this.options.keyToDisplay]) {
                    itemElement.classList.add('disabled');
                }

                itemElement.textContent = text;
                itemElement.addEventListener('click', () => {
                    if (text !== this.loadingItem[this.options.keyToDisplay]) {
                        this.displayInput.value = text;

                        // hapus semua option yang ada
                        this.select.innerHTML = '';
                        const option = document.createElement('option');
                        option.value = item[this.options.keyToBeValue];
                        this.select.appendChild(option);

                        this.clearResults();

                        // Panggil callback jika ada
                        if (this.options.onSelect) {
                            this.options.onSelect(item);
                        }
                    }
                });
                this.resultsContainer.appendChild(itemElement);
            });
        }
    }

    clearResults() {
        this.resultsContainer.innerHTML = '';
        this.searchWrapper.style.display = 'none';
    }

    handleClickOutside(e) {
        if (!this.wrapper.contains(e.target)) {
            this.clearResults();
        }
    }
}