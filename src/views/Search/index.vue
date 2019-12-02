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
    <van-cell-group v-if="suggestions.length">
      <van-cell icon="search"
                v-for="item in suggestions"
                :key="item"
                @click="onSearch(item)">
        <span slot="title"
              v-html="highlight(item)"></span>
      </van-cell>
    </van-cell-group>
    <!-- /联想建议 -->

    <!-- 历史记录 -->
    <van-cell-group v-else>
      <van-cell title="历史记录">
        <div v-show="isDeleteShow">
          <span style="margin-right: 10px;" @click="searchHistories = []">全部删除</span>
          <span @click="isDeleteShow = false">完成</span>
        </div>
        <van-icon slot="right-icon"
                  name="delete"
                  style="line-height: inherit;"
                  v-show="!isDeleteShow"
                  @click="isDeleteShow = true" />
      </van-cell>
      <van-cell :title="item"
                v-for="(item,index) in searchHistories"
                :key="item">
        <van-icon slot="right-icon"
                  name="close"
                  style="line-height: inherit;"
                  v-show="isDeleteShow" @click="searchHistories.splice(index,1)"/>
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
      suggestions: [],
      searchHistories: JSON.parse(window.localStorage.getItem('search-histories')) || [],
      isDeleteShow: false
    }
  },
  watch: {
    searchText: debounce(async function (newVal) {
      if (!newVal.trim().length) {
        this.suggestions = []
        return
      }
      const { data } = await getSuggestion(newVal)
      this.suggestions = data.data.options
    }, 500),
    searchHistories () {
      window.localStorage.setItem('search-histories', JSON.stringify(this.searchHistories))
    }
  },
  methods: {
    onSearch (q) {
      // 记录搜索历史记录
      const { searchHistories } = this
      // 定义搜索历史记录的索引
      const index = searchHistories.findIndex(item => item === q)
      // 如果索引不等于-1，则替换页历史记录数组中的数据
      if (index !== -1) {
        searchHistories.splice(index, 1)
      }
      // 向搜索历史记录数组的0号索引添加最近的历史记录
      this.searchHistories.unshift(q)
      // 控制搜索跳转
      this.$router.push({
        name: 'search-result',
        params: {
          q
        }
      })
    },
    onCancel () { },
    highlight (str) {
      const keyword = this.searchText
      return str.toLowerCase().split(keyword).join(`<span style="color:red;">${keyword}</span>`)
    }
  }
}
</script>
<style lang="less" scoped>
</style>
