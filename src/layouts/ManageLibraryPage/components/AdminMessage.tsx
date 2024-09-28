import MessageModel from "../../../models/MessageModel.ts";
import React, {useState} from "react";

export const AdminMessage: React.FC<{
    message: MessageModel,
    submitResponse: any,
}> = (props, key) => {
    const [displayWarning, setDisplayWarning] = useState(false)
    const [response, setResponse] = useState<string>("");

    function handleSubmit() {
        if (props.message.id !== null && response !== "") {
            props.submitResponse(props.message.id, response);
            setDisplayWarning(false)
        } else {
            setDisplayWarning(true)
        }
    }

    return (
        <div key={props.message.id}>
            <div className="card mt-2 shadow p-3 bg-body rounded">
                <h5>
                   Case #{props.message.id}: {props.message.title}
                </h5>
                <h6>{props.message.userEmail}</h6>
                <p>{props.message.question}</p>
                <hr/>
                <div>
                    <h5>Response: </h5>
                    <form action="PUT">
                        {displayWarning &&
                        <div className="alert alert-danger" role="alert">
                            All fields must ne filled out
                        </div>
                        }
                        <div className="col-md-12 mb-3">
                            <label className="from-label">
                                Description
                            </label>
                            <textarea
                            className="form-control"
                            id="formControlTextarea1"
                            rows={3}
                            onChange={e => setResponse(e.target.value)}
                            value={response}
                            >
                            </textarea>
                        </div>
                        <div>
                            <button
                            type="button"
                            className="btn mt-3 btn-primary"
                            onClick={handleSubmit}
                            >
                                Submit Response
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}