import { useEffect, useState } from "react";
import BookModel from "../../../models/BookModel";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Pagination } from "../../Utils/Pagination";
import { BookStats } from "./BookStats";
import { REACT_APP_API } from "../../../constants";

export const ChangeQuantity = () => {
  const [books, setBooks] = useState<BookModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [bookDelete, setBookDelete] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      const url: string = `${REACT_APP_API}/api/books?page=${
        currentPage - 1
      }&size=${5}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': "application/json",
          'Access-Control-Allow-Origin' : '*',
        }
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const json = await response.json();
      const data = json._embedded.books;
      console.log(json)
      setTotalAmount(json.page.totalElements);
      setTotalPages(json.page.totalPages);

      const loadedBooks: BookModel[] = [];

      for (const key in data) {
        loadedBooks.push({
          id: data[key].id,
          title: data[key].title,
          author: data[key].author,
          description: data[key].description,
          copies: data[key].copies,
          copiesAvailable: data[key].copiesAvailable,
          category: data[key].category,
          img: data[key].img,
        });
      }

      setBooks(loadedBooks);
      setIsLoading(false);
    };

    fetchBooks().catch((error: any) => {
      setIsLoading(false);
      setHttpError(error.message);
    });
    // scroll to top of page
    window.scrollTo(0, 0);
  }, [currentPage, bookDelete]);

  const lastBookIndex: number = currentPage * 5;
  const firstBookIndex: number = lastBookIndex - 5;
  let lastItem = 5 * currentPage <= totalAmount ? 5 * currentPage : totalAmount;

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const deleteBook = () => {
    setBookDelete(!bookDelete)
  }

  if (isLoading) {
    return <SpinnerLoading />;
  }

  if (httpError) {
    return (
      <div className="container mt-5">
        <p>{httpError}</p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      {totalAmount > 0 ? (
        <>
          <div className="mt-3">
            <h3>Number of results: ({totalAmount})</h3>
          </div>
          <p>
            {firstBookIndex + 1} to {lastItem} of {totalAmount} items:
          </p>
          {books.map((book) => (
            <BookStats 
            book={book} 
            key={Number(book.id)}
            deleteBook={deleteBook}
            />
          ))}
        </>
      ) : (
        <h5>Add a book before changing quantity</h5>
      )}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          paginate={paginate}
        />
      )}
    </div>
  );
};
