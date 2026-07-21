import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import { setSingleCompany } from "@/redux/companySlice";

const useGetCompanyById = (companyId) => {
    const dispatch = useDispatch();
    const { token } = useSelector(store => store.auth);

    useEffect(() => {
        const fetchCompanyById = async () => {
            try {
                const res = await axios.get(`${COMPANY_API_END_POINT}/get/${companyId}`, {
                    withCredentials: true,
                    headers: token ? { Authorization: `Bearer ${token}` } : {}
                });
                if (res.data.success) {
                    dispatch(setSingleCompany(res.data.company));
                }
            } catch (error) {
                console.log(error);
            }
        };
        if (companyId) {
            fetchCompanyById();
        }
    }, [companyId, dispatch, token]);
};

export default useGetCompanyById;
