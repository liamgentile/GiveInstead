export const fetchOccasions = async (userId: string | undefined) => {
  const response = await fetch(`http://localhost:3000/occasions/${userId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch occasions");
  }
  return response.json();
};

export const createOrUpdateOccasion = async (
  occasionData: any,
  editingOccasion: any
) => {
  const url = editingOccasion
    ? `http://localhost:3000/occasions/${editingOccasion._id}`
    : "http://localhost:3000/occasions";
  const method = editingOccasion ? "PATCH" : "POST";
  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(occasionData),
  });

  if (!response.ok) {
    throw new Error(
      editingOccasion
        ? "Failed to update occasion"
        : "Failed to create occasion"
    );
  }

  return response.json();
};

export const deleteOccasion = async (id: string) => {
  const response = await fetch(`http://localhost:3000/occasions/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete occasion");
  }
};
