import { Message, ChatResponse } from "@/utils/interface";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchUserChats(user_address: string) {
  const response = await fetch(`${API_BASE_URL}/chats/user/${user_address}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return await response.json();
}

export async function createChat(chatData: {
  ai_id: string;
  user_address: string;
}) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/chats/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(chatData),
    },
  );
  if (!response.ok) {
    const errorData = await response.text();
    console.error("Error response:", errorData);
    throw new Error(
      `Failed to create AI: ${response.status} ${response.statusText}\n${errorData}`,
    );
  }

  return await response.json();
}

export async function fetchChatHistory(
  chatid: string,
  userid: string,
): Promise<Message[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/chats/messages/${chatid}`,
    );
    if (!response.ok) {
      if (response.status === 404) {
        return [];
      }
      throw new Error("Failed to fetch chat history");
    }
    const data = await response.json();

    return data.messages.map((chat: ChatResponse) => {
      const chatContentsId = chat.id || "";
      const isAI = chatContentsId.startsWith("AI_");
      const role = isAI ? "ai" : "user";

      return {
        role: role,
        content: chat.message || "",
        timestamp: chat.created_at || new Date().toISOString(),
      };
    });
  } catch (error) {
    console.error("Error fetching chat history:", error);
    throw error;
  }
}

export async function sendMessage(
  chat_id: string,
  content: string,
  sender: string,
): Promise<ChatResponse> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/chats/message/${chat_id}/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender_id: sender,
        message: content,
      }),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to send message");
  }

  return response.json();
}

// export const fetchChatHistory = async (chatid : string) => {

//   try {
//     const response = await fetch(
//       `${process.env.NEXT_PUBLIC_API_BASE_URL}/chatcontents/${chatid}`
//     );
//     if (!response.ok) {
//       if (response.status === 404) {
//         // Chat history not found, send welcome message
//         const welcomeMessage: Message = {
//           role: "ai",
//           content: "Hello! How can I assist you?",
//           timestamp: new Date().toISOString(),
//         };
//         setMessages([welcomeMessage]);
//         await sendMessage(welcomeMessage.content, aiName);
//       } else {
//         throw new Error("Failed to fetch chat history");
//       }
//     } else {
//       const data = await response.json();
//       const formattedMessages: Message[] = data.chats.map(
//         (chat: ChatResponse) => ({
//           role: chat.senderid === user?.userid ? "user" : "ai",
//           content: chat.message,
//           timestamp: chat.createdat,
//         })
//       );
//       setMessages(formattedMessages);
//     }
//   } catch (error) {
//     console.error("Error fetching chat history:", error);
//   }
// };
