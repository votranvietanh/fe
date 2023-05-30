import React from 'react'
import { useState, useEffect } from "react";
import * as yup from 'yup';
import axios from 'axios';
import { TextField } from '@mui/material';
import { compareAsc, parseISO } from 'date-fns';


import MyVerticallyCenteredModal from '../modal/MyVerticallyCenteredModal';
import { Button, Form } from 'react-bootstrap';
import { useParams } from "react-router-dom";
import authHeader from '../services/auth-header';
import AuthService from '../services/auth.service';

import "bootstrap/dist/css/bootstrap.min.css";
import '../Styles/TableUser.css'
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import AddSearchBar from '../modal/AddSearchBar'


function DetailWorking(props) {

    const [data, setData] = useState([]);
    const { id } = useParams();
    const [modalShowAdd, setModalShowAdd] = useState(false);
    const [modalShowUpdate, setModalShowUpdate] = useState(false);

    const [errors, setErrors] = useState({});
    const [filteredWorkingDates, setFilteredWorkingDates] = useState([]);




    const currentUser = AuthService.getCurrentUser();
    const [newWorkDate, setNewWorkDate] = useState({ workDate: "", workHours: "" });
    const { workDate, workHours } = newWorkDate;
    const getData = async (id) => {
        await axios.get(`http://localhost:8080/users/user/${id}`, { headers: authHeader() })
            .then((result) => {
                const workTimes = result.data.workTimeList;
                setData(workTimes);
                setFilteredWorkingDates(workTimes.map((workTime) => workTime.workDate));
                // console.log(filteredWorkingDates)
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const validationSchema =
        yup.object().shape({
            workDate: yup
                .string()
                .required('Date is required')
                .test('unique', 'This date is already taken', function (value) {
                    return !filteredWorkingDates.includes(value);
                }),
            workHours: yup.number().positive('workHours must be positive')
                .min(1, 'workHours must be greater than or equal to 1')
                .max(24, 'workHours must be less than or equal to 24')
                .required('workHours is required'),
        }

        );
        
    const validationUpdate =
    yup.object().shape({
     
        workHours: yup.number().positive('workHours must be positive')
            .min(1, 'workHours must be greater than or equal to 1')
            .max(24, 'workHours must be less than or equal to 24')
            .required('workHours is required'),
    }

    );

    useEffect(() => {
        getData(id);
        if (modalShowAdd) { setNewWorkDate({ workDate: "", workHours: "" }); }
        if (modalShowUpdate) { setErrors({}) }
    }, [modalShowAdd,modalShowUpdate])
    const handleDelete = async (rowID) => {
        await axios.delete(`http://localhost:8080/user/worktimes/${rowID}`,
            { headers: authHeader() })
        // console.log("Deleteing id ", rowID)
        getData(id)
    }

    const updateWorkTime = async (id, idWork) => {
        try {
            await validationUpdate.validate(newWorkDate, { abortEarly: false });
            try {
                await axios.put(`http://localhost:8080/user/${id}/worktimes/${idWork}`, newWorkDate, { headers: authHeader() })
                setModalShowUpdate(false);
            } catch (error) {
                console.log('Error creating user1:', error.message);
            }
        } catch (error) {
            // Xử lý lỗi khi dữ liệu không hợp lệ
            const validationErrors = {};
            error.inner.forEach((err) => {
                validationErrors[err.path] = err.message;
            });
            setErrors(validationErrors);
            console.log(errors);
            console.error('Error creating user2:', error.message);
        }
     
    }
    const [idWork, setIdWork] = useState()
    const getIdData = async (array, id) => {
        setModalShowUpdate(true);
        setIdWork(id)
        console.log(id)
        const element = array.find(item => item.id === id);
        if (element) {
            setNewWorkDate({ workDate: element.workDate, workHours: element.workHours })
        }
    };


    const editFormatter = (_, row,) => {
        return (
            <div
                style={{
                    textAlign: "center",
                    cursor: "pointer",
                    lineHeight: "normal"
                }}
            >
                <img onClick={() => getIdData(data, row.id)} style={{ marginLeft: 10 }} src="/EditIcon.svg" alt="edit-icon" />
                <img onClick={() => handleDelete(row.id)} style={{ marginLeft: 10 }} src="/DeleteIcon.svg" alt="delete-icon" />
            </div>
        );
    };
    const [currentPage, setCurrentPage] = useState(1);
    const [sizePerPageList, setSizePerPageList] = useState('');
    const idFormatter = (_, __, rowIndex) => {
        const calculateRowNumber = () => {
            let rowNumber;
            if (currentPage !== 1) {
                setCurrentPage(1);
                setSizePerPageList(5);
                rowNumber = (currentPage - 1) * sizePerPageList + rowIndex + 1;
                // console.log("Current page: " + currentPage);
            } else {
                setSizePerPageList(5);
                rowNumber = (currentPage - 1) * sizePerPageList + rowIndex + 1;
                // console.log("Current page: " + currentPage);
            }
            return rowNumber;
        };
        return <span>{calculateRowNumber()}</span>;
    };

    //format date


    const columns = [
        {
            dataField: 'no',
            text: 'No',
            sort: true,
            formatter: idFormatter,

        },
        {
            dataField: "formattedDate",
            text: "Date",
            sort: true,
            sortFunc: (a, b, order) => {
                const dateA = parseISO(a);
                const dateB = parseISO(b);

                if (order === 'asc') {
                    return compareAsc(dateA, dateB);
                } else {
                    return compareAsc(dateB, dateA);
                }
            },
            formatter: (_, row) => {
                if (row.workDate) {
                    const parts = row.workDate.split("-");
                    return `${parts[2]}-${parts[1]}-${parts[0]}`;
                }
                return "";
            },
        },
        {
            dataField: 'workHours',
            text: 'Hour',
            sort: true,

        },
        {
            dataField: "edit",
            text: "Option",
            sort: false,
            formatter: editFormatter,
            headerAttrs: { width: 100 },
            attrs: { width: 50, className: "EditRow" }
        }
    ];

    const options = {
        sizePerPageList: [{
            text: 5, value: 5
        }, {
            text: 'All', value: data.length
        }],
        onPageChange: page => {
            setCurrentPage(page);
        },
        page: currentPage
    };
    const onInputChange = async (e) => {
        setNewWorkDate((prevWorkDate) => ({
            ...prevWorkDate,
            [e.target.name]: e.target.value,
        }
        ))

        try {
            await yup.reach(validationSchema, e.target.name).validate(e.target.value);
            setErrors((prevErrors) => ({ ...prevErrors, [e.target.name]: '' }));
        } catch (error) {
            setErrors((prevErrors) => ({ ...prevErrors, [e.target.name]: error.message }));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await validationSchema.validate(newWorkDate, { abortEarly: false });
            // console.log(newWorkDate)
            // console.log('Form submitted');
            try {
                await axios.post(`http://localhost:8080/user/user/${id}/worktimes`, newWorkDate, { headers: authHeader() })
                setModalShowAdd(false);
            } catch (error) {
                console.log('Error creating user1:', error.message);
            }
        } catch (error) {
            // Xử lý lỗi khi dữ liệu không hợp lệ
            const validationErrors = {};
            error.inner.forEach((err) => {
                validationErrors[err.path] = err.message;
            });
            setErrors(validationErrors);
            console.error('Error creating user2:', error.message);


        }
    };

    //   console.log(isValid);
    const content =
        <div onSubmit={handleSubmit} style={{ width: "fit-content", margin: 0 }}>
            <Form onSubmit={handleSubmit} >
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label style={{
                        fontSize: "16.33px"
                    }}>Working date</Form.Label>
                    <TextField
                        name="workDate"
                        value={workDate}
                        // defaultValue={moment().format("dd-mm-yyyy")}
                        type="Date"
                        autoFocus
                        onChange={(e) => {
                            onInputChange(e)
                            // console.log(`your input's value is: ${e.target.value}`)
                        }}
                        error={!!errors.workDate}
                        helperText={errors.workDate}
                        required
                        style={{ width: 230 }}
                    />
                </Form.Group>
                <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlTextarea1"
                >
                    <Form.Label style={{
                        fontSize: "16.33px"
                    }}>Hourly working</Form.Label>

                    <TextField style={{ width: 230 }}
                        required
                        name="workHours"
                        value={workHours}
                        // label="Work Hour"
                        onChange={(e) => onInputChange(e)}
                        error={!!errors.workHours}
                        helperText={errors.workHours}
                    />


                </Form.Group>
            </Form>
        </div>
    const update =
        <div onSubmit={handleSubmit} style={{ width: "fit-content", margin: 0 }}>
            <Form onSubmit={handleSubmit} >
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label style={{
                        fontSize: "16.33px"
                    }}>Working date</Form.Label>
                    <TextField
                        disabled
                        name="workDate"
                        value={newWorkDate.workDate}
                        // defaultValue={moment().format("dd-mm-yyyy")}
                        type="Date"
                        autoFocus
                        onChange={(e) => {
                            onInputChange(e)
                            // console.log(`your input's value is: ${e.target.value}`)
                        }}
                        error={!!errors.workDate}
                        helperText={errors.workDate}
                        required
                        style={{ width: 230 }}
                    />
                </Form.Group>
                <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlTextarea1"
                >
                    <Form.Label style={{
                        fontSize: "16.33px"
                    }}>Hourly Working</Form.Label>

                    <TextField style={{ width: 230 }}
                        required
                        name="workHours"
                        value={newWorkDate.workHours}
                        label="Work Hour"
                        onChange={(e) => onInputChange(e)}
                        error={!!errors.workHours}
                        helperText={errors.workHours}
                    />


                </Form.Group>
            </Form>
        </div>
    return (

        <div className='container'>

            <div className='row mb-2'>
                <div className='col-6 d-flex justify-content-start'>
                    <h1>WORKING</h1>
                </div>
                <div className='col-6 d-flex justify-content-end'>
                    {
                        currentUser?.roles.includes("ROLE_ADMIN") &&
                        <Button variant="light" onClick={() => setModalShowAdd(true)}   >
                            <img className='float-end' src="/PlusIcon.svg" alt="plus-icon" />
                        </Button>
                    }
                </div>
            </div>

            <MyVerticallyCenteredModal

                header={"Add the working date"}
                content={content}
                show={modalShowAdd}
                onHide={() => setModalShowAdd(false)}
                onSubmit={handleSubmit}
                onClose={() => setModalShowAdd(false)}
            />

            <MyVerticallyCenteredModal
                header={'UPDATE THE WORKING DATE'}
                content={update}
                show={modalShowUpdate}
                onHide={() => setModalShowUpdate(false)}
                onSubmit={() => updateWorkTime(id, idWork)}
                onClose={() => setModalShowUpdate(false)}

            />
            <AddSearchBar Data={data} Options={options} Columns={columns} Placeholder="Search by YYYY-MM-DD"/>
        </div>
    );
}



export default DetailWorking;