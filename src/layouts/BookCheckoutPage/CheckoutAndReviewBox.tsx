import BookModel from "../../models/BookModel.ts";
import {Link} from "react-router-dom";
import {FC, useContext} from "react";
import {Auth} from "../../context/context.ts";
import {LeaveReview} from "../Utils/LeaveReview.tsx";

export const CheckoutAndReviewBox: FC<{
    book: BookModel | undefined,
    mobile: boolean,
    isCheckout: boolean,
    checkoutBook: any,
    isReviewLeft: boolean,
    submitReview: any,
}> = (props) => {
    const authContext = useContext(Auth);

    function buttonRender() {
        if (authContext?.isAuth) {
            if (!props.isCheckout) {
                return (
                    <button
                        onClick={() => props.checkoutBook()}
                        className="btn btn-success btn-lg">
                        Check out
                    </button>
                )
            } else if (props.isCheckout) {
                return (
                    <p>
                        Book checked out!
                    </p>
                )
            } 
        }
        return (
            <Link to={'/login'}  className="btn btn-success btn-lg">
                Sing in
            </Link>
        )
    }
    
    function reviewRender() {
        if (authContext?.isAuth && !props.isReviewLeft) {
            return(
                <p>
                    <LeaveReview
                    submitReview={props.submitReview}/>
                </p>
            )
        } else if (authContext?.isAuth && props.isReviewLeft) {
            return (
                <p>
                    <b>
                        Thank you for review!
                    </b>
                </p>
            )
        }
        return (
            <div>
                <hr/>
                <p>
                    Sign in to be able to leave a review
                </p>
            </div>
        )
    }

    return (
        <div className={props.mobile
            ? 'card d-flex mt-5'
            : 'card col-3 container d-flex mb-5'}>
            <div className="card-body container">
                <div className="mt-3">
                    {props.book
                        && props.book.copiesAvailable
                        && props.book.copiesAvailable > 0
                        ?
                        <h4 className="text-success">Available</h4>
                        :
                        <h4 className="text-danger">Wait List</h4>
                    }
                </div>

                {buttonRender()}

                <hr/>
                <p className="mt-3">
                    This number can change util placing order has been complete
                </p>
                {reviewRender()}
            </div>
        </div>
    );
}