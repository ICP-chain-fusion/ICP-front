import { AICardProps } from "../interface";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function addUser(userData: {
  user_address: string;
  nickname: string;
  profile_image_url?: string;
  gender?: string;
  country?: string;
  interest?: string;
}) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_address: userData.user_address,
        nickname: userData.nickname,
        profile_image_url: userData.profile_image_url || "",
        gender: userData.gender || "",
        country: userData.country || "",
        interest: userData.interest || "",
        trial: 10,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to add user");
  }

  return await response.json();
}

export async function fetchUserExists(user_address: string) {
  const response = await fetch(`${API_BASE_URL}/users/exists/${user_address}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return await response.json();
}

export async function fetchUser(user_address: string) {
  const response = await fetch(`${API_BASE_URL}/users/${user_address}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return await response.json();
}

export async function fetchChatList(user_address: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/chats/${user_address}`
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error response body:", errorText);
    throw new Error(
      `Failed to fetch chat list: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();
  return data;
}

export async function fetchMyAIs(user_address: string): Promise<AICardProps[]> {
  const response = await fetch(`${API_BASE_URL}/ais/user/${user_address}`);
  console.log("response", response);
  if (!response.ok) {
    throw new Error("Failed to fetch user's AIs");
  }
  return await response.json();
}

export async function updateUser(userData: {
  user_address: string;
  profile_image_url?: string;
  gender?: string;
  country?: string;
  interest?: string;
  trial?: number;
}) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_address: userData.user_address,
          profile_image_url: userData.profile_image_url || "",
          gender: userData.gender || "",
          country: userData.country || "",
          interest: userData.interest || "",
          trial: userData.trial || 0,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

export async function fetchLikeList(user_address: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/ais/likes/${user_address}`
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error response body:", errorText);
    throw new Error(
      `Failed to fetch chat list: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();
  return data;
}

export async function addLike(userData: {
  user_address: string;
  ai_id: string;
}) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/likes/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_address: userData.user_address,
        ai_id: userData.ai_id,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to like AI");
  }

  return await response.json();
}

export async function delLike(userData: {
  user_address: string;
  ai_id: string;
}) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/likes/`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_address: userData.user_address,
        ai_id: userData.ai_id,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to like AI");
  }

  return await response.json();
}
