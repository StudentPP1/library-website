import {ReturnBook} from "./ReturnBook.tsx";
import {useEffect, useState} from "react";
import BookModel from "../../../models/BookModel";
import {SpinnerLoading} from "../../Utils/SpinnerLoading.tsx";
import {Link} from "react-router-dom";
import {REACT_APP_API} from './../../../constants/index.ts'

export const Carousel = () => {
    const [books, setBooks] = useState<BookModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);
    
    useEffect(() => {
        const fetchBooks = async () => {
            const baseUrl: string = `${REACT_APP_API}/api/books`
            const url: string = `${baseUrl}?page=0&size=9`;
            const response = await fetch(url, {
                headers: {
                    mode: "no-cors",
                }
            });

            if (!response.ok) {
                throw new Error(response.statusText);
            }

            const json = await response.json();
            const data = json._embedded.books;
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
    }, []);

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

    return (
        <div className='container mt-5' style={{ height: 550 }}>
            <div className='homepage-carousel-title text-center'>
                <h3>Find your next "I stayed up too late reading" book.</h3>
            </div>
            <div id='carouselExampleControls' className='carousel carousel-dark slide mt-5
                d-none d-lg-block' data-bs-interval='false'>

                {/* Desktop */}
                <div className='carousel-inner'>
                    <div className='carousel-item active'>
                        <div className='row d-flex justify-content-center align-items-center'>
                            {books.slice(0, 3).map(book => (
                                <ReturnBook book={book} key={Number(book.id)} />
                            ))
                            }
                        </div>
                    </div>
                    <div className='carousel-item'>
                        <div className='row d-flex justify-content-center align-items-center'>
                            {books.slice(3, 6).map(book => (
                                <ReturnBook book={book} key={Number(book.id)} />
                            ))
                            }
                        </div>
                    </div>
                    <div className='carousel-item'>
                        <div className='row d-flex justify-content-center align-items-center'>
                            {books.slice(6, 9).map(book => (
                                <ReturnBook book={book} key={Number(book.id)} />
                            ))
                            }
                        </div>
                    </div>
                    <button className='carousel-control-prev' type='button'
                            data-bs-target='#carouselExampleControls' data-bs-slide='prev'>
                        <span className='carousel-control-prev-icon' aria-hidden='true'></span>
                        <span className='visually-hidden'>Previous</span>
                    </button>
                    <button className='carousel-control-next' type='button'
                            data-bs-target='#carouselExampleControls' data-bs-slide='next'>
                        <span className='carousel-control-next-icon' aria-hidden='true'></span>
                        <span className='visually-hidden'>Next</span>
                    </button>
                </div>
            </div>

            {/* Mobile */}
            <div className='d-lg-none mt-3'>
                <div className='row d-flex justify-content-center align-items-center'>
                    <ReturnBook book={books[0]} key={Number(books[0].id)} />
                </div>
            </div>
            <div className='homepage-carousel-title mt-3'>
                <Link className='btn btn-outline-secondary btn-lg' to="/search">View More</Link>
            </div>
        </div>
    );
}