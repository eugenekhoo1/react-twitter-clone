modules.export = class User {
  constructor(name, pwdHash, pwdSalt) {
    this.name = name;
    this.pwdHash = pwdHash;
    this.pwdSalt = pwdSalt;
  }
};
