const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchTrendingAIs(
  category: string,
  address: string,
  query: { offset?: number; limit?: number } // offset과 limit을 쿼리로 받음
) {
  const { offset = 0, limit = 10 } = query; // 기본값 설정

  const response = await fetch(
    `${API_BASE_URL}/ais/trend/${address}/${category}?offset=${offset}&limit=${limit}`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return await response.json();
}

export async function fetchAIs(offset: number, limit: number) {
  const response = await fetch(
    `${API_BASE_URL}/ais/?offset=${offset}&limit=${limit}`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return await response.json();
}

export async function fetchTodayAIs(address: string) {
  const response = await fetch(`${API_BASE_URL}/ais/today/${address}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return await response.json();
}

export async function fetchAIDetails(id: string) {
  const response = await fetch(`${API_BASE_URL}/ais/id/${id}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return await response.json();
}

export async function fetchSearchAIs(name: string, address: string) {
  const response = await fetch(`${API_BASE_URL}/ais/search/${name}/${address}`);
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("No results found");
    }
    throw new Error("Network response was not ok");
  }
  return await response.json();
}

export async function fetchAILogs(id: string) {
  const response = await fetch(`${API_BASE_URL}/ailogs/ai/${id}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return await response.json();
}

export async function createAI(aiData: {
  name: string;
  creator_address: string;
  category: string;
  introductions: string;
  profile_image_url: string;
  rag_contents: string;
  rag_comments: string;
  created_at: string;
  examples: string;
}) {
  const response = await fetch(`${API_BASE_URL}/ais/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(aiData),
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error("Error response:", errorData);
    throw new Error(
      `Failed to create AI: ${response.status} ${response.statusText}\n${errorData}`
    );
  }

  return await response.json();
}

export async function fetchMyAIs(userid: string) {
  const response = await fetch(`${API_BASE_URL}/ais/user/${userid}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return await response.json();
}

export async function deleteAI(id: string) {
  const response = await fetch(`${API_BASE_URL}/ai/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete AI");
  }
  return await response.json();
}

export async function updateAI(aiData: {
  id: string;
  creator_address: string;
  profile_image_url: string;
  category: string;
  introductions: string;
  rag_contents: string;
  rag_comments: string;
  examples: string;
}) {
  const response = await fetch(`${API_BASE_URL}/ais/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(aiData),
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error("Error response:", errorData);
    throw new Error(
      `Failed to update AI: ${response.status} ${response.statusText}\n${errorData}`
    );
  }

  return await response.json();
}
