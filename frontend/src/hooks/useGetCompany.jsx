import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import { setCompanies } from "@/redux/companySlice";

const useGetCompany = () => {
    const dispatch = useDispatch();
    const { token } = useSelector(store => store.auth);

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const res = await axios.get(`${COMPANY_API_END_POINT}/get`, {
                    withCredentials: true,
                    headers: token ? { Authorization: `Bearer ${token}` } : {}
                });
                if (res.data.success) {
                    dispatch(setCompanies(res.data.companies));
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchCompany();
    }, [dispatch, token]);
};

export default useGetCompany;
