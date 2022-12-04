const ROW = 20
const COL = 30

export class Grid {
  constructor(obj) {
    const {row, col} = obj
    this.row = row
    this.col = col
    this.id = `${row}-${col}`
  }

  top() {
    const obj = {
      row: this.row - 1,
      col: this.col
    }
    return new Grid(obj)
  }

  right() {
    const obj = {
      row: this.row,
      col: this.col + 1
    }
    return new Grid(obj)
  }

  bottom() {
    const obj = {
      row: this.row + 1,
      col: this.col
    }
    return new Grid(obj)
  }

  left() {
    const obj = {
      row: this.row,
      col: this.col - 1
    }
    return new Grid(obj)
  }

  isSame(grid) {
    const {row, col} = grid
    return this.row === row && this.col === col
  }
}

export default class Chessboard {
  constructor(obj) {
    const { rows, cols, blocks } = obj 
    this.rows = rows
    this.cols = cols
    this.cacheBlocks = []
    this.blockGrids = blocks.map(block => {
      const grid = new Grid({row: block[0], col: block[1]})
      this.cacheBlocks.push(grid.id)
      return grid
    })
  }

  getBestLine(from, des) {
    let result = []
    let resultIds = []
    const stepedGridIds = []

    const seqBy = (step) => {
      let seq = []
      const isR = des.col > step.col
      const isT = step.row > des.row 
      if(isR && isT) {
        seq = ['right', 'top', 'bottom', 'left']
      } else if(isR && !isT) {
        seq = ['right', 'bottom', 'top', 'left']
      } else if(!isR && isT) {
        seq = ['left', 'top', 'bottom', 'right']
      } else {
        seq = ['left', 'bottom', 'top', 'right']
      }
      return seq
    }
    const self = this

    function throughGrid(to, from, grids = []) {
      if(stepedGridIds.includes(to.id) && !resultIds.includes(to.id) ) return false
      if(!self.checkGrid(to)) return false
      if(result.length >= 2 && grids.length > result.length) return false
      if(to && to.isSame(des)) {
        grids.push(to)
        if(result.length === 0 || result.length > grids.length) {
          result = grids
          resultIds = result.map(item => item.id)
        }
        return true
      } 
      grids.push(to)
      stepedGridIds.push(to.id)
      seqBy(to).forEach(dir => {
        const nextGrid = to[dir]()
        if(from && from.isSame(nextGrid)) return
        throughGrid(nextGrid, to, [...grids])
      })
    }
    throughGrid(from, null, [])
    return result
  }
  
  checkGrid(grid) {
    if(grid.row >= this.rows 
      || grid.row < 0 
      || grid.col >= this.cols 
      || grid.col < 0) return false
    if(this.cacheBlocks.includes(grid.id)) return false
    return true
  }
}
