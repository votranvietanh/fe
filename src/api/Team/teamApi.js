import axios from 'axios';

const teamApi = axios.create({
    baseURL: "http://localhost:8080/teams"
})

teamApi.interceptors.request.use(
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


export const getTeam = async (team) => {
    const response = await teamApi.get("/getAll", team)
    return response.data;
}

export const getTeamById = async (id) => {
    const response = await teamApi.get(`/${id}`, id)
    return response.data;
}

export const addTeam = async (team) => {
    return await teamApi.post(`/add`, team)
}

export const updateTeam = async (team) => {
    return await teamApi.patch(`/team/update/${team.teamID}`, team)
}

export const deleteTeam = async (id) => {
    return await teamApi.delete(`/team/${id}`, id)
}

