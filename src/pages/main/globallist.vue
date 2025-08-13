<template>
  <div class="pageborder">
    <div class="pageback">
      <envir-page-name style="background-color: #ffffff;" :noBack="true" pageName="环境变量查询" />
      <div class="pagepadding">
        <el-button
          size="small"
          type="success"
          style="margin-left: 16px;margin-bottom: 16px;"
          @click="searchDialog = true">筛选设置</el-button>
        <el-button
          size="small"
          type="warning"
          style="margin-left: 16px;margin-bottom: 16px;"
          @click="newDialog = true">新增/修改环境变量</el-button>
        <div v-loading="loading">
          <el-table
            :data="tableData"
            :row-key="row => row.id"
            style="width: 100%">
            <el-table-column label="唯一ID" prop="id"> </el-table-column>
            <el-table-column label="名称" prop="key"> </el-table-column>
            <el-table-column label="内容" prop="value"> </el-table-column>
            <el-table-column label="备注" prop="tip"> </el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button type="primary" @click="openDialog(scope.row.id, scope.row.key, scope.row.value, scope.row.tip)">
                  修改
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div style="margin-top: 30px">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="params.page"
            :page-sizes="[5, 10, 20, 50]"
            :page-size="params.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="allamount"
          >
          </el-pagination>
        </div>
      </div>
    </div>
    <el-dialog :close-on-click-modal="false" title="搜索内容" v-model="searchDialog">
      <div v-for="(search, index1) in searchNameList" :key="index1">
        <el-input placeholder="请输入内容" v-model="searchObj[search.label]" style="margin:5px;">
          <template #prepend>{{search.name}}</template>
        </el-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="searchDialog = false">取 消</el-button>
        <el-button type="primary" @click="search()">搜 索</el-button>
      </div>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" title="修改环境变量" v-model="newDialog" v-loading="newLoading">
      <div v-for="(user, index2) in userNameList" :key="index2">
        <div v-if="user.label == 'value'">
          <div style="border: 1px solid #ccc">
            <Toolbar
              style="border-bottom: 1px solid #ccc"
              :editor="editorRef"
              :defaultConfig="toolbarConfig"
              :mode="mode"
            />
            <Editor
              style="height: 400px; overflow-y: hidden;"
              v-model="valueHtml"
              :defaultConfig="editorConfig"
              :mode="mode"
              @onCreated="handleCreated"
            />
          </div>
        </div>
        <div v-else>
          <el-input placeholder="请输入内容" v-model="userInfoObj[user.label]" style="margin:5px;">
            <template #prepend>{{user.name}}</template>
          </el-input>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="newDialog = false">取 消</el-button>
        <el-button type="primary" @click="newUser()">新增/修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { onBeforeUnmount, ref, shallowRef, onMounted } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css' // 引入 css

import api from '@/api';
import { useRouter } from "vue-router";
import { ElMessage } from 'element-plus'
const router = useRouter();

const input = ref(1);

const params = ref({
  page: 1,
  pagesize: 10
});

const tableData = ref([]);
const allamount = ref(0);
const loading = ref(false);
const searchObj = ref({});
const searchNameList = ref([]);
const searchDialog = ref(false);
const newLoading = ref(false);
const userInfoObj = ref({});
const userNameList = ref([]);
const newDialog = ref(false);

onMounted(async () => {
  searchNameList.value = [];
  searchNameList.value.push({name: '成员id',label: 'tableid'});
  userNameList.value = [];
  userNameList.value.push({name: '唯一id，不填则新增',label: 'id'});
  userNameList.value.push({name: '名称',label: 'key'});
  userNameList.value.push({name: '内容',label: 'value'});
  userNameList.value.push({name: '备注',label: 'tip'});
  await getList();
})

const handleSizeChange = (val) => {
  console.log(`每页 ${val} 条`);
  params.value.pagesize = val;
  params.value.page = 1;
  getList();
}
const handleCurrentChange = (val) => {
  console.log(`当前页: ${val}`);
  params.value.page = val;
  getList();
}
const search = () => {
  searchDialog.value = false;
  params.value.page = 1;
  getList();
}
const getList = async () => {
  try{
    loading.value = true;
    var postbody = {};
    if(params.value.page >= 1){
      postbody.offset = (params.value.page - 1) * params.value.pagesize;
      postbody.limit = params.value.pagesize;
    } 
    postbody.searchObj = searchObj.value;
    const { result } = await api.post('/adminsearchtexts', postbody);
    tableData.value = result.rows;
    allamount.value = result.count;
    loading.value = false;
  }catch(e){
    console.error(e);
    loading.value = false;
  }
}
const newUser = async () => {
  try{
    newLoading.value = true;
    userInfoObj.value.value = valueHtml.value;
    const result = await api.post('/admincreatetexts', {
      obj: userInfoObj.value
    });
    ElMessage('创建成功')
    userInfoObj.value = {};
    newDialog.value = false;
    newLoading.value = false;
    await getList();
  }catch(e){
    console.error(e);
    newLoading.value = false;
  }
}

const openDialog = (id, key, value, tip) => {
  userInfoObj.value.id = id;
  userInfoObj.value.key = key;
  userInfoObj.value.value = value;
  valueHtml.value = value;
  userInfoObj.value.tip = tip;
  newDialog.value = true;
}

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();

// 内容 HTML
const valueHtml = ref('<p>未设置</p>');

const toolbarConfig = {};
const editorConfig = { placeholder: '请输入内容...' };

onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
})

const handleCreated = (editor) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
}

</script>

<style scoped>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 100%;
}
.overhide{
  width: 144px;
  white-space: nowrap; 
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
