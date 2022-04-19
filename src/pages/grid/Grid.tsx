import React, { Component, SyntheticEvent } from "react";
import { MineButton, ButtonsGroup } from "../../components/buttons";
import { Mine } from "../../models";

interface IProps {}

interface IState {
  grid: Mine[];
  remainingBombs: number;
}

export default class Grid extends Component<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.grid = this.getGrid(this.size);
    this.state = {
      grid: this.grid.flat(),
      remainingBombs: this.bombsNumber[this.size],
    };
  }

  private size = 14;
  private bombsNumber: { [key: number]: number } = {
    10: 10,
    14: 40,
    20: 100,
  };
  private dificulties: { [key: string]: number } = {
    Easy: 10,
    Medium: 14,
    Hard: 20,
  };
  private grid: Mine[][];

  render() {
    return (
      <div className="text-center flex flex-row justify-content-center">
        <div className="basis-1/5">
          <ButtonsGroup
            data={Object.entries(this.dificulties).map(([text, value]) => ({
              text,
              value,
            }))}
            clickHandler={this.refreshGrid}
          />
          <p>Remaining bombs: {this.state.remainingBombs}</p>
        </div>
        <div
          onContextMenu={(event) => event.preventDefault()}
          className={
            "justify-self-center inline-grid gap-1 p-2 rounded-lg dark:bg-gray-700" +
            (this.size === 10 ? " grid-cols-10" : " ") +
            (this.size === 14 ? " grid-cols-14" : " ") +
            (this.size === 20 ? " grid-cols-20" : " ")
          }
        >
          {this.state.grid.map((x) => (
            <MineButton key={x.id} {...x} clickHandler={this.handleClick} />
          ))}
        </div>
      </div>
    );
  }

  private getGrid(size: number): Mine[][] {
    const grid = new Array(size);
    const bombs = this.getRandomIds(this.bombsNumber[size], size);

    for (let i = 0; i < size; ++i) {
      grid[i] = new Array(size);
      for (let j = 0; j < size; ++j) {
        grid[i][j] = {
          id: `${i}-${j}`,
          isOpen: false,
          isFlagged: false,
          hasMine: bombs.has(`${i}-${j}`),
          content: bombs.has(`${i}-${j}`) ? "B" : undefined,
        };
      }
    }

    return this.generateBombHintNumbers(grid, bombs);
  }

  private refreshGrid = (size: number): void => {
    this.size = size;

    this.grid = this.getGrid(size);
    this.setState({
      grid: this.grid.flat(),
    });
  };

  private handleClick = (event: SyntheticEvent, id: string) => {
    event.preventDefault();

    const [x, y] = id.split("-").map((x) => +x);

    if (!this.grid[x][y].content && !this.grid[x][y].hasMine) {
      this.revealEmptyMines(x, y);
    }

    if (event.type === "contextmenu" && !this.grid[x][y].isOpen) {
      this.grid[x][y].isFlagged = !this.grid[x][y].isFlagged;
      const newCount =
        this.state.remainingBombs + (this.grid[x][y].isFlagged ? -1 : 1);
      this.setState({
        remainingBombs: newCount,
      });
    } else if (event.type === "click") {
      this.grid[x][y].isOpen = true;
    }

    this.setState({
      grid: this.grid.flat(),
    });
  };

  private getRandomIds(count: number, size: number): Set<string> {
    const bombs = new Set<string>();

    while (bombs.size < count) {
      bombs.add(
        `${Math.floor(Math.random() * size)}-${Math.floor(
          Math.random() * size
        )}`
      );
    }
    return bombs;
  }

  private generateBombHintNumbers(
    grid: Mine[][],
    bombs: Set<string>
  ): Mine[][] {
    bombs.forEach((index) => {
      const [x, y] = index.split("-").map((x) => +x);
      for (let i = -1; i <= 1; ++i) {
        for (let j = -1; j <= 1; ++j) {
          if (
            this.isInBounds(grid.length, x + i, y + j) &&
            !grid[x + i][y + j].hasMine
          ) {
            grid[x + i][y + j].content = this.countBombs(grid, x + i, y + j);
          }
        }
      }
    });
    return grid;
  }

  private countBombs(grid: Mine[][], x: number, y: number): number {
    let counter = 0;
    for (let i = -1; i <= 1; ++i) {
      for (let j = -1; j <= 1; ++j) {
        if (
          this.isInBounds(grid.length, x + i, y + j) &&
          grid[x + i][y + j].hasMine
        ) {
          ++counter;
        }
      }
    }
    return counter;
  }

  private revealEmptyMines(x: number, y: number): void {
    for (let i = -1; i <= 1; ++i) {
      for (let j = -1; j <= 1; ++j) {
        if (
          this.isInBounds(this.grid.length, x + i, y + j) &&
          !this.grid[x + i][y + j].isOpen &&
          !this.grid[x + i][y + j].hasMine
        ) {
          this.grid[x + i][y + j].isOpen = true;
          if (!this.grid[x + i][y + j].content) {
            this.revealEmptyMines(x + i, y + j);
          }
        }
      }
    }
  }

  private isInBounds(size: number, x: number, y: number): boolean {
    return x >= 0 && y >= 0 && x < size && y < size;
  }
}
