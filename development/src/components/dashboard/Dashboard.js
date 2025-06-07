import React, { useEffect, useState } from "react";
import "./dashboard.css";
import axios from "axios";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";

import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    minWidth: "400px",
  },
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const authToken = location.state.AuthToken;
  const [details, setDetails] = useState([]);
  const [open, setOpen] = useState(false);
  const [opendetails, setOpendetails] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editstudent, setEditstudent] = useState(null);
  const [editpayload, setEditpayload] = useState({
    name: "",
    email: "",
    city: "",
    mobile: "",
    section: "",
    marks: [],
  });

  useEffect(() => {
    getstudents();
  }, []);

  useEffect(() => {
    if (editstudent) {
      setEditpayload(editstudent);
    }
  }, [editstudent]);

  const handlechange = (e) => {
    const { name, value } = e.target;
    setEditpayload((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditOpen = (item) => {
    setEditstudent(item);
    setOpendetails(true);
  };
  const handleeditclose = () => {
    const id = editstudent._id;
    axios
      .put(`http://localhost:5000/student/update/${id}`, editpayload)
      .then((res) => {
        let statusCode = res.data.statuscode;
        if (statusCode === "200") {
          Swal.fire({
            icon: "success",
            text: "Updated successfully",
          });
          getstudents();
          setOpendetails(false);
        }
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          text: "Something went wrong",
        });
      });
  };

  const handleClickOpen = (item) => {
    setSelectedStudent(item);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedStudent(null);
  };
  const handleLogout = () => {
    axios
      .post("http://localhost:5000/user/logout")
      .then((res) => {
        let statusCode = res.data.statuscode;
        if (statusCode === "200") {
          Swal.fire({
            icon: "success",
            text: "Logged out  success",
          });
          navigate("/login");
        }
      })
      .catch((err) => {});
  };
  const getstudents = () => {
    const headers = {
      authorization: `Bearer ${authToken}`,
    };
    axios
      .get("http://localhost:5000/student/getstudent", { headers })
      .then((res) => {
        let student = res.data.student;
        setDetails(student);
      })
      .catch((err) => {});
  };
  return (
    <div className="app">
      <aside className="sidebar">
        <h2 className="sidebar-title">MyDashboard</h2>
        <ul className="nav-list">
          <li>Overview</li>
          <li>Analytics</li>
          <li>Reports</li>
          <li>Settings</li>
        </ul>
      </aside>

      <main className="main">
        <header className="header">
          <h1 className="header-title">Dashboard Overview</h1>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </header>

        <section className="dashboard">
          {details.map((item) => (
            <div key={item._id} className="card">
              <h1>{item.name}</h1>
              <div className="header-section">Student Details</div>
              <div className="details-section">
                <span>{item.email}</span>
                <span>{item.city}</span>
                <span>{item.mobile}</span>
                <span>{item.section}</span>
              </div>
              <div className="Card-footer">
                <div className="footer" onClick={() => handleClickOpen(item)}>
                  View Marks
                </div>
                <div className="footer" onClick={() => handleEditOpen(item)}>
                  Edit details
                </div>
              </div>
            </div>
          ))}

          <Dialog
            onClose={handleClose}
            open={open}
            PaperProps={{
              sx: {
                minWidth: "400px",
              },
            }}
          >
            <DialogTitle sx={{ m: 0, p: 2 }}>
              <div className="header-section">Marks Details</div>
              <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            <DialogContent dividers>
              {selectedStudent?.marks.map((res, index) => (
                <div key={index} className="marks">
                  <label>{res.subject}</label>
                  <input type="text" value={res.score} readOnly />
                </div>
              ))}
            </DialogContent>

            <DialogActions>
              {/* <Button onClick={handleClose}>Save Changes</Button> */}
            </DialogActions>
          </Dialog>

          <Dialog
            onClose={handleeditclose}
            open={opendetails}
            PaperProps={{
              sx: {
                minWidth: "400px",
              },
            }}
          >
            <DialogTitle sx={{ m: 0, p: 2 }}>
              <div className="header-section">Edit details</div>
              <IconButton
                aria-label="close"
                onClick={handleeditclose}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            <DialogContent dividers>
              <>
                {editstudent && (
                  <div className="marks">
                    <label>Name</label>
                    <input
                      type="text"
                      name="name"
                      value={editpayload.name}
                      onChange={handlechange}
                    />
                    <label>Email</label>
                    <input
                      type="text"
                      name="email"
                      value={editpayload.email}
                      onChange={handlechange}
                    />
                    <label>City</label>
                    <input
                      type="text"
                      name="city"
                      value={editpayload.city}
                      onChange={handlechange}
                    />
                    <label>Section</label>
                    <input
                      type="text"
                      name="section"
                      value={editpayload.section}
                      onChange={handlechange}
                    />
                    <label>Mobile number</label>
                    <input
                      type="text"
                      name="mobile"
                      value={editpayload.mobile}
                      onChange={handlechange}
                    />
                  </div>
                )}
              </>
            </DialogContent>

            <DialogActions>
              <Button onClick={handleeditclose}>Save Changes</Button>
            </DialogActions>
          </Dialog>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;

{
  /* <div className="card">👥 Users: 1,842</div>
          <div className="card">🛒 Orders: 382</div>
          <div className="card">💬 Feedback: 134</div> */
}
