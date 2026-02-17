import { useEffect, useState } from "react";
import {
  getUsers, addUser, deleteUser, updateUser, } from "./services/userService";
  import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
} from "@mui/material";

function App() {
   const formFields = [
  {
    name: "firstName",
    label: "First Name",
    type: "text",
    required: true,
  },
  {
    name: "lastName",
    label: "Last Name",
    type: "text",
    required: true,
  },
  {
    name: "phone",
    label: "Phone Number",
    type: "text",
    required: true,
    pattern: /^[0-9]{10}$/,
    errorMessage: "Phone number must be exactly 10 digits",
  },
  {
    name: "email",
    label: "Email Address",
    type: "email",
    required: true,
    pattern: /^[^\s@]+@gmail\.com$/,
    errorMessage: "Enter a valid email address",
  },
  {
  name: "dob",
  label: "Date of Birth",
  type: "date",
  required: false
},
];

  const [users, setUsers] = useState([]);
  const [editId, setEditId] = useState(null);

 const initialFormState = formFields.reduce((acc, field) => {
  acc[field.name] = "";
  return acc;
}, {});

const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const data = await getUsers();
    setUsers(data);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

 const handleSubmit = async () => {
  for (let field of formFields) {
    const value = formData[field.name];
    if (field.required && !value) {
      alert(`${field.label} is required`);
      return;
    } 
    if (field.pattern && !field.pattern.test(value)) {
      alert(field.errorMessage);
      return;
    }
  }

  if (editId) {
    await updateUser(editId, formData);
    setEditId(null);
  } else {
    await addUser(formData);
  }

  setFormData(initialFormState);
  fetchUsers();
};

  const handleEdit = (user) => {
    setFormData(user);
    setEditId(user.id);
  };

  const handleDeleteUser = async (id) => {
    await deleteUser(id);
    fetchUsers();
  };

 return (
  <Container maxWidth="sm" sx={{ mt: 5 }}>
    <Card elevation={4}>
      <CardContent>
        <Typography variant="h5" align="center" gutterBottom>
          User Management App
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            mt: 2,
          }}
        >
                  {formFields.map((field) => (
          <div key={field.name} style={{ marginBottom: "1rem" }}>
            <label htmlFor={field.name} style={{ marginRight: "0.5rem", fontWeight: 500 }}>
              {field.label}:
            </label>
            <TextField
              id={field.name}
              name={field.name}
              type={field.type}
              placeholder={field.label} // optional, you can keep it empty
              value={formData[field.name] || ""}
              onChange={handleChange}
              size="small"
            />
          </div>
        ))}

          <Button
            variant="contained"
            onClick={handleSubmit}
            fullWidth
          >
            {editId ? "Update User" : "Add User"}
          </Button>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            User List
          </Typography>

          {users.map((user) => (
            <Card
              key={user.id}
              sx={{
                mb: 2,
                p: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography>
                  {user.firstName} {user.lastName}
                </Typography>
                <Typography variant="body2">
                  {user.phone} | {user.email}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handleEdit(user)}
                >
                  Edit
                </Button>

                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={() => handleDeleteUser(user.id)}
                >
                  Delete
                </Button>
              </Box>
            </Card>
          ))}
        </Box>
      </CardContent>
    </Card>
  </Container>
);
}

export default App;