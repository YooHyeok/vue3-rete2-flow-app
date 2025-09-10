<script setup>
import { onMounted, ref } from 'vue'
import { createEditor } from './rete/editor'
const rete = ref(null)
let cleanup = null;
const render = async () => {
  cleanup = await createEditor(rete.value);
}

const remove = () => {
  console.log(cleanup)
  if (!cleanup) {
    alert('렌더링을 먼저 해주세요')
    return;
  }
  cleanup();
  cleanup = null;
}

onMounted(async () => {
  render();
})
</script>
<template>
  <div class="container">
    <div class="controls">
      <button class="render-btn" @click="render">노드 랜더링</button>
      <button class="remove-btn" @click="remove">캔버스 정리</button>
    </div>
    <div class="canvas-wrapper">
      <div class="rete" ref="rete"></div>
    </div>
  </div>
</template>

<style scoped>
body {
  margin: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f0f0f0;
}

/* 전체 컨테이너: 캔버스 + 버튼 영역 수직 배치 */
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

/* 버튼 영역 */
.controls {
  display: flex;
  justify-content: flex-start; /* 왼쪽 정렬 */
  align-items: center;
  gap: 15px; /* 버튼 사이 간격 */
  padding: 10px 20px;
  background-color: #ffffff;
  border-bottom: 2px solid #ccc;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1); /* 약간 그림자 */
}

/* 버튼 공통 스타일 */
button {
  padding: 10px 18px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  border-radius: 6px;
  border: none;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.15);
}

/* 버튼별 색상 */
.render-btn {
  background-color: #4caf50;
  color: #fff;
}

.render-btn:hover {
  background-color: #45a049;
}

.remove-btn {
  background-color: #f44336;
  color: #fff;
}

.remove-btn:hover {
  background-color: #d32f2f;
}

/* 캔버스 영역 */
.canvas-wrapper {
  flex: 1; /* 남는 공간 모두 차지 */
  border: 2px solid #444;
  background-color: #f9f9f9;
  position: relative;
}

/* 실제 Rete 에디터 영역 */
.rete {
  width: 100%;
  height: 100%;
}
</style>
