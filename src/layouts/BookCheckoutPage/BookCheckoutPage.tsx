import { useContext, useEffect, useState } from "react";
import BookModel from "../../models/BookModel.ts";
import { SpinnerLoading } from "../Utils/SpinnerLoading.tsx";
import { StarsReview } from "../Utils/StarsReview.tsx";
import { CheckoutAndReviewBox } from "./CheckoutAndReviewBox.tsx";
import ReviewModel from "../../models/ReviewModel.ts";
import { LatestReviews } from "./LatestReviews.tsx";
import { Auth } from "../../context/context.ts";
import ReviewRequestModel from "../../models/ReviewRequestModel.ts";
import {REACT_APP_API} from '../../constants/index.ts'

export const BookCheckoutPage = () => {
    const authContext = useContext(Auth);

    const [book, setBook] = useState<BookModel>();
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    const [reviews, setReviews] = useState<ReviewModel[]>([]);
    const [totalStarts, setTotalStarts] = useState(0);
    const [isLoadingReview, setIsLoadingReview] = useState(true);

    // user review 
    const [isUserReviewLeft, setIsUserReviewLeft] = useState(false);
    const [isLoadingUserReview, setIsLoadingUserReview] = useState(true);

    // is book check out?
    const [isCheckedOut, setIsCheckedOut] = useState(false);
    const [isLoadingChecked, setIsLoadingChecked] = useState(true);

    const bookId = (window.location.pathname).split("/")[2];

    useEffect(() => {
        const fetchBook = async () => {
            const url: string = `${REACT_APP_API}/api/books/${bookId}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(response.statusText);
            }

            const json = await response.json();
            const loadedBooks: BookModel = {
                id: json.id,
                title: json.title,
                author: json.author,
                description: json.description,
                copies: json.copies,
                copiesAvailable: json.copiesAvailable,
                category: json.category,
                img: json.img,
            };

            setBook(loadedBooks);
            setIsLoading(false);
        };
        fetchBook().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        })
    }, [isCheckedOut]);

    useEffect(() => {
        const fetchBookReviews = async () => {
            const reviewUrl: string = `${REACT_APP_API}/api/reviews/search/findByBookId?bookId=${bookId}`;
            const response = await fetch(reviewUrl);
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            const json = await response.json();
            const data = json._embedded.reviews;

            const reviews: ReviewModel[] = [];
            let wightedStarReviews: number = 0;

            for (const key in data) {
                reviews.push({
                    id: data[key].id,
                    userEmail: data[key].userEmail,
                    date: data[key].date,
                    rating: data[key].rating,
                    book_id: data[key].book_id,
                    reviewDescription: data[key].reviewDescription
                })
                wightedStarReviews += data[key].rating;
            }

            if (reviews) {
                const round = (Math.round(
                    (wightedStarReviews / reviews.length) * 2) / 2).toFixed(1);
                setTotalStarts(Number(round));
            }

            setReviews(reviews);
            setIsLoadingReview(false);
        }

        fetchBookReviews().catch((error: any) => {
            setIsLoadingReview(false);
            setHttpError(error.message);
        })
    }, [isUserReviewLeft]);

    useEffect(() => {
        const fetchCheckedOutBook = async () => {
            if (authContext?.isAuth) {
                const url = `${REACT_APP_API}/secure/book/checked?bookId=${bookId}`;
                const requestOption = {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        'Content-Type': 'application/json',
                    }
                };
                const response = await fetch(url, requestOption);
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                const json = response.json();
                json.then((r) => {
                    console.log(r)
                    setIsCheckedOut(r)
                })
                setIsLoadingChecked(false)
            }
        }
        fetchCheckedOutBook().catch((error: any) => {
            setIsLoadingChecked(false);
            setHttpError(error.message)
        })
    }, [authContext?.isAuth]);

    useEffect(() => {
        const fetchUserReview = async () => {
            if (authContext?.isAuth) {
                const url = `${REACT_APP_API}/secure/reviews/user/book?bookId=${bookId}`;
                const requestOption = {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        'Content-Type': 'application/json',
                    }
                };
                const response = await fetch(url, requestOption);
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                const json = response.json();
                json.then((r) => {
                    console.log(r)
                    setIsUserReviewLeft(r)
                })
                setIsLoadingUserReview(false)
            }
        }
        fetchUserReview().catch((error: any) => {
            setIsLoadingUserReview(false)
            setHttpError(error.message)
        })
    }, [authContext?.isAuth]);

    if (isLoading ||
        isLoadingReview ||
        isLoadingChecked ||
        isLoadingUserReview) {
        return (
            <SpinnerLoading />
        )
    }

    if (httpError) {
        return (
            <div className="container mt-5">
                <p>{httpError}</p>
            </div>
        )
    }

    async function checkoutBook() {
        const url = `${REACT_APP_API}/secure/checkout?bookId=${bookId}`;
        const requestOption = {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                'Content-Type': 'application/json',
            }
        };
        const response = await fetch(url, requestOption);
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        setIsCheckedOut(true)
    }

    async function submitReview(
        starInput: number,
        reviewDescription: string) {
        let bookId: string = "";
        if (book?.id) {
            bookId = book.id;
        }
        const reviewRequestModel = new ReviewRequestModel(
            starInput, bookId, reviewDescription
        );
        const url = `${REACT_APP_API}/secure/reviews/postReview`;
        const requestOption = {
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(reviewRequestModel)
        }
        const response = await fetch(url, requestOption);
        if (!response.ok) {
            throw new Error()
        }
        setIsUserReviewLeft(true);
    }

    return (
        <div>
            <div className="container d-none d-lg-block">
                <div className='row mt-5'>
                    <div className='col-sm-2 col-md-2'>
                        {book?.img
                            ?
                            <img
                                src={book?.img}
                                width='226'
                                height='349'
                                alt="book"
                            />
                            :
                            <img
                                src="./../../../images/BooksImages/book-default-img.png"
                                alt="book"
                                width='226'
                                height='349'
                            />
                        }
                    </div>
                    <div className="col-4 col-md-4 container">
                        <div className="ml-2">
                            <h2>{book?.title}</h2>
                            <h5 className="text-primary">
                                {book?.author}
                            </h5>
                            <p className="lead">
                                {book?.description}
                            </p>
                            <StarsReview
                                rating={totalStarts}
                                size={32}
                            />
                        </div>
                    </div>
                    <CheckoutAndReviewBox
                        book={book}
                        mobile={false}
                        isCheckout={isCheckedOut}
                        checkoutBook={checkoutBook}
                        isReviewLeft={isUserReviewLeft}
                        submitReview={submitReview}
                    />
                </div>
                <hr />
                <LatestReviews
                    reviews={reviews}
                    bookId={book?.id}
                    mobile={false}
                />
            </div>

            {/* for mobile */}
            <div className="container d-lg-none mt-5">
                <div className="
                d-flex
                justify-content-center
                align-items-center">
                    {book?.img
                        ?
                        <img
                            src={book?.img}
                            width='226'
                            height='349'
                            alt="book"
                        />
                        :
                        <img
                            src="./../../../images/BooksImages/book-default-img.png"
                            alt="book"
                            width='226'
                            height='349'
                        />
                    }
                </div>
                <div className="mt-4">
                    <div className="ml-2">
                        <h2>{book?.title}</h2>
                        <h5 className="text-primary">
                            {book?.author}
                        </h5>
                        <p className="lead">
                            {book?.description}
                        </p>
                        <StarsReview
                            rating={totalStarts}
                            size={32}
                        />
                    </div>
                </div>
                <CheckoutAndReviewBox
                    book={book}
                    mobile={true}
                    isCheckout={isCheckedOut}
                    checkoutBook={checkoutBook}
                    isReviewLeft={isUserReviewLeft}
                    submitReview={submitReview}
                />
                <hr />
                <LatestReviews
                    reviews={reviews}
                    bookId={book?.id}
                    mobile={true}
                />
            </div>
        </div>
    );
}