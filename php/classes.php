<?php

$DEFAULT_CONDITION = 'Condition';

class Question{
  public ?array $subq = null;

  public function getQuestion($indexArr){
    if(count($indexArr) == 0){
      return $this;
    }
    return $this->subq[intval(array_shift($indexArr))]->getQuestion($indexArr);
  }
  

  public function getPoints($indexArr){
    if(count($indexArr) == 0){
      return $this->points;
    }
    return $this->subq[intval(array_shift($indexArr))]->getPoints($indexArr);
  }
  public function getAnswer($indexArr){
    if(count($indexArr) == 0){
      return $this->answer;
    }
    return $this->subq[intval(array_shift($indexArr))]->getAnswer($indexArr);
  }
  public function getType($indexArr){
    if(count($indexArr) == 0){
      return $this->type;
    }
    return $this->subq[intval(array_shift($indexArr))]->getType($indexArr);
  }


  public function addSubQ($sub, $indexArr){
    if(count($indexArr) == 0){
      if($this->subq == null) $this->subq = array();
      array_push($this->subq, $sub);
    } else {
      $this->subq[intval(array_shift($indexArr))]->addSubQ($sub, $indexArr);
    }
  }

  public function delete($indexArr){
    if(count($indexArr) == 1){
      if(count($this->subq) == 1) return true;
      array_splice($this->subq, $indexArr[0], 1);
      return false;
    } else {
      $id = intval(array_shift($indexArr));
      $toDel = $this->subq[$id]->delete($indexArr);
      if($toDel){
        if(count($this->subq) == 1) return true;
        array_splice($this->subq, $id, 1);
      }
      return false;
    }
  }

  public function cloneSelf(){
    $new = clone $this;
    $new->subq = array();
    for($subID = 0; isset($this->subq[$subID]); $subID++){
      array_push($new->subq, $this->subq[$subID]->cloneSelf());
    }
    return $new;
  }

}


class QuestionContent extends Question{
  public ?string $type;
  public ?float $points;
  public ?string $answer;

  public function __construct($typeI){
    global $DEFAULT_CONDITION;
    $this->type = $typeI;
    $this->points = 1;
    switch($typeI){
      case 'Module':
        $this->subq = array(new QuestionContent('Closed'));
        break;
      case 'Closed':
        $this->answer = 'A';
        break;
      case 'Opened':
        $this->answer = '0';
        break;
      case 'Check':
        $this->answer = $DEFAULT_CONDITION;
        break;
      case 'Descriptive':
        $this->subq = array(new QuestionContent('Check'));
        break;
      case 'Composite':
        $this->subq = array(new QuestionContent('Closed'));
        break;
    }
  }

  public function changePoints($diff, $indexArr){
    $this->points += $diff;
    if(count($indexArr) == 0){
      return;
    }
    $this->subq[intval(array_shift($indexArr))]->changePoints($diff, $indexArr);
  }
  public function changeAnswer($answer, $indexArr){
    if(count($indexArr) == 0){
      $this->answer = $answer;
      return;
    }
    $this->subq[intval(array_shift($indexArr))]->changeAnswer($answer, $indexArr);
  }
  
}

class QuestionResponse extends Question{
  public ?int $status;
  public ?string $answer;
  public ?array $subq = null;

  function __construct($typeI){
    switch($typeI){
      case 'Module':
        $this->subq = array(new QuestionResponse('Closed'));
        break;
      case 'Closed':
        $this->answer = '';
        $this->status = 3;
        break;
      case 'Opened':
        $this->answer = '';
        $this->status = 3;
        break;
      case 'Check':
        $this->answer = '';
        $this->status = 3;
        break;
      case 'Descriptive':
        $this->subq = array(new QuestionResponse('Check'));
        break;
      case 'Composite':
        $this->subq = array(new QuestionResponse('Closed'));
        break;
    }
  }

  public function changeAnswer($answer, $indexArr, $correctAnswer){
    if(count($indexArr) == 0){
      $this->answer = $answer;
      if($answer === null) $this->status = 3;
      else if($answer === '') $this->status = 2;
      else if($answer === $correctAnswer) $this->status = 1;
      else $this->status = 0;
      return;
    }
    $id = intval(array_shift($indexArr));
    $this->subq[$id]->changeAnswer($answer, $indexArr, $correctAnswer);
  }

  public function checkAnswer($answer, $indexArr){
    if(count($indexArr) == 0){
      if($this->status > 1) return;
      if($this->answer == $answer) $this->status = 1;
      else $this->status = 0;
      return;
    }
    $this->subq[intval(array_shift($indexArr))]->checkAnswer($answer, $indexArr);
  }

  public function getStatus($indexArr){
    if(count($indexArr) == 0){
      return $this->status;
    }
    return $this->subq[intval(array_shift($indexArr))]->getStatus($indexArr);
  }

  public function setStatus($indexArr, $status){
    if(count($indexArr) == 0){
      if(isset($this->status))
        $this->status = $status;
      if(isset($this->subq)){
        foreach ($this->subq as $sub){
          $sub->setStatus($indexArr, $status);
        }
      }
      return;
    }
    $id = intval(array_shift($indexArr));
    $this->subq[$id]->setStatus($indexArr, $status);
  }

  public function calcPoints($content){
    $points = 0;
    if($content->type == 'Module' || $content->type == 'Composite' || $content->type == 'Descriptive'){
      for($i = 0; $i < count($this->subq);$i++){
        $points += $this->subq[$i]->calcPoints($content->subq[$i]);
      }
    }
    else if($content->type == 'Opened' || $content->type == 'Closed' || $content->type == 'Check'){
      if($this->status == 1) return $content->points;
      return 0;
    }
    return $points;
  }
  
  public function getQuestion($indexArr){
    if(count($indexArr) == 0){
      return $this;
    }
    return $this->subq[intval(array_shift($indexArr))]->getQuestion($indexArr);
  }
}

class QuestionForm extends Question{
  public ?float $left;
  public ?float $top;
  public ?float $width;
  public ?float $height;
  public ?float $page;
  public ?array $subq;
  public function __construct($type){
    switch($type){
    case 'Single':
      $page = null;
      break;
    case 'Layered':
      $this->subq = array(new QuestionForm('Single'));
      break;
    }
  }
  
  public function resetAll(){
    foreach($this->subq as $id=>$sub){
      if(key_exists('page', $sub)){
        $this->subq[$id] =  new QuestionForm('Single');
      }
      else {
        $sub->resetAll();
      }
    }
  }
  public function setValue($value, $indexArr){
    if(count($indexArr) == 1 && empty($value)){
      $this->subq[$indexArr[0]] =  new QuestionForm('Single');
      return;
    }
    if(count($indexArr) == 0){
      $this->left = $value['left'];
      $this->top = $value['top'];
      $this->width = $value['width'];
      $this->height = $value['height'];
      $this->page = $value['page'];
      return;
    } else {
      $id = intval(array_shift($indexArr));
      if(!isset($this->subq)) $this->subq = array();
      if(!isset($this->subq[$id])) $this->subq[$id] = new QuestionForm('Single');
      $this->subq[$id]->setValue($value, $indexArr);
    }
  }

  // public function decreaseIndexes($index){
  //   $newSub = array();
  //   foreach($this->subq as $key=>$value){
  //     if(intval($key) <= $index){
  //       $newSub[$key] = $value;
  //     } else {
  //       $newSub[intval($key)-1] = $value;
  //     }
  //   }
  //   $this->subq = $newSub;
  // }

}
?>