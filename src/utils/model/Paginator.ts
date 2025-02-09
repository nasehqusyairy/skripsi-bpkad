export class Paginator<T> {

    results: T[];
    total: number;
    currentPage: number;
    perPage: number;
    lastPage: number;

    constructor(paginationResult?: any) {
        if (paginationResult) {
            this.results = paginationResult.result;
            this.total = paginationResult.pages.pages * paginationResult.pages.perPage;
            this.currentPage = paginationResult.pages.currentPage;
            this.perPage = paginationResult.pages.perPage;
            this.lastPage = paginationResult.pages.lastPage;
        }
    }

    /**
     * Apakah ada halaman selanjutnya?
     * @returns {boolean}
     */
    get hasMore(): boolean {
        return this.currentPage < this.lastPage;
    }

    /**
     * Nomor halaman selanjutnya.
     * @returns {number|null}
     */
    get nextPage(): number | null {
        return this.hasMore ? this.currentPage + 1 : null;
    }

    /**
     * Nomor halaman sebelumnya.
     * @returns {number|null}
     */
    get previousPage(): number | null {
        return this.currentPage > 1 ? this.currentPage - 1 : null;
    }

    /**
     * Mengembalikan representasi JSON dari objek Paginator.
     * @returns {object}
     */
    toJSON(): object {
        return {
            results: this.results,
            total: this.total,
            currentPage: this.currentPage,
            perPage: this.perPage,
            lastPage: this.lastPage,
            hasMore: this.hasMore,
            nextPage: this.nextPage,
            previousPage: this.previousPage,
        };
    }
}