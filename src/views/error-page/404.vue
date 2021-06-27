<template>
  <div class="wscn-http404-container">
    <div class="wscn-http404">
      <div class="pic-404">
        404
      </div>
      <div class="bullshit">
        <div class="bullshit__oops"></div>
        <div class="bullshit__headline">{{ message }}</div>
        <div class="bullshit__info">请确定你的访问地址正确，或者点击[回到首页]按钮</div>
        <a href="/" class="bullshit__return-home">回到首页</a>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Page404',
  computed: {
    message () {
      return '当前页面无法访问'
    }
  }
}
</script>

<style lang="scss" scoped>
  .wscn-http404-container{
    position: absolute;
    top: 0;
    left: 0;
    right:0;
    bottom:0;
  }
  .wscn-http404 {
    position: absolute;
    top:50%;
    left:50%;
    transform: translate(-50%,-50%);
    width: 800px;
    overflow: hidden;
    .pic-404 {
      position: relative;
      float: left;
      width: 400px;
      overflow: hidden;

      font-size: 200px;
      color: #677a84;
    }
    .bullshit {
      position: relative;
      float: left;
      width: 300px;
      padding: 30px 0;
      overflow: hidden;
      &__oops {
        font-size: 32px;
        font-weight: bold;
        line-height: 40px;
        color: #222;
        opacity: 0;
        margin-bottom: 20px;
        animation-name: slideUp;
        animation-duration: 0.5s;
        animation-fill-mode: forwards;
      }
      &__headline {
        font-size: 20px;
        line-height: 24px;
        color: #222;
        font-weight: bold;
        opacity: 0;
        margin-bottom: 10px;
        animation-name: slideUp;
        animation-duration: 0.5s;
        animation-delay: 0.1s;
        animation-fill-mode: forwards;
      }
      &__info {
        font-size: 13px;
        line-height: 21px;
        color: grey;
        opacity: 0;
        margin-bottom: 30px;
        animation-name: slideUp;
        animation-duration: 0.5s;
        animation-delay: 0.2s;
        animation-fill-mode: forwards;
      }
      &__return-home {
        display: block;
        float: left;
        width: 110px;
        height: 36px;
        background: #1482f0;
        border-radius: 100px;
        text-align: center;
        color: #ffffff;
        opacity: 0;
        font-size: 14px;
        line-height: 36px;
        cursor: pointer;
        animation-name: slideUp;
        animation-duration: 0.5s;
        animation-delay: 0.3s;
        animation-fill-mode: forwards;
      }
      @keyframes slideUp {
        0% {
          transform: translateY(60px);
          opacity: 0;
        }
        100% {
          transform: translateY(0);
          opacity: 1;
        }
      }
    }
  }
</style>
