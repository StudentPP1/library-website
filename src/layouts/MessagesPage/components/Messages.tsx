import {useContext, useEffect, useState} from "react";
import {Auth} from "../../../context/context.ts";
import MessageModel from "../../../models/MessageModel.ts";
import {SpinnerLoading} from "../../Utils/SpinnerLoading.tsx";
import {Pagination} from "../../Utils/Pagination.tsx";
import {REACT_APP_API} from './../../../constants/index.ts'

export const Messages = () => {
    const authContext = useContext(Auth);
    const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(true);
    const [httpError, setHttpError] = useState<boolean | null>(null);

    // messages
    const [messages, setMessages] = useState<MessageModel[]>([]);

    // pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetchMessages = async () => {
            if (authContext?.isAuth) {
                const url = `${REACT_APP_API}/secure/messages?page=${currentPage - 1}&size=5`;
                const requestOptions = {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        'Content-Type': 'application/json',
                    }
                }
                const response = await fetch(url, requestOptions);
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                const json = await response.json();
                console.log(json);
                setMessages(json.content);
                setTotal(json.totalPages);
            }
            setIsLoadingMessages(false);
        }
        fetchMessages().catch((error: any) => {
            setIsLoadingMessages(false);
            setHttpError(error.message);
        })
        window.scrollTo(0, 0);
    }, [authContext?.isAuth, currentPage]);

    if (isLoadingMessages) {
        return (
            <SpinnerLoading/>
        )
    }

    if (httpError) {
        return (
            <div className="container mt-5">
                <p>{httpError}</p>
            </div>
        )
    }

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    }

    return (
        <div className='mt-2'>
            {messages.length > 0 ?
                <>
                    <h5>Current Q/A: </h5>
                    {messages.map(message => (
                        <div key={message.id}>
                            <div className='card mt-2 shadow p-3 bg-body rounded'>
                                <h5>Case #{message.id}: {message.title}</h5>
                                <h6>{message.userEmail}</h6>
                                <p>{message.question}</p>
                                <hr/>
                                <div>
                                    <h5>Response: </h5>
                                    {message.response && message.adminEmail ?
                                        <>
                                            <h6>{message.adminEmail} (admin)</h6>
                                            <p>{message.response}</p>
                                        </>
                                        :
                                        <p><i>Pending response from administration. Please be patient.</i></p>
                                    }
                                </div>
                            </div>
                        </div>
                    ))}
                </>
                :
                <h5>All questions you submit will be shown here</h5>
            }
            {total > 1 && <Pagination currentPage={currentPage} totalPages={total} paginate={paginate}/>}
        </div>
    )
}