import Vue from 'vue'
import HelloWorld from '@/components/HelloWorld'
import {ajaxRequest} from '../../src/request.js'

import { mapState } from 'vuex'

Vue.component('todo-item',{
	props: ['todo'],
	template: '<li>{{todo.text}}</li>'
});

var defaultSides = 10,
	stats = Array.apply(null, {length: defaultSides}).map(function(){
		return 100;
	});
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
	judgeUrl: '',
	items: [1,2,3,4,5,6,7,8,9],
	nextNum: 10,
	cells: Array.apply(null, {length: 81}).map(function(_, index){
		return {
			id: index,
			number: index % 9 + 1
		}
	}),

	stats: stats,
	points: generatePoints(stats),
	sides: defaultSides,
	minRadius: 50,
	interval: null,
	updateInterval: 500
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
		addOption: function(){
			// this.groupList.push({id:this.groupList.length,text: '莎拉'});							//会跟着变
			// this.groupList[this.groupList.length] = {id:this.groupList.length,text: '莎拉'};		//不会跟着变
			Vue.set(this.groupList, this.groupList.length, {id:this.groupList.length,text: '莎拉'});	//会跟着变
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
		},
		randomIndex: function(){
			return parseInt(Math.random()*this.items.length);
		},
		addNum: function(){
			this.items.splice(this.randomIndex(), 0, this.nextNum++);
		},
		removeNum: function(){
			this.items.splice(this.randomIndex(), 1);
		},
		shuffle: function(){
			this.cells = _.shuffle(this.cells);
		},

		//圆形变化
		randomizeStats: function () {
			var vm = this
			this.stats = this.stats.map(function () {
			  return vm.newRandomValue()
		  })
		},
		newRandomValue: function () {
			return Math.ceil(this.minRadius + Math.random() * (100 - this.minRadius))
		},
		resetInterval: function () {
			var vm = this
			clearInterval(this.interval)
			this.randomizeStats()
			this.interval = setInterval(function () {
			  vm.randomizeStats()
			}, this.updateInterval)
		}
	},
	computed: {
		doneTodosCount () {
			return this.$store.state.todos.filter(todo => todo.done).length
		}
	},
	watch: {
		question: function(newQuestion){
			this.answer = 'Waiting for you to stop typing...',
			this.getAnswer();
		},

		//圆形变化
		sides: function (newSides, oldSides) {
			var sidesDifference = newSides - oldSides
		  if (sidesDifference > 0) {
			  for (var i = 1; i <= sidesDifference; i++) {
				this.stats.push(this.newRandomValue())
			}
		  } else {
			var absoluteSidesDifference = Math.abs(sidesDifference)
			  for (var i = 1; i <= absoluteSidesDifference; i++) {
				this.stats.shift()
			}
		  }
		},
		stats: function (newStats) {
				TweenLite.to(
			  this.$data,
			this.updateInterval / 1000,
			{ points: generatePoints(newStats) }
			)
		},
		updateInterval: function () {
			this.resetInterval()
		}
	},
	mounted: function () {
		this.resetInterval()
	},
	data () {
		return obj;
	}
})

function valueToPoint (value, index, total) {
	var x     = 0
	var y     = -value * 0.9
	var angle = Math.PI * 2 / total * index
	var cos   = Math.cos(angle)
	var sin   = Math.sin(angle)
	var tx    = x * cos - y * sin + 100
	var ty    = x * sin + y * cos + 100
	return { x: tx, y: ty }
}

function generatePoints (stats) {
	var total = stats.length
	return stats.map(function (stat, index) {
		var point = valueToPoint(stat, index, total)
		return point.x + ',' + point.y
	}).join(' ')
}
