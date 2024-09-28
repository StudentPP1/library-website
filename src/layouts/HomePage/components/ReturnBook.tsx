import * as React from "react";
import BookModel from "../../../models/BookModel";
import {Link} from "react-router-dom";
// FC - functional component
export const ReturnBook: React.FC<{book: BookModel}> = (props) => {
    return (
        <div className='col-md-4 col-lg-4'>
            <div className='column justify-content-center align-items-center text-center'>
                {/* if book has img display it or default img */}
                {props.book.img
                    ?
                    <img
                        src={props.book.img}
                        width="151"
                        height="230"
                        alt='book'
                    />
                    :
                    <img
                        src='../../../../images/BooksImages/book-default-img.png'
                        width="151"
                        height="230"
                        alt='book'
                    />
                }
                <h6 className='mt-2'>{props.book.title}</h6>
                <p>{props.book.author}</p>
                <Link
                    className='btn main-color text-white'
                    to={`/checkout/${props.book.id}`}                 >
                    Reserve
                </Link>
            </div>
        </div>
    );
}