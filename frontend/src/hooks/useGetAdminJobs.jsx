import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { JOB_API_END_POINT } from "@/utils/constant";
import { setAdminJobs } from "@/redux/jobSlice";

const useGetAdminJobs = () => {
    const dispatch = useDispatch();
    const { token } = useSelector(store => store.auth);

    useEffect(() => {
        const fetchAdminJobs = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/getadminjobs`, {
                    withCredentials: true,
                    headers: token ? { Authorization: `Bearer ${token}` } : {}
                });
                if (res.data.success) {
                    dispatch(setAdminJobs(res.data.jobs));
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchAdminJobs();
    }, [dispatch, token]);
};

export default useGetAdminJobs;
