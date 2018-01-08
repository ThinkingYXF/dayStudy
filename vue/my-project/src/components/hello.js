import Vue from 'vue'
import HelloWorld from '@/components/HelloWorld'
import {ajaxRequest} from '../../src/request.js'

Vue.component('todo-item',{
	props: ['todo'],
	template: '<li>{{todo.text}}</li>'
})
var obj = {
	msg: 'This is my first vue app!',
	name: 'Yang',
	age: 24,
	time: 'now time:' + new Date().toLocaleString(),
	isTrue: true,
	list: [{text: 'javascript'},{text: 'css'},{text: 'html'}],
	groupList:[
		{id:0,text:'水果'},
		{id:1,text:'蔬菜'},
		{id:2,text: '随便'}
	],
	rawHtml: '<span style="color: red">This is a span</span>',
	message: 'message',
	question: '',
	answer: 'I can\'t give you an answer until you ask a question!',
	judgeUrl: ''
}
var ajax = new ajaxRequest();
// ajax.getDate('server/data.json',function(json){
//   console.log(json);
// });
export default({
	name: 'HelloWorld',
	methods: {
		reverseMsg: function(){
			this.msg = this.msg.split('').reverse().join('');
		},
		getAnswer: function(){
			if(this.question.indexOf('?') === -1){
				this.answer = 'Question usually contain a question mark. ;-)';
				this.judgeUrl = '';
				return;
			}
			this.answer = 'Thinking...';
			var vm = this;
			ajax.getDate('https://yesno.wtf/api',function(json){
				json = JSON.parse(json);
				vm.judgeUrl = json.image;
				vm.answer = json.answer;
			});
		}
	},
	computed: {
		reverseMessage: function(){
			return this.message.split('').reverse().join('');
		}
	},
	watch: {
		question: function(newQuestion){
			this.answer = 'Waiting for you to stop typing...',
			this.getAnswer();
		}
	},
	data () {
		return obj;
	}
})
