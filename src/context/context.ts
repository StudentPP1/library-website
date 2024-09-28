import {createContext} from "react";

export type AuthContextType = {
    isAuth?: boolean | null;
    setIsAuth: (isAuth: boolean) => void;
    role?: string | null;
    setRole: (role: string | null) => void;
}

export const Auth = createContext<AuthContextType | null>(null);

