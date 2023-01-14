import Employee from "../model/Employee";

class Factory {
  static instance = null;

  static getInstance() {
    if (Factory.instance == null) {
      Factory.instance = new Factory();
    }
    return this.instance;
  }

  createEmployee(id, name, role, gender, dob, email, address, salary, phone) {
    return new Employee(
      id,
      name,
      role,
      gender,
      dob,
      email,
      address,
      salary,
      phone
    ).parseJSON();
  }

  createLeaveRequest() {}
}

export default Factory;
