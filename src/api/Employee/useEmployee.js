import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getAllEmployee, updateUserByID, deleteEmployee, deleteEmployeeList, addEmployee, getEmployeeById, updateEmployee, addEmployeeWithImage } from './employeeApi';

const useGetEmployee = () => {
    return useQuery('data', getAllEmployee);
};


const useGetEmployeeById = (id) => {
    return useQuery(['data', id], () => getEmployeeById(id));
}

const useDeleteEmployee = () => {
    const queryClient = useQueryClient();

    return useMutation(deleteEmployee, {
        onSuccess: () => {
            queryClient.invalidateQueries('data');
        }
    })
}

const useDeleteEmployeeList = () => {
    const queryClient = useQueryClient();

    return useMutation(deleteEmployeeList, {
        onSuccess: () => {
            queryClient.invalidateQueries('data');
        }
    })
}

const useAddEmployee = () => {
    return useMutation(addEmployee);
  };

const useUpdateEmployee = () => {
    const queryClient = useQueryClient();

    return useMutation(updateUserByID, {
        onSuccess: () => {
            queryClient.invalidateQueries('data');
        }
    })
}
export { useGetEmployee, useGetEmployeeById, useDeleteEmployee, useDeleteEmployeeList, useAddEmployee, useUpdateEmployee }

