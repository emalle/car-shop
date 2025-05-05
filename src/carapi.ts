export const getCars = async () => {
    const response = await fetch(import.meta.env.VITE_API_URL);
    if (!response.ok)
        throw new Error("Error when fetching cars");
    return await response.json();
}

export const deleteCar = async (url: string) => {
    const response = await fetch(url, {
        method: "DELETE"
    });
    if (!response.ok)
        throw new Error("Error when deleting car");
    return await response.json();
}