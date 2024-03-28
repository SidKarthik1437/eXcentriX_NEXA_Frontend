import React, { useState } from "react";
import * as XLSX from "xlsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import axios from "axios";
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { userServices } from "@/api/services";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import { Badge } from "@/components/ui/badge";

function CreateMany() {
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState("STUDENT");

  let file = null;
  const handleFileUpload = async (e) => {
    file = e.target.files[0];
    if (!file) {
      console.log("Nofile!");
      return;
    }

    const reader = new FileReader();

    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const excelData = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      //   console.log(excelData);

      const transformedData = excelData.map((item) => {
        console.log("item", item);
        return {
          usn: item.USN,
          name: item["Student Name as per -SSLC"],
          dob: item["Date of Birth"].split("-").reverse().join("-"),
          department: item.Department,
          semester: item.Semester,
          role: role,
        };
      });
      console.log("Transformed data:", transformedData);

      setUsers([...users, ...transformedData]);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleCreateUser = async (e) => {
    await toast.promise(userServices.createUser(users), {
      pending: "Users are being created",
      success: "Users Created Successfuly 👌",
      error: "Error creating Users 🤯",
    });
    setUsers([]);
  };

  return (
    <div className="flex flex-col p-2 space-y-2">
      <ToastContainer />
      <div className="flex w-full p-2 items-center justify-around">
        <Select onValueChange={(e) => setRole(e)} value={role}>
          <SelectTrigger className="w-1/3">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="STUDENT">Student</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          className="mb-2 w-1/3"
        />
      </div>
      <div
        className="rounded-lg border overflow-y-auto scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-track-purple-200 scrollbar-thumb-purple-500  "
        style={{ maxHeight: "630px", width: "100%" }}
      >
        <Table className="w-full rounded">
          <TableHeader className="rounded">
            <TableRow className="bg-primary text-white font-semibold hover:bg-primary rounded">
              <TableHead className="text-white font-semibold">USN</TableHead>
              <TableHead className="text-white font-semibold">Name</TableHead>
              <TableHead className="text-white font-semibold">
                Date of Birth
              </TableHead>
              <TableHead className="text-white font-semibold">
                Department
              </TableHead>
              <TableHead className="text-white font-semibold">
                Semester
              </TableHead>
              <TableHead className="text-white font-semibold">Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user, index) => (
              <TableRow key={index} className="hover:bg-purple-100">
                <TableCell>{user.usn}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.dob}</TableCell>
                <TableCell>{user.department}</TableCell>
                <TableCell>{user.semester}</TableCell>
                <TableCell>{user.role}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Button
        onClick={(e) => handleCreateUser(e)}
        className="space-x-2"
        disabled={users.length === 0}
      >
        <span>Create</span>
        <Badge className="bg-white text-primary font-semibold hover:bg-white">
          {users.length}
        </Badge>
      </Button>
    </div>
  );
}

export default CreateMany;
