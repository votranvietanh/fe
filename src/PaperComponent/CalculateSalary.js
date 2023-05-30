import axios from "axios";
import authHeader from '../services/auth-header';

 async function CalculateSalary(Month,Mph,id) {
   

    const result = await axios.get(
        `http://localhost:8080/users/user/${id}`,
        { headers: authHeader() }
    );
    const advanceList = result.data.advanceList;
    const workTimes = result.data.workTimeList;


    const filteredAdvances = advanceList.filter((obj) =>
        Object.values(obj).some((val) =>
            typeof val === 'string' && val.includes(Month)
        )
    );
    const filteredWorkingDates = workTimes.filter((obj) =>
        Object.values(obj).some((val) =>
            typeof val === 'string' && val.includes(Month)
        )
    );
    const totalAdvances = filteredAdvances.reduce(
        (accumulator, currentValue) => accumulator + currentValue.money,
        0
    );
    const totalHours = filteredWorkingDates.reduce(
        (accumulator, currentValue) => accumulator + currentValue.workHours,
        0
    );
     const netPay = totalHours * Mph - totalAdvances;
    
    return {netPay, filteredWorkingDates, totalHours, totalAdvances } ;

}
// export function netPay();
export default CalculateSalary;
     