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
module.exports = {
  formatTime: formatTime,
  urlHelper: urlHelper
}
