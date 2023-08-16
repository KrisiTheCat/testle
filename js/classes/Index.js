class Index {
    constructor() {
      this.moduleID = -1;
      this.questionID = -1;
      this.subID = -1;
      this.checkID = -1;
    }
    constructor(m,q,s,c) {
        this.moduleID = m;
        this.questionID = q;
        this.subID = s;
        this.checkID = c;
    }
    constructor(code) {
        code = code.split('_');
        this.moduleID = code[0];
        this.questionID = code[1];
        this.subID = code[2];
        this.checkID = code[3];
    }
    toCode(){
        return this.moduleID + '_' + this.questionID + '_' + this.subID + '_' + this.checkID;
    }
}