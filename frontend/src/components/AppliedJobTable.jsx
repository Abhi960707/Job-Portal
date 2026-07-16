import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge'
import { useSelector } from 'react-redux'
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'

const AppliedJobTable = () => {
    useGetAppliedJobs();
    const { appliedJobs } = useSelector(store => store.application);

    return (
        <div className="overflow-x-auto">
            <Table>
                <TableCaption>A list of your applied jobs</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Job Role</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        !appliedJobs || appliedJobs.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                                    You haven't applied to any jobs yet.
                                </TableCell>
                            </TableRow>
                        ) : (
                            appliedJobs.map((appliedJob) => (
                                <TableRow key={appliedJob._id}>
                                    <TableCell>{appliedJob?.createdAt?.split("T")[0] || "N/A"}</TableCell>
                                    <TableCell>{appliedJob.job?.title || "N/A"}</TableCell>
                                    <TableCell>{appliedJob.job?.company?.name || "N/A"}</TableCell>
                                    <TableCell className="text-right">
                                        <Badge className={`text-white font-semibold ${
                                            appliedJob.status === "rejected" ? "bg-red-600 hover:bg-red-700" :
                                            appliedJob.status === "accepted" ? "bg-green-600 hover:bg-green-700" :
                                            "bg-gray-500 hover:bg-gray-600"
                                        }`}>
                                            {appliedJob.status?.toUpperCase() || "PENDING"}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))
                        )
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default AppliedJobTable