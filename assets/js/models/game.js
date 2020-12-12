class Game {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId)
    this.canvas.width = 640
    this.canvas.height = 480
    this.ctx = this.canvas.getContext('2d')

    this.fps = 1000 / 60
    this.drawInterval = undefined

    this.background = new Background(this.ctx)
    this.mario = new Mario(this.ctx, 20, this.canvas.height - 97)

    this.coins = [
      new Coin(this.ctx, this.mario.x + 400, this.mario.y + 10),
      new Coin(this.ctx, this.mario.x + 400, this.mario.y + 10),
      new Coin(this.ctx, this.mario.x + 500, this.mario.y),
      new Coin(this.ctx, this.mario.x + 600, this.mario.y - 10),
      new Coin(this.ctx, this.mario.x + 700, this.mario.y - 20),
      new Coin(this.ctx, this.mario.x + 800, this.mario.y - 10),
      new Coin(this.ctx, this.mario.x + 900, this.mario.y),
      new Coin(this.ctx, this.mario.x + 1000, this.mario.y + 10),
    ]

    this.points = 0
    this.pointsCoin = new Coin(this.ctx, 10, 10)

    const theme = new Audio('./assets/sound/mw-theme.mp3')
    theme.volume = 0.1

    this.sounds = {
      theme,
      coin: new Audio('./assets/sound/coin.wav')
    }
  }

  start() {
    if (!this.drawInterval) {
      this.sounds.theme.play()
      this.drawInterval = setInterval(() => {
        this.clear()
        this.move()
        this.draw()
        this.checkCollisions()
      }, this.fps);
    }
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  draw() {
    this.background.draw()
    this.mario.draw()
    this.coins.forEach(coin => coin.draw())
    this.pointsCoin.draw()

    this.ctx.save()
    this.ctx.font = '18px Arial'
    this.ctx.fillText(`Score: ${this.points}`, 30, 25)
    this.ctx.restore()
  }

  move() {
    if (this.mario.x === this.mario.maxX) {
      this.background.move()
      this.coins.forEach(coin => coin.move())
    }
    this.mario.move()
  }

  onKeyEvent(event) {
    this.mario.onKeyEvent(event)
    this.background.onKeyEvent(event)
    this.coins.forEach(coin => coin.onKeyEvent(event))
  }

  checkCollisions() {
    const restCoins = this.coins.filter(coin => !this.mario.collidesWith(coin))
    const newPoints = this.coins.length - restCoins.length
    this.points += newPoints

    if (newPoints) {
      this.sounds.coin.currentTime = 0
      this.sounds.coin.play()
    }

    this.coins = restCoins
  }
}