export class Paginator<T> {

    results: T[] = [];
    total: number = 0;
    currentPage: number = 1;
    perPage: number = 10;
    lastPage: number = 1;

    constructor(paginationResult?: any, results?: T[]) {
        if (paginationResult) {
            this.results = results || paginationResult.result || this.results;
            this.total = paginationResult.total || paginationResult.pages * paginationResult.perPage || this.total;
            this.currentPage = paginationResult.currentPage || this.currentPage;
            this.perPage = paginationResult.perPage || this.perPage;
            this.lastPage = paginationResult.pages || this.lastPage;
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