import {useEffect, useState} from "react";
import BookModel from "../../models/BookModel.ts";
import {SpinnerLoading} from "../Utils/SpinnerLoading.tsx";
import {SearchBook} from "./components/SearchBook.tsx";
import {Pagination} from "../Utils/Pagination.tsx";
import {REACT_APP_API} from './../../constants/index.ts'

export const SearchBooksPage = () => {

    const [books, setBooks] = useState<BookModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [booksPerPage] = useState(5);
    const [totalAmount, setTotalAmount] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState("");
    const [searchUrl, setSearchUrl] = useState("");
    const [categorySelection, setCategorySelection] = useState("Book category");

    useEffect(() => {
        const fetchBooks = async () => {
            const baseUrl: string = `${REACT_APP_API}/api/books`;
            let url: string = "";

            if (searchUrl === '') {
                url = `${baseUrl}?page=${currentPage - 1}&size=${booksPerPage}`;
            } else {
                // put pageNumber
                let searchPage = searchUrl.replace("pageNumber", `${currentPage - 1}`);
                url = baseUrl + searchPage;
            }

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(response.statusText);
            }

            const json = await response.json();
            const data = json._embedded.books;

            setTotalAmount(json.page.totalElements);
            setTotalPages(json.page.totalPages);

            const loadedBooks: BookModel[] = [];

            for (const key in data) {
                loadedBooks.push({
                    id: data[key].id,
                    title: data[key].title,
                    author: data[key].author,
                    description: data[key].description,
                    copies: data[key].copies,
                    copiesAvailable: data[key].copiesAvailable,
                    category: data[key].category,
                    img: data[key].img,
                });
            }

            setBooks(loadedBooks);
            setIsLoading(false);
        };

        fetchBooks().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        })
        // scroll to top of page
        window.scrollTo(0, 0);
    }, [currentPage, searchUrl]);

    if (isLoading) {
        return (
            <SpinnerLoading/>
        )
    }

    if (httpError) {
        return (
            <div className="container mt-5">
                <p>{httpError}</p>
            </div>
        )
    }

    const searchHandleChange = () => {
        setCurrentPage(1);
        if (search === "") {
            setSearchUrl("");
        } else {
            // <pageNumber> - generic, change in useEffect
            setSearchUrl(`/search/findByTitleContaining?title=${search}&page=<pageNumber>&size=${booksPerPage}`);
        }
        // to start
        setCategorySelection("Book category");
    }

    const categoryField = (value: string) => {
        setCurrentPage(1);
        if (
            value.toLowerCase() === "fe" ||
            value.toLowerCase() === "be" ||
            value.toLowerCase() === "data" ||
            value.toLowerCase() === "devops"
        ) {
            setCategorySelection(value);
            setSearchUrl(`/search/findByCategory?category=${value}&page=<pageNumber>&size=${booksPerPage}`);
        } else {
            setCategorySelection("All");
            setSearchUrl(`?page=<pageNumber>&size=${booksPerPage}`);
        }
    }

    const lastBookIndex: number = currentPage * booksPerPage;
    const firstBookIndex: number = lastBookIndex - booksPerPage;
    let lastItem = booksPerPage * currentPage <= totalAmount
    ? booksPerPage * currentPage
    : totalAmount;

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div>
            <div className="container">
                <div className="row mt-5">
                    <div className="col-6">
                        <div className="d-flex">
                            <input
                                className="
                                form-control
                                me-2"
                                type="search"
                                placeholder="Search Books"
                                aria-label="Search"
                                onChange={e => setSearch(e.target.value)}
                            />
                            <button className="
                            btn btn-outline-success"
                            onClick={() => searchHandleChange()}>
                                Search
                            </button>
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="dropdown">
                            <button className="
                            btn btn-secondary dropdown-toggle"
                                    type="button"
                                    id="dropdownMenuButton1"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                            >
                                {categorySelection}
                            </button>
                            <ul className="dropdown-menu"
                                // connect to button id
                                aria-labelledby="dropdownMenuButton1">
                                <li onClick={() => categoryField('All')}>
                                    <a href="#" className="dropdown-item">
                                        All
                                    </a>
                                </li>
                                <li onClick={() => categoryField('FE')}>
                                    <a href="#" className="dropdown-item">
                                        Front End
                                    </a>
                                </li>
                                <li onClick={() => categoryField('BE')}>
                                    <a href="#" className="dropdown-item">
                                        Back End
                                    </a>
                                </li>
                                <li onClick={() => categoryField('Data')}>
                                    <a href="#" className="dropdown-item">
                                        Data
                                    </a>
                                </li>
                                <li onClick={() => categoryField('DevOps')}>
                                    <a href="#" className="dropdown-item">
                                        DevOps
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                {totalAmount > 0
                    ?
                    <>
                        <div className='mt-3'>
                            <h5>Number of results: ({totalAmount})</h5>
                        </div>
                        <p>
                            {firstBookIndex + 1} to  {lastItem}  of {totalAmount} items:
                        </p>
                        {books.map(book => (
                            <SearchBook book={book} key={Number(book.id)} />
                        ))}
                    </>
                    :
                    <div className="m-5">
                        <h3>
                            Not found
                        </h3>
                    </div>
                }

                {totalPages > 1 &&
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        paginate={paginate}
                    />
                }
            </div>
        </div>
    )
}