import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { JOB_API_END_POINT } from "@/utils/constant";
import { setAdminJobs } from "@/redux/jobSlice";

const useGetAdminJobs = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchAdminJobs = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/getadminjobs`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setAdminJobs(res.data.jobs));
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchAdminJobs();
    }, [dispatch]);
};

export default useGetAdminJobs;
