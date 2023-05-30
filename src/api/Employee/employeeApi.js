import axios from 'axios';

const employeeApi = axios.create({
    baseURL: "http://localhost:8080/users",
})
//authentication token request
employeeApi.interceptors.request.use(
    (config) => {
        const storedToken = localStorage.getItem('user');
        if (storedToken) {
            const token = JSON.parse(storedToken).accessToken;
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        Promise.reject(error);
    }
);

export const getAllEmployee = async (employee) => {
    const response = await employeeApi.get("/getAll", employee)
    return response.data;
}

export const getEmployeeById = async (id) => {
    const response = await employeeApi.get(`/${id}`)
    return response.data;
}

export const addEmployee = async (employee) => {
    return await employeeApi.post(`/add`, employee);
}

export const deleteEmployee = async (id) => {
    return await employeeApi.delete(`/user/${id}`);
}
export const deleteEmployeeList = async (ids) => {
    return await employeeApi.delete(`/${ids}`);
}

export const updateUserByID = async (id, employee) => {
    return await employeeApi.put(`/user/${id}`, employee);
}


