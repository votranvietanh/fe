
import React, { useState } from 'react';
import { TextField } from '@mui/material';
import BootstrapTable from 'react-bootstrap-table-next';
import { useEffect } from 'react';

import { useParams } from 'react-router-dom';
import CalculateSalary  from '../PaperComponent/CalculateSalary';


function DetailStatic(props) {
  const [monthWork, setMonthWork] = useState({ month: '' });


  const { id } = useParams()
  const formatDate = (dateString) => {
    if (dateString !== null) {
      const [year, month] = dateString.split('-');
      return `${month}/${year}`;
    } else {
      return '';
    }
  }

  /////
  useEffect(() => {
    const fetchData = async () => {
      try {
        const salaryData = await CalculateSalary(monthWork.month, props.mph,id)
        console.log(salaryData.totalHours * props.mph)
        console.log(salaryData.totalAdvances)

        setData([
          {
            id: formatDate(monthWork.month),
            netPay: `$ ${salaryData.netPay}`,
            workDays: `${salaryData.filteredWorkingDates.length}`,
            salary: `$${salaryData.totalHours * props.mph}`,
            advances: `$${salaryData.totalAdvances}`,
          },
        ]);
      } catch (error) {
        console.log(error)
      }
    };

    if (monthWork.month !== '') {
      fetchData();
    }
  }, [monthWork, id, props.mph]);

  const [data, setData] = useState([]);

  ////

  const columns = [
    { dataField: 'id', text: 'The month' },
            
    { dataField: 'workDays', text: 'Num of work days',headerAttrs: { width: 165 }, },
    { dataField: 'salary', text: 'Total salary' },
    { dataField: 'advances', text: 'Total advances',headerAttrs: { width: 140 },  },
    { dataField: 'netPay', text: 'NET PAY' },
  ];

  return (
    <div className='container'>
      <div className="d-flex justify-content-end">

        <TextField
          label="Choose month and year"
          type="month"
          InputLabelProps={{
            shrink: true,
          }}
          name='month'
          value={monthWork.month}
          onChange={(e) => {
            setMonthWork({ ...monthWork, month: e.target.value });
          }}
        />
      </div>
      <div
      >
        <BootstrapTable
          keyField='id'
          data={data}
          columns={columns}
          striped
          hover
          condensed
          noDataIndication={() => <div>No data available</div>}

        />
      </div>


    </div >


  );
}

export default DetailStatic;