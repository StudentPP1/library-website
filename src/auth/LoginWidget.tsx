import {Auth} from "../context/context.ts";
import {useContext} from "react";
import {Link} from "react-router-dom";
import {REACT_APP_API} from '../constants/index.ts'

export const LoginWidget = () => {
    const authContext = useContext(Auth);

    const sing_in = async () => {
        const form = document.querySelector('form');
        if (form != null) {
            const username = (form.elements[0] as HTMLInputElement).value;
            const email = (form.elements[1] as HTMLInputElement).value;
            const password = (form.elements[2] as HTMLInputElement).value;
    
            const url: string = `${REACT_APP_API}/api/login`
    
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
                    sing_in().then(() => {
                        authContext?.setIsAuth(true);
                    })
                }}
                      to="/home">
                    Sing in
                </Link>
            </form>

        </div>
    )
}