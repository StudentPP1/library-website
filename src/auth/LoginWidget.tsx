import {Auth, AuthContextType} from "../context/context.ts";
import {useContext} from "react";
import {Link} from "react-router-dom";

export const LoginWidget = () => {
    const {isAuth, setIsAuth, role, setRole} = useContext(Auth);

    const singin = async () => {
        const form = document.querySelector('form');
        const username = form.elements[0].value;
        const email = form.elements[1].value;
        const password = form.elements[2].value;

        const url: string = `${process.env.REACT_APP_API}/api/login`

        const response = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': "application/json",
                'Access-Control-Allow-Origin' : '*'
            },
            body: JSON.stringify({
                username: username,
                password: password,
                email: email
            })
        });

        const json = await response.json();
        console.log(json)
        localStorage.setItem("role", json["role"]);
        localStorage.setItem("token", json["token"]);
    }

    return (
        <div className="mt-5 container d-flex flex-column min-vh-100">
            <form className="mt-5">
                <div className="mb-3">
                    <label className="form-label">
                        User name
                    </label>
                    <input
                        className="form-control"
                        type="text"
                        placeholder="username"
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">
                        Email address
                    </label>
                    <input
                        className="form-control"
                        type="email"
                        placeholder="name@exaple.com"
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">
                        Password
                    </label>
                    <input
                        className="form-control"
                        type="password"
                        placeholder="12345678"
                    />
                </div>

                <Link className="btn btn-primary" type="submit" onClick={() => {
                    singin().then(() => {
                        setIsAuth(true);
                    })
                }}
                      to="/home">
                    Sing in
                </Link>
            </form>

        </div>
    )
}