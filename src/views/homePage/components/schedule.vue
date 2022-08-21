<template>
  <el-card shadow="hover" style="height: 406px; width: 100%">
    <template #header>
      <span>待办事项</span>
      <el-button
        style="float: right; padding: 3px 0; color: rgb(45 140 240)"
        text
        @click="openDialog('add')"
        >添加</el-button
      >
    </template>
    <el-table
      :show-header="false"
      :data="todoList"
      style="width: 100%"
      ref="table"
      height="288px"
    >
      <el-table-column width="40">
        <template #default="scope">
          <el-checkbox v-model="scope.row.status"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column>
        <template #default="scope">
          <div class="todo-item" :class="{ 'todo-item-del': scope.row.status }">
            {{ scope.row.title }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="40">
        <template #default="scope">
          <el-icon
            ><EditPen
              class="c_pointer"
              @click="openDialog('edit', scope.row, scope.$index)"
          /></el-icon>
        </template>
      </el-table-column>
      <el-table-column width="40">
        <template #default="scope">
          <el-icon class="c_pointer" @click="deleteRow(scope.$index)"
            ><Delete
          /></el-icon>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="dialogTitle" v-model="dialogFormVisible" center>
      <el-input v-model="schedule" placeholder="请输入内容"></el-input>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="closeDialog">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </el-card>
</template>

<script>
import { nextTick, ref } from "vue";
import { storeToRefs } from "pinia";
import { ElMessage, ElMessageBox } from "element-plus";
import { useTodoList } from "@/store/todoList";
export default {
  name: "ScheduleHome",
  setup() {
    const todoListStore = useTodoList();
    const { todoList } = storeToRefs(todoListStore);
    const { updateTodo } = todoListStore;
    const table = ref(null);
    const dialogFormVisible = ref(false);
    const dialogTitle = ref("");
    const schedule = ref("");
    const status = ref(""); //0增加，1编辑
    const itemIndex = ref(0);
    const deleteRow = (index) => {
      ElMessageBox.confirm("此操作将永久删除该事项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          updateTodo({
            type: "delete",
            index,
          });
          ElMessage({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          ElMessage({
            type: "info",
            message: "已取消删除",
          });
        });
    };
    const openDialog = (val, row, index) => {
      itemIndex.value = index;
      status.value = val;
      dialogFormVisible.value = true;
      switch (status.value) {
        case "add":
          schedule.value = "";
          dialogTitle.value = "增加事项";
          return;
        case "edit":
          dialogTitle.value = "编辑事项";
          schedule.value = row.title;
          return;
        default:
          return;
      }
    };
    const closeDialog = () => {
      switch (status.value) {
        case "add":
          updateTodo({ type: "add", data: schedule.value });
          ElMessage({
            type: "success",
            message: "增加成功",
          });
          dialogFormVisible.value = false;
          return;
        case "edit":
          updateTodo({
            type: "edit",
            index: itemIndex.value,
            data: schedule.value,
          });
          ElMessage({
            type: "success",
            message: "编辑成功",
          });
          dialogFormVisible.value = false;
          return;
        default:
          return;
      }
    };
    nextTick(() => {
      //解决IE浏览器渲染过慢，表格宽度计算错误
      table.value.doLayout();
    });
    return {
      todoList,
      table,
      deleteRow,
      openDialog,
      dialogFormVisible,
      dialogTitle,
      schedule,
      status,
      itemIndex,
      closeDialog,
    };
  },
};
</script>

<style lang="scss" scoped>
.c_pointer {
  cursor: $cursor-pointer;
}
.todo-item {
  font-size: 14px;
  @include themify($themes) {
    color: themed("card-font");
  }
}
.todo-item-del {
  text-decoration: line-through;
}
</style>
