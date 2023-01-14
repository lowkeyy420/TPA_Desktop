import { format } from "date-fns";

export const roleOptions = [
  { value: "Administrator", label: "Administrator" },
  { value: "Manager", label: "Manager" },
  { value: "Accounting", label: "Accounting and Finance" },
  { value: "Human Resource", label: "Human Resource" },
  { value: "Storage", label: "Storage Department" },
  { value: "External", label: "External Department" },
  { value: "Promotion", label: "Promotion and Event" },
  { value: "Movie Schedule", label: "Movie Schedule Division" },
  { value: "Movie Front Office", label: "Movie Front Office Division" },
  { value: "Movie Operation", label: "Movie Operation Division" },
  { value: "Cafe Front Office", label: "Cafe Front Office Division" },
  { value: "Cafe Kitchen", label: "Cafe Kitchen Division" },
];

class Employee {
  id = "";
  name = "";
  role = "";
  dob = "";
  email = "";
  address = "";
  gender = "";
  salary = 0;
  status = "";
  startWorkingDate = "";
  phone = "";

  constructor(id, name, role, gender, dob, email, address, salary, phone) {
    this.id = id;
    this.name = name;
    this.role = role;
    this.gender = gender;
    this.dob = dob;
    this.email = email;
    this.address = address;
    this.salary = salary;
    this.phone = phone;

    this.status = "Active";
    this.startWorkingDate = format(new Date(), "dd/MM/yyyy").toString();
  }

  parseJSON() {
    const res = `{"name":"${this.name}","role":"${this.role}","gender":"${this.gender}","dob":"${this.dob}","email":"${this.email}","address":"${this.address}","salary":"${this.salary}","status":"${this.status}","startWorkingDate":"${this.startWorkingDate}","phone":"${this.phone}"}`;
    return res;
  }
}

export default Employee;
