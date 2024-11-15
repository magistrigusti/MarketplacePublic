import { createContext, useContext } from "react";
import { IUser } from "../types/User";

// context for storing the user object
const UserContext = createContext<IUser | null | undefined>(null);

export default UserContext;

// a custom hook to access the user object from the context easily
export const useUser = () => {
	const user = useContext(UserContext);
	return user;
};
