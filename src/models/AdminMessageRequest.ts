class AdminMessageRequest {
    id: string;
    response: string;

    constructor(id: string, response: string) {
        this.id = id;
        this.response = response;
    }
}

export default AdminMessageRequest;