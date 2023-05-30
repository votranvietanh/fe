import axios from "axios";
import { useState, useEffect } from "react"
import authHeader from "../services/auth-header";

import * as yup from 'yup';
import { useParams } from "react-router-dom";
import { Dialog, DialogActions, DialogContent, DialogTitle, Box, FormControl, TextField, InputLabel, MenuItem, Select } from "@mui/material"
import { Button } from "react-bootstrap"



const defaultData = {
  name: "",
  gender: "",
  phone: "",
  address: "",
  mph: "",
  age: "",
  date: "",
  nameTeam: "",
}
const validationSchema = yup.object().shape({
  name: yup.string().required('Name is required').matches(/^[a-zA-Z ]*$/, 'Invalid name format'),
  address: yup.string(),
  age: yup.number().positive('Age must be positive'),
  date: yup.date(),
  mph: yup.number().positive('Money per hour must be positive'),
  gender: yup.string(),
  nameTeam: yup.string(),
  phone: yup.string().matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
});
export default function UpdateBtn(props) {
  const [open, setOpen] = useState(false);
  const [listTeam, setListTeam] = useState([]);
  const [newEmployee, setNewEmployee] = useState(defaultData);
  const [initEmployee, setInitEmployee] = useState();
  const { id } = useParams();
  const [errors, setErrors] = useState({});
  const [isLoading,setIsLoading] = useState(false)

  useEffect(()=>{
    getListTeam();
    getbyID();
  },[])
  
  useEffect(() => {
    if (open) {
      setNewEmployee(initEmployee)
      setErrors({});
    }
 
  }, [open])

  const getListTeam = async () => {
    const result = await axios.get("http://localhost:8080/teams/getAll", { headers: authHeader() });
    setListTeam(result.data);
  };

  const getbyID = async () => {
    const result = await axios.get(`http://localhost:8080/users/user/${id}`, { headers: authHeader() });
    setNewEmployee(result.data);
    setInitEmployee(result.data);
  };

  const options = listTeam.map((team) => ({
    value: team.name,
    label: team.name,
    idTeam: team.id,
  }));

  const onInputChange = async (e) => {
    setNewEmployee(prevState => ({ ...prevState, [e.target.name]: e.target.value }));

    try {
      await yup.reach(validationSchema, e.target.name).validate(e.target.value);
      setErrors((prevErrors) => ({ ...prevErrors, [e.target.name]: '' }));
    } catch (error) {
      setErrors((prevErrors) => ({ ...prevErrors, [e.target.name]: error.message }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await validationSchema.validate(newEmployee, { abortEarly: false });
      // Gửi form nếu dữ liệu hợp lệ
      try {
        const response = await axios.put(`http://localhost:8080/users/user/${id}`, newEmployee, { headers: authHeader() });
        const newTeamId = options.find(option => option.label === response.data.nameTeam)?.idTeam;
        const newTeam = {
          userId: response.data.id,
          teamId: newTeamId,
        };
        setIsLoading(true)
        await axios.post(`http://localhost:8080/teams/teams/${newTeam.teamId}/users/${id}`, newEmployee, { headers: authHeader() });
        props.onClick();
        setIsLoading(false)
        handleClose();
      } catch (error) {
        console.error("Error updating employee:", error);
      }
      console.log('Form submitted');
    } catch (error) {
      // Xử lý lỗi khi dữ liệu không hợp lệ
      const validationErrors = {};
      error.inner.forEach((err) => {
        validationErrors[err.path] = err.message;
      });
      setErrors(validationErrors);
    }

  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (<div>
    <img onClick={handleClickOpen} src="/EditIcon.svg" alt="edit-icon" />

    <Dialog
      className="height "
      open={open}
      onClose={handleClose}
    >
      <DialogTitle
        style={{ backgroundColor: 'skyblue', marginBottom: 15 }}
      >
        <b style={{ fontSize: 30 }}>
          Update the employee
        </b>
      </DialogTitle>
      <DialogContent
      >
        <Box
          style={{ pading: 0 }}
          component="form"
          sx={{
            '& .MuiTextField-root': { m: 1, width: '15ch' },
          }}
          noValidate
        // autoComplete="off"
        >
          <Box>
            <TextField style={{ width: 530 }}
              required
              name="name"
              label="Full name employee"
              value={newEmployee.name}
              onChange={(e) => onInputChange(e)}

              variant="outlined"
              error={!!errors.name}
              helpertext={errors.name}

            />
            <TextField style={{ width: 257 }}
              required
              name="address"
              value={newEmployee.address}

              label="Address"
              onChange={(e) => onInputChange(e)}

              variant="outlined"
              error={!!errors.address}
              helpertext={errors.address}
            />
            <TextField style={{ width: 257 }}
              required
              name="age"
              value={newEmployee.age}

              label="Age"
              onChange={(e) => onInputChange(e)}
              variant="outlined"
              error={!!errors.age}
              helpertext={errors.age}

            />
            <TextField style={{ width: 257 }}
              required
              name="date"
              label="Start day"
              value={newEmployee.date}

              type="date"
              onChange={(e) => onInputChange(e)}
              variant="outlined"
              error={!!errors.date}
              helpertext={errors.date}
            />
            <TextField style={{ width: 257 }}
              required
              name="mph"
              value={newEmployee.mph}
              label="Money per hour"
              onChange={(e) => onInputChange(e)}

              variant="outlined"
              error={!!errors.mph}
              helpertext={errors.mph}
            />

            <FormControl sx={{ m: 1, minWidth: 257, height: 37 }} >
              <InputLabel id="demo-select-small">Gender</InputLabel>
              <Select
                labelId="demo-select-small"
                name="gender"
                value={newEmployee.gender ? 1 : 0}
                label="Gender"
                onChange={(e) => onInputChange(e)}
                variant="outlined"
                error={!!errors.gender}
                helpertext={errors.gender}
              >
                <MenuItem value={1}>Male</MenuItem>
                <MenuItem value={0}>Female</MenuItem>
              </Select>
            </FormControl>

            <TextField
              style={{ width: 257 }}
              required
              name="phone"
              label="Phone number"
              value={newEmployee.phone}
              onChange={(e) => onInputChange(e)}

              variant="outlined"
              error={!!errors.phone}
              helpertext={errors.phone}

            />
            <FormControl sx={{ m: 1, minWidth: 257, height: 37 }} >
              <InputLabel id="demo-select-small">Team</InputLabel>
              <Select
                name="nameTeam"
                value={newEmployee.nameTeam}

                onChange={(e) => onInputChange(e)}

                variant="outlined"
                error={!!errors.nameTeam}
                helpertext={errors.nameTeam}>
                {options.map((option) => (
                  <MenuItem
                    key={option.value}
                    value={option.value}
                    idTeam={option.idTeam}
                  >
                    {option.idTeam}:
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button className="btn btn-danger" onClick={handleClose}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>
          {isLoading && (
            <span className="spinner-border spinner-border-sm"></span>
          )}
          <span> Submit</span></Button>

      </DialogActions>
    </Dialog>
  </div>
  )
}