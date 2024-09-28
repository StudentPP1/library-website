import {useContext, useState} from "react";
import {Auth} from "../../../context/context.ts";
import MessageModel from "../../../models/MessageModel.ts";

export const PostMessage = () => {
    const {isAuth, setIsAuth} = useContext(Auth);
    const [title, setTitle] = useState<string>('');
    const [question, setQuestion] = useState<string>('');
    const [displayWarning, setDisplayWarning] = useState<boolean>(false);
    const [displaySuccess, setDisplaySuccess] = useState<boolean>(false);

    async function submitQuestion() {
        const url = `${process.env.REACT_APP_API}/secure/add/message`
        if (isAuth && title !== '' && question !== '') {
            const messageRequestModel: MessageModel = new MessageModel(title, question);
            const requestOptions = {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(messageRequestModel)
            }
            const response = await fetch(url, requestOptions);
            if (!response.ok) {
                throw new Error(response.statusText);
            }

            setTitle('')
            setQuestion('')
            setDisplayWarning(false)
            setDisplaySuccess(true)
        } else {
            setDisplayWarning(true)
            setDisplaySuccess(false)
        }
    }

    return (
        <div className="card mt-3">
            <div className="card-header">
                Ask question
            </div>
            <div className="card-body">
                <form method="POST">
                    {displayWarning &&
                        <div className="alert alert-danger" role="alert">
                            All fields must ne filled out
                        </div>
                    }
                    {displaySuccess &&
                        <div className="alert alert-success" role="alert">
                            Question added successfully
                        </div>
                    }
                    <div className="mb-3">
                        <label className="form-label">
                            Title
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="formControlInput1"
                            placeholder="Title"
                            onChange={e => setTitle(e.target.value)}
                            value={title}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">
                            Question
                        </label>
                        <textarea
                            className="form-control"
                            id="formControlTextarea1"
                            rows={3}
                            onChange={e => setQuestion(e.target.value)}
                            value={question}
                        >
                        </textarea>
                    </div>

                    <div>
                        <button
                            type="button"
                            className="btn mt-3 btn-primary"
                            onClick={submitQuestion}
                        >
                            Submit Question
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}