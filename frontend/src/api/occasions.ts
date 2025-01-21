import Occasion from "../interfaces/Occasion";
import OccasionWithHostName from "../interfaces/OccasionWithHostName";

const OCCASIONS_BASE_URL = import.meta.env.VITE_OCCASIONS_BASE_URL;
const CLERK_SERVICE_URL = import.meta.env.VITE_CLERK_SERVICE_URL;

export const fetchOccasions = async (userId: string) => {
  const response = await fetch(`${OCCASIONS_BASE_URL}/${userId}`);

  if (response.status === 304) {
    return [];
  } else if (!response.ok) {
    throw new Error("Failed to fetch occasions");
  } else {
    return response.json();
  }
};

export const createOrUpdateOccasion = async (
  occasionData: Occasion,
  editingId: string | null
): Promise<Occasion> => {
  const url = editingId
    ? `${OCCASIONS_BASE_URL}/${editingId}`
    : OCCASIONS_BASE_URL;
  const method = editingId ? "PATCH" : "POST";
  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(occasionData),
  });

  if (!response.ok) {
    throw new Error(
      editingId ? "Failed to update occasion" : "Failed to create occasion"
    );
  }

  return response.json();
};

export const deleteOccasion = async (id: string): Promise<void> => {
  const response = await fetch(`${OCCASIONS_BASE_URL}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete occasion");
  }
};

export const fetchOccasionByUrl = async (
  url: string
): Promise<OccasionWithHostName> => {
  const response = await fetch(`${OCCASIONS_BASE_URL}/url/${url}`);

  if (!response.ok) {
    throw new Error("Failed to fetch occasion data");
  }
  const occasionData = await response.json();

  const clerk_user_id = occasionData.clerk_user_id;

  if (!clerk_user_id) {
    throw new Error("Failed to identify user");
  }

  const userResponse = await fetch(`${CLERK_SERVICE_URL}/${clerk_user_id}`);

  if (!userResponse.ok) {
    throw new Error("Failed to fetch user name");
  }

  const userData = await userResponse.text();

  return {
    occasion: occasionData,
    hostName: userData,
  };
};
