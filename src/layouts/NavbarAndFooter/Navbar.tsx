import {Link, NavLink} from "react-router-dom";
import {useContext} from "react";
import {Auth} from "../../context/context.ts";

export const Navbar = () => {
    const authContext = useContext(Auth);

    return (
        <nav className="navbar navbar-expand-lg navbar-dark main-color py-3">
            <div className="container-fluid">
              <span className="navbar-brand">
                  Library
              </span>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNavDropdown"
                    aria-controls="navbarNavDropdown"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                  <span className="navbar-toggler-icon">

                  </span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <NavLink to="/home" className="nav-link">
                                Home
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/search" className="nav-link">
                                Search books
                            </NavLink>
                        </li>
                        {authContext?.isAuth &&
                            <li className="nav-item">
                                <NavLink to="/shelf" className="nav-link">
                                    Shelf
                                </NavLink>
                            </li>
                        }
                        {authContext?.isAuth &&
                            <li className="nav-item">
                                <NavLink to="/cart" className="nav-link">
                                    Cart
                                </NavLink>
                            </li>
                        }
                         {authContext?.isAuth && authContext?.role === "ADMIN"
                            ?
                            <li className="nav-item">
                                <NavLink to="/admin" className="nav-link">
                                    Admin
                                </NavLink>
                            </li>
                            :
                            <></>
                        }
                    </ul>
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item m-1">
                            <Link type="button"
                                  className="btn btn-outline-light"
                                  to={authContext?.isAuth ? "/" : "/login"}
                                  onClick={() => {
                                      if (authContext?.isAuth) {
                                        authContext.setIsAuth(false);
                                        localStorage.clear();
                                     }
                                  }}
                            >
                                {authContext?.isAuth ? "Logout" : "Login"}
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}