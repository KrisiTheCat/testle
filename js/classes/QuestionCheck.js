class Question{
    constructor(ind, content){
        this.index = ind;
        this.answer = content[ind.moduleId][ind.questionID][subID];
    }
}