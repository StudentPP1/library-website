import {Link} from "react-router-dom";

export const ExploreTopBooks = () => {
    return (
        <div className="mb-4 bg-white header">
            <div className="
            container-fluid
            py-5
            text-white
            d-flex
            justify-content-center
            align-items-center">
                <div>
                    <h1 className="display-5 fw-bold text-dark">
                        Find your next adventure
                    </h1>
                    <p className="col-md-8 fs-4 text-dark">
                        Where would you like to go next?
                    </p>
                    <Link
                        to="/search"
                        type="button"
                        className="btn main-color btn-lg text-white">
                        Explore top books
                    </Link>
                </div>
            </div>
            <hr />
        </div>
    );
}