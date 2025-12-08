import { useSelector } from "react-redux";
export default function Profile() {
  const user = useSelector(state => state.auth.user);
  if (!user) return <div>Not logged in.</div>;
  return (
    <div className="max-w-xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <div className="mb-2"><b>Name:</b> {user.name}</div>
      <div className="mb-2"><b>Email:</b> {user.email}</div>
      <div className="mb-2"><b>Admin:</b> {user.isAdmin ? "Yes" : "No"}</div>
    </div>
  );
}
