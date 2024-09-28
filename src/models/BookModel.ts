// backend Book table
class BookModel {
    id: number;
    title: string;
    // ? = optional
    author?: string;
    description?: string;
    copies?: number;
    copiesAvailable?: number;
    category?: string;
    img?: string;
    buy?: boolean;

    constructor(
        id: number,
        title: string,
        author: string,
        description: string,
        copies?: number,
        copiesAvailable?: number,
        category?: string,
        img?: string,
        buy?: boolean
    ) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.description = description;
        this.copies = copies;
        this.copiesAvailable = copiesAvailable;
        this.category = category;
        this.img = img;
        this.buy = buy;
    }

}

export default BookModel;