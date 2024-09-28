import { useEffect, useState } from "react";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { Link } from "react-router-dom";
import CartBook from "../../models/CartBook";

export const CartPage = () => {
    const [httpError, setHttpError] = useState(null)
    const [cartBooks, setCartBooks] = useState<CartBook[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [checkout, setCheckout] = useState(false);
    const [clickBuy, setClickBuy] = useState(false);

    useEffect(() => {
        const fetchLoans = async () => {
            const url = `${process.env.REACT_APP_API}/secure/cart`;
            const requestOptions = {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    'Content-Type': 'application/json',
                }
            }
            const response = await fetch(url, requestOptions);

            if (!response.ok) {
                throw new Error(response.statusText);
            }

            const json = await response.json();
            console.log(json)
            setCartBooks(json.filter((r) => r.book.buy === false))
            setIsLoading(false)
        }
        fetchLoans().catch((error: any) => {
            setHttpError(error.message)
            setIsLoading(false)
        })
        window.scrollTo(0, 0)
    }, [checkout]);

    if (isLoading) {
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

    async function returnBook(bookId: number) {
        const url = `${process.env.REACT_APP_API}/secure/return?bookId=${bookId}`;
        const requestOptions = {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                'Content-Type': 'application/json',
            }
        }
        const response = await fetch(url, requestOptions);

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        if (clickBuy) {
            const url = `${process.env.REACT_APP_API}/secure/payment/returnFees`;
            const requestOptions = {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    'Content-Type': 'application/json',
                }
            }
            await fetch(url, requestOptions);
        }

        setCheckout(!checkout);
        setClickBuy(false)
    }

    console.log(cartBooks)
    return (
        <div className="container">
            <div className="mt-3">
                {/* Desktop */}
                <div className='d-none d-lg-block mt-2'>
                    {cartBooks.length > 0 ?
                        <>
                            <h5>Shopping Cart</h5>

                            {cartBooks.map(cartBook => (
                                <div key={cartBook.book.id}>
                                    <div className='row mt-3 mb-3'>
                                        <div className='col-4 col-md-4 container'>
                                            {cartBook.book?.img ?
                                                <img
                                                    src={cartBook.book?.img}
                                                    width='226'
                                                    height='349'
                                                    alt='Book'
                                                />
                                                :
                                                <img
                                                    src="./../../../../images/BooksImages/book-default-img.png"
                                                    width='226'
                                                    height='349'
                                                    alt='Book'
                                                />
                                            }
                                        </div>
                                        <div className='card col-3 col-md-3 container d-flex'>
                                            <div className='card-body'>
                                                <div className='mt-3'>
                                                    <h4>Options</h4>
                                                    <div className='list-group mt-3'>
                                                        {cartBook.book.buy
                                                        ? 
                                                        <button className="btn btn-success list-group-item">
                                                            Read
                                                        </button>
                                                        :
                                                        <Link
                                                            to={`/buy/${cartBook.book.id}`}
                                                            className='list-group-item list-group-item-action'>
                                                            Buy
                                                        </Link>
                                                        }

                                                        <button
                                                            data-bs-dismiss='modal'
                                                            className='list-group-item list-group-item-action'
                                                            aria-current='true'
                                                            onClick={() => { returnBook(cartBook.book.id) }}
                                                        >
                                                            Return Book
                                                        </button>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <hr />
                                </div>
                            ))}
                        </> :
                        <>
                            <h3 className='mt-3'>
                                Currently no books
                            </h3>
                            <Link className='btn btn-primary' to="/search">
                                Search for a new book
                            </Link>
                        </>
                    }
                </div>

                {/* Mobile */}
                <div className='container d-lg-none mt-2'>
                    {cartBooks.length > 0 ?
                        <>
                            <h5 className='mb-3'>Shopping Cart</h5>

                            {cartBooks.map(cartBook => (
                                <div key={cartBook.book.id}>
                                    <div className='d-flex justify-content-center align-items-center'>
                                        {cartBook.book?.img ?
                                            <img
                                                src={cartBook.book?.img}
                                                width='226'
                                                height='349'
                                                alt='Book' />
                                            :
                                            <img
                                                src="./../../../../images/BooksImages/book-default-img.png"
                                                width='226'
                                                height='349'
                                                alt='Book'
                                            />
                                        }
                                    </div>
                                    <div className='card d-flex mt-5 mb-3'>
                                        <div className='card-body container'>
                                            <div className='mt-3'>
                                                <h4>Options</h4>
                                                <div className='list-group mt-3'>
                                                {cartBook.book.buy
                                                        ? 
                                                        <button className="btn btn-success list-group-item">
                                                            Read
                                                        </button>
                                                        :
                                                        <Link
                                                            to={`/buy/${cartBook.book.id}`}
                                                            className='list-group-item list-group-item-action'>
                                                            Buy
                                                        </Link>
                                                        }

                                                    <button
                                                        data-bs-dismiss='modal'
                                                        className='list-group-item list-group-item-action'
                                                        aria-current='true'
                                                        onClick={() => { returnBook(cartBook.book.id) }}
                                                    >
                                                        Return Book
                                                    </button>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <hr />
                                </div>
                            ))}
                        </> :
                        <>
                            <h3 className='mt-3'>
                                Currently no books
                            </h3>
                            <Link className='btn btn-primary' to="/search">
                                Search for a new book
                            </Link>
                        </>
                    }
                </div>
            </div>
        </div>
    )
}