import { useEffect, useState } from "react";
import "./AllUsers.css";

function AllUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchUsers() {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/users`);
                if (!res.ok) throw new Error("Error loading users");
                const data = await res.json();
                setUsers(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchUsers();
    }, []);    

    if (loading) {
        return (
            <div 
                className="all-categories-container bg-white"
                style={{
                    paddingTop: '6rem',
                    paddingBottom: '2rem',
                    marginLeft: '20%',
                    marginRight: '25%',
                    minHeight: '100vh',
                    overflowY: 'auto',
                }}
            >
                <p className="loading">Loading users...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div 
                className="all-categories-container bg-white"
                style={{
                    paddingTop: '6rem',
                    paddingBottom: '2rem',
                    marginLeft: '20%',
                    marginRight: '25%',
                    minHeight: '100vh',
                    overflowY: 'auto',
                }}
            >
                <p className="error">{error}</p>
            </div>
        );
    }    


    return (
        <div 
            className="all-users-container"
            style={{
                paddingTop: '6rem',
                paddingBottom: '2rem',
                marginLeft: '20%',
                marginRight: '25%',
                minHeight: '100vh',
                overflowY: 'auto',
            }}
        >
            <h2>All Users</h2>
            {users.length === 0 ? (
                <p>No users</p>
            ) : (
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Login</th>
                            <th>Email</th>
                            <th>Full Name</th>
                            <th>Role</th>
                            {/* <th>Rating</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.login || "—"}</td>
                                <td>{user.email || "—"}</td>
                                <td>{user.full_name}</td>
                                <td className={user.role === "admin" ? "role-admin" : "role-user"}>
                                    {user.role}
                                </td>
                                {/* <td>{user.rating}</td> */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default AllUsers;
