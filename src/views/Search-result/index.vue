<template>
  <div>
    <van-nav-bar left-arrow
                 :title="$route.params.q + '的搜索结果'"
                 @click-left="$router.back()" />
    <van-list v-model="loading"
              :finished="finished"
              finished-text="没有更多了"
              @load="onLoad">
      <van-cell v-for="article in articles"
                :key="article.art_id.toString()"
                :title="article.title" />
    </van-list>
  </div>
</template>

<script>
import { getSearch } from '@/api/search'
export default {
  name: 'SearchResult',
  data () {
    return {
      articles: [],
      loading: false,
      finished: false,
      page: 1
    }
  },

  methods: {
    async onLoad () {
      const { data } = await getSearch({
        q: this.$route.params.q,
        page: this.page,
        perPage: 10
      })
      const results = data.data.results
      if (!results.length) {
        // 数据已经全部加载结束
        this.finished = true
      } else {
        this.articles.push(...results)
        this.page++
      }
      this.loading = false
    }
  }
}
</script>
<style lang="less" scoped>
</style>
