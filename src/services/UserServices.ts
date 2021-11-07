import { IUser } from "../models/common";


export interface IUserResponse {
    data: IUser,
    support: {
        url: string,
        text: string
    }
}

export interface ILoginResponse {
    userDetails: IUser | null;
    isSuccess: boolean;
    message: string;
}

const login = (userName: string, password: string): Promise<ILoginResponse> => {
    return fetch('https://reqres.in/api/users/2', {
        method: 'GET'
    }).then((response: Response) => {
        return response.json();
    }).then((result: IUserResponse) => {
        if (result.data.first_name == userName && result.data.last_name == password) {
            return {
                userDetails: result.data,
                isSuccess: true,
                message: ''
            }
        }
        return {
            userDetails: null,
            isSuccess: false,
            message: 'User name or password incorrect'
        }
    }).catch((err: Error) => {
        return {
            userDetails: null,
            isSuccess: false,
            message: err.message
        }
    })

}

export { login };