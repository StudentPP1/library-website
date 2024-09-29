import {useEffect, useState} from "react";
import ReviewModel from "../../../models/ReviewModel.ts";
import {SpinnerLoading} from "../../Utils/SpinnerLoading.tsx";
import {Review} from "../../Utils/Review.tsx";
import {Pagination} from "../../Utils/Pagination.tsx";
import {REACT_APP_API} from './../../../constants/index.ts'

export const ReviewListPage = () => {
    const [reviews, setReviews] = useState<ReviewModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [reviewsPerPage] = useState(5);
    const [totalAmount, setTotalAmount] = useState(0);
    const [pages, setPages] = useState(0);

    const bookId = (window.location.pathname).split("/")[2];

    useEffect(() => {
        const fetchBookReviews = async () => {
            const reviewUrl: string = `${REACT_APP_API}/api/reviews/search/findByBookId?bookId=${bookId}&page=${currentPage - 1}&size=${reviewsPerPage}`;
            const response = await fetch(reviewUrl);
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            const json = await response.json();
            const data = json._embedded.reviews;

            setTotalAmount(json.page.totalElements);
            setPages(json.page.totalPages);

            const reviews: ReviewModel[] = [];

            for (const key in data) {
                reviews.push({
                    id: data[key].id,
                    userEmail: data[key].userEmail,
                    date: data[key].date,
                    rating: data[key].rating,
                    book_id: data[key].book_id,
                    reviewDescription: data[key].reviewDescription
                })
            }

            setReviews(reviews);
            setIsLoading(false);
        }

        fetchBookReviews().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        })
    }, [currentPage]);

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

    const indexOfLastReview: number = currentPage * reviewsPerPage;
    const indexOfFirstReview: number = indexOfLastReview - reviewsPerPage;

    let lastItem = reviewsPerPage * currentPage <= totalAmount
        ? reviewsPerPage * currentPage
        : totalAmount

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    }

    return (
        <div className="container m-5">
            <div>
                <h3>Comments: ({reviews.length})</h3>
            </div>
            <p>
                {indexOfFirstReview + 1} to {lastItem} of {totalAmount} items
            </p>
            <div className="row">
                {reviews.map(review => (
                    <Review review={review} key={review.id} />
                ))}
            </div>

            {pages > 1 && <Pagination
                    currentPage={currentPage}
                    totalPages={pages}
                    paginate={paginate}
            />}
        </div>
    )
}