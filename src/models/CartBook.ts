import BookModel from "./BookModel.ts";

class CartBook {
    book: BookModel;

    constructor(book: BookModel) {
        this.book = book;
    }
}

export default CartBook;