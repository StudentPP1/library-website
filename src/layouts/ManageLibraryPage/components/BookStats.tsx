import React, { useEffect, useState } from "react";
import BookModel from "../../../models/BookModel";
import {REACT_APP_API} from './../../../constants/index.ts'

export const BookStats: React.FC<{
    book: BookModel,
    deleteBook: any,
}> = (props) => {
    const [quantity, setQuantity] = useState<number>(0);
    const [remain, setRemain] = useState<number>(0);
    const [addQuantity, setAddQuantity] = useState<number>(1);
    const [deleteQuantity, setDeleteQuantity] = useState<number>(1);

    useEffect(() => {
        const fetchBook = () => {
            props.book.copies
                ? setQuantity(props.book.copies)
                : setQuantity(0)

            props.book.copiesAvailable
                ? setRemain(props.book.copiesAvailable)
                : setRemain(0)
        };
        fetchBook()
    }, [])

    async function increase() {
        const url = `${REACT_APP_API}/secure/admin/increase/book/quantity?bookId=${props.book.id}&quantity=${addQuantity}`
        const requestOptions = {
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                'Content-Type': "application/json",
                'Access-Control-Allow-Origin' : '*',
            }
        }
        const response = await fetch(url, requestOptions);
        if (!response.ok) {
            throw new Error("Something went wrong")
        }
        setQuantity(quantity + addQuantity);
        setRemain(quantity + addQuantity);
        setAddQuantity(1)
    }

    async function decrease() {
        if (deleteQuantity <= quantity) {
            const url = `${REACT_APP_API}/secure/admin/decrease/book/quantity?bookId=${props.book.id}&quantity=${deleteQuantity}`
            const requestOptions = {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    'Content-Type': "application/json",
                    'Access-Control-Allow-Origin' : '*',
                }
            }
            const response = await fetch(url, requestOptions);
            if (!response.ok) {
                throw new Error("Something went wrong")
            }
            setQuantity(quantity - deleteQuantity);
            setRemain(quantity - deleteQuantity)
            setDeleteQuantity(0)
        }
    }

    async function deleteBook() {
        const url = `${REACT_APP_API}/secure/admin/delete/book?bookId=${props.book.id}`
        const requestOptions = {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                'Content-Type': "application/json",
                'Access-Control-Allow-Origin' : '*',
            }
        }
        const response = await fetch(url, requestOptions);
        if (!response.ok) {
            throw new Error("Something went wrong")
        }
        props.deleteBook()
    }

    return (
        <div className='card mt-3 shadow p-3 mb-3 bg-body rounded'>
            <div className='row g-0'>
                <div className='col-md-2'>
                    <div className='d-none d-lg-block'>
                        {props.book.img ?
                            <img src={props.book.img} width='123' height='196' alt='Book' />
                            :
                            <img src='./../../../../images/BooksImages/book-default-img.png'
                                width='123' height='196' alt='Book' />
                        }
                    </div>
                    <div className='d-lg-none d-flex justify-content-center align-items-center'>
                        {props.book.img ?
                            <img src={props.book.img} width='123' height='196' alt='Book' />
                            :
                            <img src='./../../../../images/BooksImages/book-default-img.png'
                                width='123' height='196' alt='Book' />
                        }
                    </div>
                </div>
                <div className='col-md-6'>
                    <div className='card-body'>
                        <h5 className='card-title'>{props.book.author}</h5>
                        <h4>{props.book.title}</h4>
                        <p className='card-text'> {props.book.description} </p>
                    </div>
                </div>
                <div className='mt-3 col-md-4'>
                    <div className='d-flex justify-content-center align-items-center'>
                        <p>Total Quantity: <b>{quantity}</b></p>
                    </div>
                    <div className='d-flex justify-content-center align-items-center'>
                        <p>Books Remaining: <b>{remain}</b></p>
                    </div>
                </div>
                <div className='mt-3 col-md-1'>
                    <div className='d-flex justify-content-start'>
                        <button
                            className='m-1 btn btn-md btn-danger'
                            onClick={deleteBook}
                        >
                            Delete
                        </button>
                    </div>
                </div>

                <div className="input-group mb-3 row">
                    <button 
                    className="btn btn-md main-color text-white col-5" 
                    type="button" 
                    id="button-addon1"
                    onClick={increase}
                    >
                          Add Quantity
                        </button>
                    <input 
                        type="text" 
                        onChange={(e) => setAddQuantity(Number(e.target.value))}
                        value={addQuantity}
                        className="form-control col-7" 
                    />
                </div>

                <div className="input-group mb-3 row">
                    <button 
                    className='m1 btn btn-md btn-warning col-5'
                    type="button" 
                    id="button-addon1"
                    onClick={decrease}
                    >
                          Decrease Quantity
                        </button>
                    <input 
                    type="text" 
                    onChange={(e) => setDeleteQuantity(Number(e.target.value))}
                    value={deleteQuantity}
                    className="form-control col-7" 
                    />
                </div>
            </div>
        </div>
    );
};
