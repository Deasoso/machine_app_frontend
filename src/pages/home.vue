<template>
  <div class="pageborder">
    <div class="pageback">
      <div class="pageinpadding">
        <div>动作列表</div>
        <div>
          <el-row>
            <el-col :span="6" class="onebutton">
              <el-button @click="doaction">动作1</el-button>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { onMounted } from "vue";
import axios from 'axios';

const route = useRoute();

onMounted(async () => {
  const token = route.query ? route.query.token : '';
  var addr = 'http://localhost:8481/api'
  const result = await axios.post(
    addr + '/getactions', 
    {},
    {
      headers: {
        'token': token,
      }
    }
  );
  console.log(result);
  
})

const doaction = () => {
  
}
</script>

<style scoped>
.onebutton{
  margin-top: 10px
}
</style>
