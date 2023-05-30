import * as React from "react"
import { useState, useEffect } from "react"
import { Button } from "react-bootstrap"
import axios from "axios"

import { Box, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import * as yup from 'yup';
import authHeader from "../services/auth-header"
import { useAddEmployee } from '../api/Employee/useEmployee';

const emptyForm = {
  name: 'A',
  gender: '1',
  phone: '1231231231',
  address: '1',
  mph: '21',
  age: '12',
  date: '2022-05-23',
  nameTeam: 'CiCi',
  role: ['admin']
}
const validationSchema = yup.object().shape({
  name: yup.string().required('Name is required').matches(/^[a-zA-Z ]*$/, 'Invalid name format'),
  address: yup.string().required('address is required'),
  age: yup.number().positive('Age must be positive'),
  date: yup.date().required('Date is required'),
  mph: yup.number().positive('Money per hour must be positive'),
  gender: yup.string().required('Gender is required'),
  nameTeam: yup.string().required('Team is required'),
  role: yup.array().required('Role is required'),
  phone: yup.string().matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
});
const AddUser = (props) => {
  const [open, setOpen] = useState(false);

  const [newEmployee, setNewEmployee] = useState(emptyForm);

  const [errors, setErrors] = useState({});

  const addEmployee = useAddEmployee();



  const { name, gender, phone, address, mph, age, date, nameTeam, role } = newEmployee;

  const [listTeam, setListTeam] = useState([]);
  const arrGender = [
    { value: 1, label: 'Male' },
    { value: 0, label: 'FeMale' },
  ];

  const onAddEmployee = async (newEmployee) => {
    await addEmployee.mutateAsync(
      { newEmployee }
    );
  };

  useEffect(() => {
    getListTeam();
  }, []);
  useEffect(() => {
    getListTeam();
    if (open) {
      setNewEmployee(emptyForm);
      setErrors({});
    }
  }, [open])
  const getListTeam = async () => {
    const result = await axios.get('http://localhost:8080/teams/getAll', { headers: authHeader() });
    setListTeam(result.data);
  };

  const options = listTeam.map((team) => ({
    value: team.name,
    label: team.name,
    idTeam: team.id
  }));
  //validate while entering
  const onInputChange = async (e) => {
    setNewEmployee({ ...newEmployee, [e.target.name]: e.target.value });
    //validation result
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
      console.log('Form submitted', newEmployee);
      try {
        const response = await onAddEmployee({
          newEmployee
      });
        console.log('response', response);
        let newTeamId;
        options.forEach((option) => {
        console.log(options)


          if (response?.nameTeam === option.label) {
            newTeamId = option.idTeam;
            console.log(response.nameTeam);
          }
        });

        console.log(newTeamId);
        const newTeam = {
          userId: response.id,
          teamId: newTeamId
        };
        console.log('Team created:', newTeam);

        await axios.post('http://localhost:8080/teams/add-user', newTeam, { headers: authHeader() });
        handleClose();
      } catch (error) {
        console.error('Error creating user:', error);
      }
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
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }

  return (
    <div>

      <Button variant="light" style={{ textAlign: 'center' }} >
        <img onClick={handleClickOpen}
          style={
            {
              width: 22,
              height: 22
            }
          }
          src="/PlusIcon.svg" alt="plus-icon" />
      </Button>

      <Dialog

        open={open}
        onClose={handleClose}
      >
        <DialogTitle
          style={{ backgroundColor: 'skyblue', marginBottom: 15, }}>
          <b style={{ fontSize: 30 }}>
            Add new employee
          </b>
        </DialogTitle>
        <DialogContent>
          <Box
            style={{ pading: 0 }}
            component="form"
            sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' }, }}
            noValidate
            autoComplete="off"
          >
            <div onSubmit={handleSubmit}>
              <TextField
                style={{ width: 530, textTransform: "none" }}
                name="name"
                label="Fullname "
                onChange={e => {
                  onInputChange(e)
                }}
                value={name}


                error={!!errors.name}
                helperText={errors.name}
                required
              /><div ><div className="d-flex mr-3 justify-content-end text-small" style={{ fontSize: '10px' }}>
                {name.length}/255
              </div> </div>
              <TextField style={{ width: 257 }}
                required
                name="address"
                value={address}
                label="Address"
                onChange={(e) => onInputChange(e)}
                error={!!errors.address}
                helperText={errors.address}
              />
              <TextField style={{ width: 257 }}
                required
                name="age"
                value={age}

                label="Age"
                onChange={(e) => onInputChange(e)}
                error={!!errors.age}
                helperText={errors.age}
              />
              <TextField style={{ width: 257 }}
                required
                name="date"
                label="Start day"
                value={date}
                InputLabelProps={{
                  shrink: true,
                }}
                type="date"
                onChange={(e) => onInputChange(e)}
                error={!!errors.date}
                helperText={errors.date}
              />
              <TextField style={{ width: 257 }}
                required
                name="mph"
                value={mph}
                label="Money per hour"
                onChange={(e) => onInputChange(e)}
                error={!!errors.mph}
                helperText={errors.mph}
              />

              <FormControl sx={{ m: 1, minWidth: 257, height: 37 }} >
                <InputLabel id="demo-select-small">Gender</InputLabel>
                <Select
                  name="gender"
                  value={gender}
                  onChange={(e) => onInputChange(e)}
                  error={!!errors.gender}
                  helperText={errors.gender}>
                  {arrGender.map((gender) => (
                    <MenuItem key={gender.value} value={gender.value}>
                      {gender.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ m: 1, minWidth: 257, height: 37 }} >
                <InputLabel id="demo-select-small">Team</InputLabel>
                <Select
                  name="nameTeam"
                  value={nameTeam}
                  onChange={(e) => onInputChange(e)}
                  error={!!errors.nameTeam}
                  helperText={errors.nameTeam}>

                  {options.map((option) => (
                    <MenuItem
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                style={{ width: 530, marginTop: `30px` }}
                required
                name="phone"
                label="Phone number"
                value={phone}

                onChange={(e) => onInputChange(e)}
                error={!!errors.phone}
                helperText={errors.phone}
              />
              <TextField

                select
                value={role}

                style={{ width: 530, marginTop: `30px` }}
                required
                name="role"
                label="Role"
                onChange={(e) => {
                  const selectedValue = e.target.name;
                  setNewEmployee({ ...newEmployee, role: [e.target.value] });

                  console.log(selectedValue)
                  console.log(role)
                }
                }
                error={!!errors.role}
                helperText={errors.role}
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="admin">Admin </MenuItem>
                <MenuItem value="mod">MODERATOR</MenuItem>
              </TextField>

            </div>

          </Box>

        </DialogContent>

        <DialogActions>
          <Button autoFocus onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>

    </div>
  )
}
export default AddUser;