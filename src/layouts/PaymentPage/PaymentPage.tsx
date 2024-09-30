import { useContext, useEffect, useState } from "react"
import { Auth, AuthContextType } from "../../context/context"
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Link } from "react-router-dom";
import PaymentInfoRequest from "../../models/PaymentInfoRequest";
import {REACT_APP_API} from './../../constants/index.ts'

export const PaymentPage = () => {
    const authContext = useContext<AuthContextType | null>(Auth);
    const [httpError, setHttpError] = useState(false)
    const [submitDisabled, setSubmitDisabled] = useState(false);
    const [fees, setFees] = useState(0)
    const [isLoadingFees, setIsLoadingFees] = useState(true)
    const [email, setEmail] = useState(undefined)

    const bookId = (window.location.pathname).split("/")[2];

    useEffect(() => {
        const fetchFees = async () => {
            if (authContext?.isAuth) {
                const url = `${REACT_APP_API}/secure/payment/search/price?bookId=${bookId}`
                const requestOptions = {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        'Content-Type': "application/json",
                        'Access-Control-Allow-Origin' : '*',
                    }
                };
                const response = await fetch(url, requestOptions);
                console.log(response)
                if (!response.ok) {
                    console.log("error")
                    throw new Error("Something went wrong")
                }
                const json = await response.json();
                setFees(json.amount);
                setEmail(json.userEmail);
                setIsLoadingFees(false)
            }
        }
        fetchFees().catch((error: any) => {
            setIsLoadingFees(false)
            setHttpError(error.message)
        })
    }, [authContext?.isAuth])

    const elements = useElements();
    const stripe = useStripe();

    async function checkout() {
        if (!stripe || !elements || !elements.getElement(CardElement)) {
            return;
        }
        setSubmitDisabled(true);

        let paymentInfo = new PaymentInfoRequest(Math.round(fees * 100), "USD", email);
        const paymentUrl = `${REACT_APP_API}/secure/payment/payment-intent`;
        const requestOptions = {
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                'Content-Type': "application/json",
                'Access-Control-Allow-Origin' : '*',
            },
            body: JSON.stringify(paymentInfo)
        };
        const paymentResponse = await fetch(paymentUrl, requestOptions);

        if (!paymentResponse.ok) {
            setHttpError(true)
            setSubmitDisabled(false)
            throw new Error("Something went wrong")
        }

        const json = await paymentResponse.json();
        console.log(json)

        stripe.confirmCardPayment(
            json.client_secret,
            {
                payment_method: {
                    card: elements.getElement(CardElement)!,
                    billing_details: {
                        email: email
                    }
                }
            }, { handleActions: false }
        ).then(async function (result: any) {
            if (result.error) {
                console.log(result)
                setSubmitDisabled(false)
                alert("There was an error")
            } else {
                console.log(1)
                const url2 = `${REACT_APP_API}/secure/payment/payment-complete`;
                const requestOptions2 = {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        'Content-Type': "application/json",
                        'Access-Control-Allow-Origin' : '*',
                    }
                };
                const resposne2 = await fetch(url2, requestOptions2);
                if (!resposne2.ok) {
                    setHttpError(true)
                    setSubmitDisabled(false)
                    throw new Error("Something went wrong")
                }

                // TODO delete book 
                setFees(0)
                setSubmitDisabled(false)
            }
        }).then(async function () {
            const url = `${REACT_APP_API}/secure/buy/book?bookId=${bookId}`
            const requestOptions = {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    'Content-Type': "application/json",
                    'Access-Control-Allow-Origin' : '*',
                }
            };
            await fetch(url, requestOptions);
        });
        setHttpError(false)
    }

    if (isLoadingFees) {
        return (
            <SpinnerLoading />
        )
    }
    if (httpError) {
        return (
            <div className="container m-5">
                <h5>{httpError}</h5>
            </div>
        )
    }
    console.log(fees)
    return (
        <div className="container">
            {fees > 0 &&
                <div className="card mt-3">
                    <h5 className="card-header">
                        Fees pending: <span className="text-danger">${fees}</span>
                    </h5>
                    <div className="card-body">
                        <h5 className="card-title mb-3">
                            Credit card
                        </h5>
                        <CardElement id="card-element" />
                        <button
                            onClick={checkout}
                            type="button"
                            className="btn btn-md main-color text-white mt-3"
                            disabled={submitDisabled}>
                            Pay fees
                        </button>
                    </div>
                </div>
            }

            {fees === 0 &&
                <div className="mt-3">
                    <h5>You have no fees!</h5>
                    <Link
                        type="button"
                        className="btn main-color text-white"
                        to="/search"
                    >
                        Explore top books
                    </Link>
                </div>
            }

            {submitDisabled && <SpinnerLoading />}
        </div>
    )
}