//app.js
App({
  onLaunch: function () {
    const vm = this
    wx.getSystemInfo({
      success: function (res) {
        let clientHeight = res.windowHeight, clientWidth = res.windowWidth, rpxR = 750 / clientWidth;
        // 1.导航栏高度
        // 1.1 安卓
        let totalTopHeight = 68
        if (res.model.indexOf('iPhone X') !== -1) {
          // 1.2\. iPhoneX 高度
          totalTopHeight = 88
        } else if (res.model.indexOf('iPhone') !== -1) {
          // 1.3 非iphoneX的 iphone 高度
          totalTopHeight = 64
        }
        //状态栏 高度
        vm.globalData.statusBarHeight = res.statusBarHeight
        vm.globalData.titleBarHeight = totalTopHeight - res.statusBarHeight
        vm.globalData.navHeight = totalTopHeight;
        vm.globalData.rpxRate = rpxR;
        vm.globalData.clientHeight = clientHeight;
        vm.globalData.clientWidth = clientWidth;
        console.log(vm.globalData.statusBarHeight)
      },

      failure(res) {
        vm.globalData.statusBarHeight = 0
        vm.globalData.titleBarHeight = 0
      }
    })
  },

  globalData: {
    userInfo: null,
    navHeight: 0,
    statusBarHeight: 0,
    titleBarHeight: 0
  }
})