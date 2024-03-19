import {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  FC,
} from "react";

type UserIdContextType = {
  userId: string;
  setUserId: Dispatch<SetStateAction<string>>;
};

export const UserIdContext = createContext<UserIdContextType>({
  userId: "",
  setUserId: () => {},
});

const UserIdProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [userId, setUserId] = useState("");

  return (
    <UserIdContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserIdContext.Provider>
  );
};

export default UserIdProvider;
