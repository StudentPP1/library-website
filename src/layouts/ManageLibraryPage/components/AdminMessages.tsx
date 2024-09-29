import {useContext, useEffect, useState} from "react";
import {Auth} from "../../../context/context.ts";
import MessageModel from "../../../models/MessageModel.ts";
import {SpinnerLoading} from "../../Utils/SpinnerLoading.tsx";
import {Pagination} from "../../Utils/Pagination.tsx";
import {AdminMessage} from "./AdminMessage.tsx";
import AdminMessageRequest from "../../../models/AdminMessageRequest.ts";
import {REACT_APP_API} from './../../../constants/index.ts'

export const AdminMessages = () => {
    const authContext = useContext(Auth)
    const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(true)
    const [httpError, setHttpError] = useState<boolean | null>(null)

    const [messages, setMessages] = useState<MessageModel[]>([])

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    // recall useEffect
    const [buttonSubmit, setButtonSubmit] = useState<boolean>(false);

    useEffect(() => {
        const fetchMessage = async () => {
            if (authContext?.isAuth) {
                const url = `${REACT_APP_API}/secure/messages/closed?closed=false&page=${currentPage - 1}&size=5`;
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
                setMessages(json.content)
                setTotalPages(json.totalPages);
            }
            setIsLoadingMessages(false)
        }
        fetchMessage().catch((error: any) => {
            setIsLoadingMessages(false)
            setHttpError(error.message)
        })
        window.scrollTo(0, 0);
    }, [authContext?.isAuth, currentPage, buttonSubmit]);

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

    async function submitResponse(id: string, response: string) {
        const url = `${REACT_APP_API}/secure/admin/message`
        if (authContext?.isAuth && id !== null && response !== '') {
            const requestModel: AdminMessageRequest = new AdminMessageRequest(id, response);
            const requestOptions = {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestModel)
            }
            const res = await fetch(url, requestOptions);
            if (!res.ok) {
                throw new Error(res.statusText);
            }
            setButtonSubmit(!buttonSubmit);
        }
    }

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber)
    }

    return (
        <div className='mt-3'>
            {messages.length > 0 ?
                <>
                    <h5>Pending Q/A: </h5>
                    {messages.map(message => (
                        <AdminMessage
                            message={message}
                            key={message.id}
                            submitResponse={submitResponse}
                        />
                    ))}
                </>
                :
                <h5>No pending Q/A</h5>
            }
            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate}/>}
        </div>
    );
}