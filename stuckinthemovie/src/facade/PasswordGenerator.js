class PasswordGenerator {
  static instance = null;

  static getInstance() {
    if (PasswordGenerator.instance == null) {
      PasswordGenerator.instance = new PasswordGenerator();
    }
    return this.instance;
  }

  passwordGen(date) {
    //B!nus09102003
    const generatedPassword = `B!nus${date}`;
    return generatedPassword;
  }
}

export default PasswordGenerator;
