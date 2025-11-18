import { useEffect, useState } from "react";
import { adminApi } from "@/services/adminApi";
import { Button } from "@/components/ui/button";

interface User {
  id: string;
  email: string;
  role: "user" | "admin";
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    adminApi.getUsers().then(setUsers);
  }, []);

  const promoteToAdmin = async (id: string) => {
    await adminApi.promoteUser(id);
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, role: "admin" } : u))
    );
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">User Management</h2>
      {users.map((user) => (
        <div
          key={user.id}
          className="flex items-center justify-between border p-4 rounded-xl"
        >
          <span>{user.email}</span>
          <span className="capitalize">{user.role}</span>
          {user.role === "user" && (
            <Button onClick={() => promoteToAdmin(user.id)}>Promote</Button>
          )}
        </div>
      ))}
    </div>
  );
};

export default UserManagement;
