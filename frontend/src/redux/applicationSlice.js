import { createSlice } from "@reduxjs/toolkit";

const applicationSlice = createSlice({
    name: "application",
    initialState: {
        appliedJobs: [],
        applicants: null
    },
    reducers: {
        setAppliedJobs: (state, action) => {
            state.appliedJobs = action.payload;
        },
        setApplicants: (state, action) => {
            state.applicants = action.payload;
        }
    }
});

export const { setAppliedJobs, setApplicants } = applicationSlice.actions;
export default applicationSlice.reducer;
