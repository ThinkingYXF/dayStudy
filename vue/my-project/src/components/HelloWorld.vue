<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p v-bind:title="time">鼠标悬停此处查看信息</p>
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
  </div>
</template>

<script src='../../src/components/hello.js'></script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
