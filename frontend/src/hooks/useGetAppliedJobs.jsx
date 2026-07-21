import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { APPLICATION_API_END_POINT } from "@/utils/constant";
import { setAppliedJobs } from "@/redux/applicationSlice";

const useGetAppliedJobs = () => {
    const dispatch = useDispatch();
    const { token } = useSelector(store => store.auth);

    useEffect(() => {
        const fetchAppliedJobs = async () => {
            try {
                const res = await axios.get(`${APPLICATION_API_END_POINT}/get`, {
                    withCredentials: true,
                    headers: token ? { Authorization: `Bearer ${token}` } : {}
                });
                if (res.data.success) {
                    dispatch(setAppliedJobs(res.data.application));
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchAppliedJobs();
    }, [dispatch, token]);
};

export default useGetAppliedJobs;
