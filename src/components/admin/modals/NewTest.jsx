import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context/UserContext";
import { DataContext } from "../../../context/DataContext";
import { examServices } from "../../../api/services";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  subject: z.string({ required_error: "Please select a subject" }).min(1),
  department: z.string({ required_error: "Please select a department" }).min(1),
  semester: z.string({ required_error: "Please select a semester" }).min(1),
});

function NewTest({ departments, subjects, setTestOpen }) {
  const semesters = ["1", "2", "3", "4", "5", "6", "7", "8"];
  const [newData, setNewData] = useState({});
  const { tests, setTests } = useContext(DataContext);
  // exam.duration.split(":").map((part) => part.padStart(2, "0"))
  const { user } = useContext(UserContext);

  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  const handleSave = async (values) => {
    // newData.created_by = user.usn;
    // newData.created_by = 7;
    values["created_by"] = user.usn;
    values["department"] = departments.filter(
      (department) => department.name === values.department
    )[0].id;
    values["subject"] = subjects.filter(
      (subject) => subject.name === values.subject
    )[0].id;

    examServices
      .createExam(values)
      .catch((err) => {
        console.log(err.message, err.response.data);
      })
      .then(async (res) => {
        console.log("Test Created Successfully! ", res.data);
        await examServices.fetchExams().then((res) => {
          setTests(res.data);
        });
      });
    setTestOpen(false);
  };

  return (
    <Card className=" w-1/2 card-container relative rounded-xl border-purple-300 bg-white space-y-4 z-10">
      <Button
        className="absolute top-0 right-0 rounded-bl-2xl text-2xl rounded-tr-xl"
        onClick={() => setTestOpen(false)}
      >
        &times;
      </Button>
      <CardHeader className="flex justify-center items-center">
        <CardTitle className="">New Test Configuration</CardTitle>
      </CardHeader>
      <CardContent className="m-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)} className=" space-y-4">
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject :</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the subject" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem value={subject.name} key={subject.id}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exam Department:</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the exam department" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {departments.map((department) => (
                        <SelectItem value={department.name} key={department.id}>
                          {department.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="semester"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Semester :</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select semester" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {semesters.map((semester) => (
                        <SelectItem value={semester} key={semester.id}>
                          {semester}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit">Save</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default NewTest;
