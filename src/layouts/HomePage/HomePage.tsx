import {ExploreTopBooks} from "./components/ExploreTopBooks.tsx";
import {Carousel} from "./components/Carousel.tsx";
import {Heros} from "./components/Heros.tsx";
import {LibraryServices} from "./components/LibraryService.tsx";

export const HomePage = () => {
    return (
        <>
            <ExploreTopBooks/>
            <Carousel/>
            <Heros/>
            <LibraryServices/>
        </>
    );
}