let common = {
  merge: function(now, target){
    for(let i in target){
      if(!now[i] || now[i] !== target[i])
        now[i] = target[i];
      else if(target[i].constructor == Object){
        common.merge(now[i], target[i]);
      }
    }
  }
}

export default common;