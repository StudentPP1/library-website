class ReviewRequestModel {
    rating: number;
    bookId: string;
    reviewDescription?: string;

    constructor(rating: number, bookId: string, reviewDescription: string) {
        this.rating = rating;
        this.bookId = bookId;
        this.reviewDescription = reviewDescription;
    }
}

export default ReviewRequestModel;