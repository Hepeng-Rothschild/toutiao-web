<template>
  <div>
    <!-- 搜索框 -->
    <form action="/">
      <van-search v-model="searchText"
                  placeholder="请输入搜索关键词"
                  show-action
                  @search="onSearch(searchText)"
                  @cancel="onCancel" />
    </form>
    <!-- /搜索框 -->

    <!-- 联想建议 -->
    <van-cell-group>
      <van-cell icon="search"
                v-for="item in suggestions"
                :key="item"
                @click="onSearch(item)"
                >
        <span slot="title" v-html="highlight(item)"></span>
      </van-cell>
    </van-cell-group>
    <!-- /联想建议 -->

    <!-- 历史记录 -->
    <van-cell-group>
      <van-cell title="历史记录">
        <span style="margin-right: 10px;">全部删除</span>
        <span>完成</span>
        <van-icon slot="right-icon"
                  name="delete"
                  style="line-height: inherit;" />
      </van-cell>
      <van-cell title="hello"
                v-for="value in 5"
                :key="value">
        <van-icon slot="right-icon"
                  name="close"
                  style="line-height: inherit;" />
      </van-cell>
    </van-cell-group>
    <!-- /历史记录 -->
  </div>
</template>

<script>
import { getSuggestion } from '@/api/search'
import { debounce } from 'loadsh'
export default {
  name: 'SearchIndex',
  data () {
    return {
      searchText: '',
      suggestions: []
    }
  },
  watch: {
    searchText: debounce(async function (newVal) {
      if (!newVal.trim().length) {
        return
      }
      const { data } = await getSuggestion(newVal)
      this.suggestions = data.data.options
    }, 500)
  },
  methods: {
    onSearch (q) {
      this.$router.push({
        name:'search-result',
        params:{
          q
        }
      })
     },
    onCancel () { },
    highlight(str) {
      const keyword = this.searchText
      return str.toLowerCase().split(keyword).join(`<span style="color:red;">${keyword}</span>`)
    }
  }
}
</script>
<style lang="less" scoped>
</style>
