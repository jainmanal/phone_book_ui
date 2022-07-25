import React, { useState, useEffect } from "react";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import Input from "@material-ui/core/Input";
import "./UserDetail.css";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import axios from "axios";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

const useStyles = makeStyles({
  table: {
    minWidth: 550,
  },
});

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function UserDetails() {
  const [userDetails, setUserDetails] = useState([]);
  const [postStatus, setPostStatus] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({
    first_name: "Omic",
    last_name: "Rocks",
    phone: 5558675309,
  });
  const [open, setOpen] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [errorVal, setErrorVal] = useState("");

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
    setOpenError(false);
  };

  const submitUser = async () => {
    console.log("working");
    if (selectedOptions.first_name.length < 2){
      setErrorVal("Please enter valid first name");
      setOpenError(true);
    }
    else if (selectedOptions.last_name.length < 2){
      setErrorVal("Please enter valid last name");
      setOpenError(true);
    }
    else if (selectedOptions.phone.toString().length < 8 || selectedOptions.phone.toString().length > 12){
      setErrorVal("Please enter valid phone number");
      setOpenError(true);
    }
    else{
    try {
      await axios
        .post(`http://127.0.0.1:9000/user-details`, selectedOptions)
        .then((res) => {
          if (res.status == 201) {
            setPostStatus(!postStatus);
            setOpen(true);
          }
        });
    } catch (e) {
      console.log(e, "error");
      setErrorVal("Phone number already exists!");
      setOpenError(true);
    }
  }
  };
  useEffect(() => {
    getuserList().then((res) => {
      let data = res;
      setUserDetails(data);
    });
  }, [postStatus]);

  const getuserList = () => {
    try {
      let resp = axios.get(`http://127.0.0.1:9000/user-details`).then((res) => {
        console.log(res);
        return res.data;
      });
      return resp;
    } catch (e) {
      console.log(e, "error");
    }
  };

  const classes = useStyles();

  return (
    <>
      <div className="users">
        <Container>
          <div className="main-div">
            <div className="left-imag">
              <img src={require('../assets/image/singup.jpg')}/>
            </div>
            <div className="right-text">
              <div className="addUser">
                <span>Add User</span>
              </div>
            <label>First name</label>
            <Input
              type="text"
              id="first_name"
              className="first_name"
              value={selectedOptions.first_name}
              onChange={(event) =>
                setSelectedOptions({
                  ...selectedOptions,
                  first_name: event.target.value,
                })
              }
            />
            <label>Last name</label>
            <Input
              type="text"
              id="last_name"
              className="last_name"
              value={selectedOptions.last_name}
              onChange={(event) =>
                setSelectedOptions({
                  ...selectedOptions,
                  last_name: event.target.value,
                })
              }
            />
            <label>Phone</label>
            <Input
              type="number"
              id="phone"
              className="phone"
              value={selectedOptions.phone}
              onChange={(event) =>
                setSelectedOptions({
                  ...selectedOptions,
                  phone: parseInt(event.target.value),
                })
              }
            />
            <Button variant="contained" color="primary" onClick={submitUser}>
              Add User
            </Button>

            </div>
          </div>
          
          <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="success">
              User Added Successfully!
            </Alert>
          </Snackbar>
          <Snackbar open={openError} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="error">
              {errorVal}
            </Alert>
          </Snackbar>
          {console.log(
            selectedOptions,
            "selected",
            userDetails,
            "asds",
            postStatus
          )}
        </Container>
      </div>
      <div>

        <div className="users-table">
          <Container>
            <TableContainer component={Paper}>
              <Table className={classes.table} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>First Name</TableCell>
                    <TableCell>Last Name</TableCell>
                    <TableCell>Phone</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {userDetails?.map((row) => (
                    <TableRow key={row.phone}>
                      <TableCell>{row.first_name}</TableCell>
                      <TableCell>{row.last_name}</TableCell>
                      <TableCell>{row.phone}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Container>
        </div>
      </div>
    </>
  );
}

export default UserDetails;
