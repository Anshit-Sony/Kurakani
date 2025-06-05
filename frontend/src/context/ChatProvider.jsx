import { useEffect, useState, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";


const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [SelectedChat, setSelectedChat]=useState();
  const [Chats, setChats]=useState([]);
  const [notification, setNotification]=useState([]);
  const navigate=useNavigate();
  const ENDPOINT="http://localhost:3000"

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");

    setUser(userInfo);

    if (!userInfo) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <ChatContext.Provider value={{ user, setUser, SelectedChat, setSelectedChat, Chats, setChats, notification, setNotification, ENDPOINT }}>
      {children}
    </ChatContext.Provider>
  );
};

export const chatState = () => useContext(ChatContext);

export default ChatProvider;
