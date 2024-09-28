import {Link, NavLink} from "react-router-dom";
import {useContext} from "react";
import {Auth, AuthContextType} from "../../context/context.ts";

export const Navbar = () => {
    const {isAuth, setIsAuth, role, setRole} = useContext<AuthContextType>(Auth);

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
                        {isAuth &&
                            <li className="nav-item">
                                <NavLink to="/shelf" className="nav-link">
                                    Shelf
                                </NavLink>
                            </li>
                        }
                        {isAuth &&
                            <li className="nav-item">
                                <NavLink to="/cart" className="nav-link">
                                    Cart
                                </NavLink>
                            </li>
                        }
                         {isAuth && role === "ADMIN"
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
                                  to={isAuth ? "/" : "/login"}
                                  onClick={() => {
                                      if (isAuth) {
                                          setIsAuth(false);
                                          localStorage.clear();
                                     }
                                  }}
                            >
                                {isAuth ? "Logout" : "Login"}
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}