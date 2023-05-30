import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


import AddUser from '../PaperComponent/AddUser';
import { DeleteUserDialog } from '../PaperComponent/DeleteUser';
import '../App.css';
import AddSearchBar from '../modal/AddSearchBar'
import { useGetEmployee, useDeleteEmployee, useDeleteEmployeeList, useAddEmployee, useUpdateEmployee } from '../api/Employee/useEmployee';
import LoadingScreen from './LoadingScreen'

function TableUser() {

  const [selectedRowIds, setSelectedRowIds] = useState([]);
  ///// change
  const deleteEmployee = useDeleteEmployee();
  const deleteEmployeeList = useDeleteEmployeeList();
  const addEmployee = useAddEmployee();
  



  /////

  const { data, isLoading, error } = useGetEmployee();



  const onDeleteEmployee = async (id) => {
    await deleteEmployee.mutateAsync(id);
  };

  const onDeleteEmployeeList = async () => {
    await deleteEmployeeList.mutateAsync(selectedRowIds);
    setSelectedRowIds([]);

  }

  const editFormatter = (_, row) => (
    <div style={{ textAlign: "center", cursor: "pointer", lineHeight: "normal" }}>
      <Link to={`/detail/user/${row.id}`}>
        <img src="/InforIcon.svg" alt="infor-icon" />
      </Link>
      <img onClick={() => onDeleteEmployee(row.id)} style={{ marginLeft: 10 }} src="/DeleteIcon.svg" alt="delete-icon" />
    </div>
  );
  const idFormatter = (_, __, rowIndex) => {
    const calculateRowNumber = () => {
      let rowNumber;
      if (currentPage !== 1) {
        setCurrentPage(1);
        setSizePerPageList(5);
        rowNumber = (currentPage - 1) * sizePerPageList + rowIndex + 1;
        console.log("Current page: " + currentPage);
      } else {
        setSizePerPageList(5);
        rowNumber = (currentPage - 1) * sizePerPageList + rowIndex + 1;
        console.log("Current page: " + currentPage);
      }
      return rowNumber;
    };

    return <span>{calculateRowNumber()}</span>;
  };
  const selectRow = {
    mode: 'checkbox',
    style: { background: 'rgba(90, 140, 194, 0.5)' },
    selected: selectedRowIds,
    onSelect: (row, isSelected) => {
      setSelectedRowIds(isSelected
        ? [...selectedRowIds, row.id]
        : selectedRowIds.filter(id => id !== row.id)
      );
    },
    onSelectAll: (isSelected, rows) => {
      setSelectedRowIds(isSelected ? rows.map(row => row.id) : []);
    }
  };
  const [currentPage, setCurrentPage] = useState(1);
  const [sizePerPageList, setSizePerPageList] = useState('');
  const options = {
    sizePerPageList: [{
      text: 5, value: 5
    }, {
      text: 'All', value: data?.length
    }],
    onPageChange: page => {
      setCurrentPage(page);
    },
    page: currentPage
  };
  const columns = [
    {
      dataField: 'no',
      text: 'No',
      formatter: idFormatter,
      headerStyle: { width: '50px', textAlign: 'center' }
    }
    , {
      dataField: 'name',
      text: 'Full name',
      headerStyle: { width: '400px', textAlign: 'center' }
    }, {
      dataField: 'phone',
      text: 'Phone',
      headerStyle: { width: '250px', textAlign: 'center' }
    }
    , {
      dataField: 'nameTeam',
      text: 'Team',
      headerStyle: { width: '250px', textAlign: 'center' }
    }, {
      dataField: "edit",
      text: "Option",
      formatter: editFormatter,
      headerAttrs: { width: 100 },
      attrs: { width: 50, className: "EditRow" },
    }
  ];

  const reversedUsers = data ? [...data].reverse() : [];
  return (
    <div>
      <div>
        <div className='input-area'>
          <div className='title'>
            <b
              style={{ fontSize: `2.5rem` }}
            >Employee</b>
          </div>

          <div className='icon-title'>
            <AddUser/>
            <DeleteUserDialog selectedRowIds={selectedRowIds} onClick={onDeleteEmployeeList} />
          </div>
        </div>

      </div>
      <AddSearchBar SelectRow={selectRow} Data={reversedUsers} Options={options} Columns={columns} Keys={true} Placeholder="Search by name" />
    </div >
  );
}

export default TableUser;