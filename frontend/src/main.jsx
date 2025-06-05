import { createRoot } from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import Home from './pages/Home.jsx'
import Chat from './pages/Chat.jsx'
import ChatProvider from './context/ChatProvider.jsx'
import "./index.css"
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ChatProvider>
        <Home />
      </ChatProvider>
    ),
  },
  {
    path: "/chats",
    element: (
      <ChatProvider>
        <Chat />
      </ChatProvider>
    ),
  },
]);

createRoot(document.getElementById("root")).render(
    <RouterProvider router={router} />
);
