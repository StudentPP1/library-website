import React from "react";
import ReviewModel from "../../models/ReviewModel.ts";
import {StarsReview} from "./StarsReview.tsx";

export const Review: React.FC<{
    review: ReviewModel
}> = (props) => {
    const date = new Date(props.review.date);
    const longMonth = date.toLocaleDateString(
        "en-us", {month: "long"});
    const dateDay = date.getDay();
    const dateYear = date.getFullYear();
    const dateRender = longMonth + ' ' + dateDay + ' ' + longMonth + ', ' + dateYear;

    return (
        <div>
            <div className="col-sm-8 col-md-8">
                <h5>{props.review.userEmail}</h5>
                <div className="row">
                    <div className="col">
                        {dateRender}
                    </div>
                    <div className="col">
                        <StarsReview size={16} rating={props.review.rating} />
                    </div>
                </div>
                <div className="mt-2">
                    <p>
                        {props.review.reviewDescription}
                    </p>
                </div>
            </div>
            <hr/>
        </div>
    )
}