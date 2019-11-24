<template>
  <div>
    <van-nav-bar title="登录"/>
    <van-cell-group>
      <van-field required clearable label="手机" placeholder="请输入手机号"/>

      <van-field type="password" label="验证码" placeholder="请输入验证码" required/>
    </van-cell-group>

    <div class="login-btn">
      <van-button type="info">登录</van-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginIndex',
  data() {
      return {
          user:{
              mobile:'18801185985',
              code:'246810'
          }
      }
  }
}

</script>

<style lang="less" scoped>
.login-btn {
  padding: 20px;
  .van-button {
    width: 100%;
  }
}
</style>
