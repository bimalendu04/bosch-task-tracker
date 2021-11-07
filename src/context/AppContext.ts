import React from "react";
import { ICompany, ITask, IUser } from "../models/common";

export interface IAppContext {
    isAuthenticated: boolean;
    authUserDetails: IUser | null;
    searchedText: string;
    tasks: ITask[];
    allTasks: ITask[];
    companies: ICompany[];
    updateIsAuth: (value: boolean) => void;
    updateloggedUser: (value: IUser) => void;
    updateTasks: (task: ITask) => void;
    addTasks: (task: ITask) => void;
    deleteTasks: (id: string) => void;
    updateSearchText: (value: string) => void;
}

const AppContext = React.createContext<IAppContext>({
    isAuthenticated: false,
    authUserDetails: null,
    searchedText:'',
    tasks: [],
    allTasks: [],
    companies: [],
    updateIsAuth: (value: boolean) => { },
    updateloggedUser: (value: IUser) => { },
    updateTasks: (task: ITask) => { },
    addTasks: (task: ITask) => { },
    deleteTasks: (id: string) => { },
    updateSearchText: (value: string) => { },
});

export const AppProvider = AppContext.Provider;
export default AppContext;