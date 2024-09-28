import {Link} from "react-router-dom";
import {useContext} from "react";
import {Auth} from "../../../context/context.ts";

export const LibraryServices = () => {
    const {isAuth} = useContext(Auth);

    return (
        <div className='container my-5'>
            <div className='row p-4 align-items-center border shadow-lg'>
                <div className='col-lg-7 p-3'>
                    <h1 className='display-4 fw-bold'>
                        Can't find what you are looking for?
                    </h1>
                    <p className='lead'>
                        If you cannot find what you are looking for,
                        send our library admin's a personal message!
                    </p>
                    <div className='d-grid gap-2 justify-content-md-start mb-4 mb-lg-3'>
                        <Link className='btn main-color btn-lg text-white'
                              to= {isAuth ? "/messages" : "/login"}>
                            {isAuth ? "Library Services" : "Sing in"}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}