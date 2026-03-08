import { createContext } from "react";
import type { UserContextType } from "../types/userContext";

const UserContext = createContext<UserContextType | null>(null);

export default UserContext;