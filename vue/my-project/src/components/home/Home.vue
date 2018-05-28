<template>
	<div class="wrapper">
		<h1>{{ title }}</h1>
		<p>{{ content }}</p>
	</div>
</template>
<script>
var obj = {
	title: 'home',
	content: '阿三等奖哈达和'
}
export default {
	name: 'Home',
	data(){
		return obj;
	}
}
</script>

<style scoped>
	.wrapper > h1 {
		text-align: center;
		color: aquamarine;
	}
</style>

