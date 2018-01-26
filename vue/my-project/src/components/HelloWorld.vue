<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p><span v-bind:title="time">鼠标悬停此处查看信息</span></p>
    <p v-if="isTrue">这里是v-if是否显示</p>
    <ol>
      <li v-for="(t,index) in list" :key='index'>
        {{t.text,index}}
      </li>
    </ol>
    <button v-on:click='reverseMsg'>逆转消息</button>
    <p>双向绑定 <input type="text" v-model="name"></p>
    <p>值:{{name}}</p>
    <ol>
      <todo-item
        v-for="item in groupList"
        v-bind:todo="item"
        v-bind:key="item.id">
      </todo-item>
    </ol>
    <button @click="addOption">添加一项</button>
    <p>未使用v-html. {{rawHtml}}</p>
    <p>使用v-html. <span v-html="rawHtml"></span></p>

    <p> <input type="text" v-model="message">文字逆转,原消息:{{message}}</p>
    <p>逆转消息:{{reverseMessage}}</p>

    <div id="watch-example">
      <p>
        Ask a yes/no question:
        <input type="text" v-model="question">
      </p>
      <p>{{ answer }}  <img :src="judgeUrl" alt=""></p>
    </div>
    <!--添加一个数到随机位置-->
    <!-- <div class="css-animate demo" id="list-demo">
      <button @click="addNum">Add</button>
      <button @click="removeNum">Remove</button>
      <transition-group name="list" tag="p">
        <span v-for="item in items" :key="item" class="list-item">{{item}}</span>
      </transition-group>
    </div> -->

    <!--数字表格随机更换位置-->
    <div id="sudoku-demo" class="demo">
      <button @click="shuffle">Shuffle</button>
      <transition-group name="cell" tag="div" class="container">
        <div v-for="cell in cells" :key="cell.id" class="cell">
          {{cell.number}}
        </div>
      </transition-group>
    </div>

    <!--圆形变化-->
    <div id="app">
      <svg width="200" height="200">
        <polygon :points="points"></polygon>
        <circle cx="100" cy="100" r="90"></circle>
      </svg>
      <label>Sides: {{ sides }}</label>
      <input type="range" min="3" max="500" v-model.number="sides">
      <label>Minimum Radius: {{ minRadius }}%</label>
      <input type="range" min="0" max="90" v-model.number="minRadius">
      <label>Update Interval: {{ updateInterval }} milliseconds</label>
      <input type="range" min="10" max="2000" v-model.number="updateInterval">
    </div>
  </div>
</template>

<script src='../../src/components/hello.js'></script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .list-item{
    display: inline-block;
    margin-left: 10px;
  }
  .list-enter-active, .list-leave-active{
    transition: all 1s;
  }
  .list-enter, .list-leave-to{
    opacity: 0;
    transform: translateY(30px);
  }

  .container{
    display: flex;
    flex-wrap: wrap;
    width: 238px;
    margin-top: 10px;
  }
  .cell{
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 25px;
    height: 25px;
    border: 1px solid #aaa;
    margin-right: -1px;
    margin-bottom: -1px;
  }
  .cell:nth-child(3n){
    margin-right: 0;
  }
  .cell:nth-child(27n){
    margin-bottom: 0;
  }
  .cell-move{
    transition: transform 1s;
  }

  svg { display: block; }
  polygon { fill: #41B883; }
  circle {
    fill: transparent;
    stroke: #35495E;
  }
  input[type="range"] {
    display: block;
    width: 100%;
    margin-bottom: 15px;
  }
</style>
