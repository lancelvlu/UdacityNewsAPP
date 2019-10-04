const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function urlHelper(inputUrl) {
  if (inputUrl.split(":").length === 1) {
    return "https:" + inputUrl.split(":")[0]
  }
  else {
    return "https:" + inputUrl.split(":")[1]
  }
}

const hotTopicListHelper = (newsType) => {
  // 返回一个Promise实例对象
  return new Promise((resolve, reject) => {
    wx.request({
      url: "https://test-miniprogram.com/api/news/list",
      data: {
        type: newsType,
      },
      success: res => {
        let tempList = []
        res.data.result.forEach(
          (item) => {
            tempList.push(item.id)
          }
        )
        resolve(tempList)
      }
    })
  })
}

const hotTopicDetailHelper = (newsId) => {
  // 返回一个Promise实例对象
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'https://test-miniprogram.com/api/news/detail',
      data: {
        id: newsId,
      },
      success: res => {
        resolve({
          hotTopicId: res.data.result.id,
          hotTopicTitle: res.data.result.title,
          hotTopicCover: urlHelper(res.data.result.firstImage),
          readCount: res.data.result.readCount
          
        })
      }
    })
  })
}

module.exports = {
  formatTime: formatTime,
  urlHelper: urlHelper,
  hotTopicListHelper: hotTopicListHelper,
  hotTopicDetailHelper: hotTopicDetailHelper,
}
