<template name="LoadingPage">
  <div class="background">
    <p class="bottomText">Tankmiles.com</p>
    <div class="circlebig">
      <div class="circlesmall">
        <img class="loadingLogo" src="@/assets/Image/homelogo.png" alt="na">
      </div>
    </div>
    <div class="spinner">
      <div class="rect1"></div>
      <div class="rect2"></div>
      <div class="rect3"></div>
      <div class="rect4"></div>
      <div class="rect5"></div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'loadingpage',
  data () {
    return {
      logoUrl: '../assets/Image/homelogo.png'
    }
  }
}
</script>

<style scoped>
  * {
    margin: 0;
    padding: 0;
  }

  .circlebig {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 250px;
    height: 250px;
    border-radius: 50%;
    background-image: linear-gradient(#2F74EB, white);
    animation: circle 20s linear;
    -webkit-animation-iteration-count: infinite;

  }

  .circlesmall {
    width: 230px;
    height: 230px;
    border-radius: 50%;
    background-color: #2D3463;
    transform: none;
    animation: pic 20s linear;
    -webkit-animation-iteration-count: infinite;
  }

  .background {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    left: 0;
    top: 0;
    margin: 0;
    width: 100%;
    height: 100%;
    background-color: #2D3463;
    z-index: 9999;
  }

  .loadingLogo {
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translate(-50%);
    width: 180px;
  }

  .bottomText {
    font-family: "arial, helvetica, sans-serif",sans-serif;
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%);
    font-size: 20px;
    font-weight: bolder;
    color: #FFFFFF;
    -webkit-user-select: none;
  }

  @keyframes circle {
    0% {
      transform: rotate(0deg)
    }

    50% {
      transform: rotate(1800deg)
    }

    100% {
      transform: rotate(3600deg)
    }
  }
  @keyframes pic {
    0% {
      transform: rotate(0deg)
    }

    50% {
      transform: rotate(-1800deg)
    }

    100% {
      transform: rotate(-3600deg)
    }
  }
  .spinner {
    -webkit-user-select: none;
    position: absolute;
    transform: translate(-50%);
    left: 50%;
    top: 80%;
    width: 50px;
    height: 50px;
    text-align: center;
    font-size: 10px;
  }

  .spinner > div {
    background-color: #FFFFFF;
    height: 100%;
    width: 6px;
    display: inline-block;

    -webkit-animation: stretchdelay 2s infinite ease-in-out;
    animation: stretchdelay 2s infinite ease-in-out;
  }

  .spinner .rect2 {
    -webkit-animation-delay: -1.9s;
    animation-delay: -1.9s;
  }

  .spinner .rect3 {
    -webkit-animation-delay: -1.8s;
    animation-delay: -1.8s;
  }

  .spinner .rect4 {
    -webkit-animation-delay: -1.7s;
    animation-delay: -1.7s;
  }

  .spinner .rect5 {
    -webkit-animation-delay: -1.6s;
    animation-delay: -1.6s;
  }

  @-webkit-keyframes stretchdelay {

    0%,
    40%,
    100% {
      -webkit-transform: scaleY(0.4)
    }

    20% {
      -webkit-transform: scaleY(1.0)
    }
  }

  @keyframes stretchdelay {

    0%,
    40%,
    100% {
      transform: scaleY(0.4);
      -webkit-transform: scaleY(0.4);
    }

    20% {
      transform: scaleY(1.0);
      -webkit-transform: scaleY(1.0);
    }
  }
</style>
