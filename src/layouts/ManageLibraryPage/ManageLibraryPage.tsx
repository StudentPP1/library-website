import { useState } from "react";
import { AdminMessages } from "./components/AdminMessages.tsx";
import { AddNewBook } from "./components/AddNewBook.tsx";
import { ChangeQuantity } from "./components/ChangeQuantity.tsx";

export const ManageLibraryPage = () => {
  const [changeBooksClick, setChangeBooksClick] = useState<boolean>(false);
  const [messagesClick, setMessagesClick] = useState<boolean>(false);
  
  function addBookClickFunc() {
    setChangeBooksClick(false);
    setMessagesClick(false);
  }
  function changeBooksClickFunc() {
    setChangeBooksClick(true);
    setMessagesClick(false);
  }
  function messagesClickFunc() {
    setMessagesClick(true);
    setChangeBooksClick(false);
  }

  return (
    <div className="container">
      <div className="mt-5">
        <h3>Manage Library</h3>
        <nav>
          <div className="nav nav-tabs" id="nav-tab" role="tablist">
            <button
              className="nav-link active"
              id="nav-add-book-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-add-book"
              type="button"
              role="tab"
              aria-controls="nav-add-book"
              aria-selected="false"
              onClick={addBookClickFunc}
            >
              Add new book
            </button>
            <button
              className="nav-link"
              id="nav-quantity-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-quantity"
              type="button"
              role="tab"
              aria-controls="nav-quantity"
              aria-selected="true"
              onClick={changeBooksClickFunc}
            >
              Change quantity
            </button>
            <button
              className="nav-link"
              id="nav-messages-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-messages"
              type="button"
              role="tab"
              aria-controls="nav-messages"
              aria-selected="false"
              onClick={messagesClickFunc}
            >
              Messages
            </button>
          </div>
        </nav>
        <div className="tab-content" id="nav-tabContent">
          <div
            className="tab-pane fade show active"
            id="nav-add-book"
            role="tabpanel"
            aria-labelledby="nav-add-book-tab"
          >
            <AddNewBook />
          </div>
          <div
            className="tab-pane fade"
            id="nav-quantity"
            role="tabpanel"
            aria-labelledby="nav-quantity-tab"
          >
            {changeBooksClick ? <ChangeQuantity /> : <></>}
          </div>
          <div
            className="tab-pane fade"
            id="nav-messages"
            role="tabpanel"
            aria-labelledby="nav-messages-tab"
          >
            {messagesClick ? <AdminMessages /> : <></>}
          </div>
        </div>
      </div>
    </div>
  );
};
