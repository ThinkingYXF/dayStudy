import ajax from './ajax';

ajax.get('../../json/data.json', {
  success: function(json){
    console.log(json);
  }
});