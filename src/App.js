import React from 'react'
import digit from './Digit'

// const endTime = new Date(2017, 9, 22, 21, 44, 55)

const endTime = new Date()
endTime.setTime(endTime.getTime() + 24 * 3600 * 1000)

class App extends React.Component {
  constructor () {
    super()
    let width = document.body.clientWidth
    let height = document.body.clientHeight - 5
    let marginLeft = Math.round(width / 10)
    let radius = Math.round(width * 4 / 5 / 108) - 1
    let marginTop = Math.round(height / 5)
    this.state = {
      width,
      height,
      marginTop,
      marginLeft,
      radius,
      second: 0,
      balls: [],
      colors: ['#33b5e5', '#0099cc', '#aa66cc', '#9933cc', '#99cc00', '#669000', '#ffbb33', '#ff8800', '#ff4444', '#cc0000']
    }
    this.draw = this.draw.bind(this)
    this.drawDigit = this.drawDigit.bind(this)
    this.getSecond = this.getSecond.bind(this)
    this.update = this.update.bind(this)
    this.addBalls = this.addBalls.bind(this)
  }
  componentDidMount () {
    let canvas = document.getElementById('canvas')
    let context = canvas.getContext('2d')
    canvas.width = this.state.width
    canvas.height = this.state.height
    this.setState({second: this.getSecond()})
    setInterval(() => {
      this.draw(context)
      this.update()
    }, 50)
  }
  update () {
    let nextTime = Math.round((endTime.getTime() - new Date().getTime()) / 1000)
    let nextHours = parseInt(nextTime / 3600, 10)
    let nextMinutes = parseInt((nextTime - nextHours * 3600) / 60, 10)
    let nextSeconds = nextTime % 60
    let curHours = parseInt(this.state.second / 3600, 10)
    let curMinutes = parseInt((this.state.second - curHours * 3600) / 60, 10)
    let curSeconds = this.state.second % 60
    if (nextSeconds !== curSeconds) {
      if (parseInt(nextHours / 10, 10) !== parseInt(curHours / 10, 10)) {
        this.addBalls(this.state.marginLeft, this.state.marginTop, parseInt(curHours / 10, 10))
      }
      if (parseInt(nextHours % 10, 10) !== parseInt(curHours % 10, 10)) {
        this.addBalls(this.state.marginLeft + 15 * (this.state.radius + 1), this.state.marginTop, parseInt(curHours % 10, 10))
      }
      if (parseInt(nextMinutes / 10, 10) !== parseInt(curMinutes / 10, 10)) {
        this.addBalls(this.state.marginLeft + 39 * (this.state.radius + 1), this.state.marginTop, parseInt(curMinutes / 10, 10))
      }
      if (parseInt(nextMinutes % 10, 10) !== parseInt(curMinutes % 10, 10)) {
        this.addBalls(this.state.marginLeft + 54 * (this.state.radius + 1), this.state.marginTop, parseInt(curMinutes % 10, 10))
      }
      if (parseInt(nextSeconds / 10, 10) !== parseInt(curSeconds / 10, 10)) {
        this.addBalls(this.state.marginLeft + 78 * (this.state.radius + 1), this.state.marginTop, parseInt(nextSeconds / 10, 10))
      }
      if (parseInt(nextSeconds % 10, 10) !== parseInt(curSeconds % 10, 10)) {
        this.addBalls(this.state.marginLeft + 93 * (this.state.radius + 1), this.state.marginTop, parseInt(nextSeconds % 10, 10))
      }
      this.setState({second: nextTime})
    }
    this.updateBalls()
  }
  updateBalls () {
    let balls = this.state.balls.slice()
    let cnt = 0
    for (let i = 0; i < balls.length; i++) {
      balls[i].x += balls[i].vx
      balls[i].y += balls[i].vy
      balls[i].vy += balls[i].g
      if (balls[i].y >= this.state.height - this.state.radius) {
        balls[i].y = this.state.height - this.state.radius
        balls[i].vy = -(balls[i].vy * 0.75)
      }
      if(balls[i].x + this.state.radius > 0 && balls[i].x - this.state.radius < this.state.width) {
        balls[cnt++] = balls[i]
      }
    }
    while (balls.length > cnt) {
      balls.pop()
    }
    this.setState({balls})
  }
  addBalls (x, y, num) {
    for (let i = 0; i < digit[num].length; i++) {
      for (let j = 0; j < digit[num][i].length; j++) {
        if (digit[num][i][j] === 1) {
          let aBall = {
            x: x + j * 2 * (this.state.radius + 1) + (this.state.radius + 1),
            y: y + i * 2 * (this.state.radius + 1) + (this.state.radius + 1),
            g: 1.5 + Math.random(),
            vx: Math.pow(-1, Math.ceil(Math.random() * 1000)) * 4,
            vy: -5,
            color: this.state.colors.slice()[Math.floor(Math.random() * this.state.colors.length)]
          }
          this.setState({balls: [...this.state.balls, aBall]})
        }
      }
    }
  }
  getSecond (context) {
    let curTime = new Date()
    let ret = endTime.getTime() - curTime.getTime()
    ret = Math.round(ret / 1000)
    return ret >= 0 ? ret : 0
  }
  draw (cxt) {
    cxt.clearRect(0, 0, this.state.width, this.state.height) //对一个矩形空间内的图像进行一次刷新操作
    let marginLeft = this.state.marginLeft
    let marginTop = this.state.marginTop
    let radius = this.state.radius
    let hours = parseInt(this.state.second / 3600, 10)
    let minutes = parseInt((this.state.second - hours * 3600) / 60, 10)
    let seconds = this.state.second % 60
    this.drawDigit(marginLeft, marginTop, parseInt(hours / 10, 10), cxt)
    this.drawDigit(marginLeft + 15 * (radius + 1), marginTop, parseInt(hours % 10, 10), cxt)
    this.drawDigit(marginLeft + 30 * (radius + 1), marginTop, 10, cxt)
    this.drawDigit(marginLeft + 39 * (radius + 1), marginTop, parseInt(minutes / 10, 10), cxt)
    this.drawDigit(marginLeft + 54 * (radius + 1), marginTop, parseInt(minutes % 10, 10), cxt)
    this.drawDigit(marginLeft + 69 * (radius + 1), marginTop, 10, cxt)
    this.drawDigit(marginLeft + 78 * (radius + 1), marginTop, parseInt(seconds / 10, 10), cxt)
    this.drawDigit(marginLeft + 93 * (radius + 1), marginTop, parseInt(seconds % 10, 10), cxt)

    let balls = this.state.balls.slice()
    for (let i = 0; i < balls.length; i++) {
      cxt.fillStyle = balls[i].color
      cxt.beginPath()
      cxt.arc(balls[i].x, balls[i].y, this.state.radius, 0, 2 * Math.PI, true)
      cxt.closePath()
      cxt.fill()
    }
  }
  drawDigit (x, y, num, cxt) {
    let radius = this.state.radius
    cxt.fillStyle = 'rgb(0, 102, 153)'
    for (let i = 0; i < digit[num].length; i++) {
      for (let j = 0; j < digit[num][i].length; j++) {
        if (digit[num][i][j] === 1) {
          cxt.beginPath()
          cxt.arc(x + j * 2 * (radius + 1) + (radius + 1), y + i * 2 * (radius + 1) + (radius + 1), radius, 0, 2 * Math.PI)
          cxt.closePath()
          cxt.fill()
        }
      }
    }
  }
  render () {
    return (
      <canvas id='canvas' style={{height: '100%'}}></canvas>
    )
  }
}
export default App
