
export class Agent {
    constructor() { }

    communicate() { }

    _request() {
        const response = undefined
        const request = undefined
        return {
            response,
            request
        }
    }

    request() {
        return this._request()
    }
}