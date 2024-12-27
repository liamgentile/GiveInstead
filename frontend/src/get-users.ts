export default async function getUsers() {
    const res = await fetch("http://localhost:3000");
    return res.json();
}